import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event, context):
    """API для сохранения и проверки результатов олимпиады"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Participant-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        return save_results(event)
    elif method == 'GET':
        return get_results(event)
    else:
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

def save_results(event):
    """Сохранение ответов участника"""
    try:
        body = json.loads(event.get('body', '{}'))
        
        participant_id = body.get('participant_id')
        answers = body.get('answers', [])
        
        if not participant_id or not answers:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'participant_id и answers обязательны'}),
                'isBase64Encoded': False
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        total_points = 0
        correct_count = 0
        
        for answer in answers:
            task_id = answer.get('task_id')
            user_answer = answer.get('answer', '').strip()
            time_spent = answer.get('time_spent_seconds', 0)
            
            cursor.execute("""
                SELECT correct_answer, points FROM tasks WHERE id = %s
            """, (task_id,))
            
            task = cursor.fetchone()
            if not task:
                continue
            
            is_correct = user_answer == task['correct_answer']
            if is_correct:
                total_points += task['points']
                correct_count += 1
            
            cursor.execute("""
                INSERT INTO results (participant_id, task_id, user_answer, is_correct, answered_at, time_spent_seconds)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (participant_id, task_id) 
                DO UPDATE SET 
                    user_answer = EXCLUDED.user_answer,
                    is_correct = EXCLUDED.is_correct,
                    answered_at = EXCLUDED.answered_at,
                    time_spent_seconds = EXCLUDED.time_spent_seconds
            """, (participant_id, task_id, user_answer, is_correct, datetime.now(), time_spent))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'total_points': total_points,
                'correct_count': correct_count,
                'total_tasks': len(answers)
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}, ensure_ascii=False),
            'isBase64Encoded': False
        }

def get_results(event):
    """Получение результатов участника"""
    try:
        params = event.get('queryStringParameters') or {}
        participant_id = params.get('participant_id')
        
        if not participant_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'participant_id обязателен'}),
                'isBase64Encoded': False
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            SELECT 
                r.task_id,
                t.question,
                r.user_answer,
                r.is_correct,
                t.points,
                r.answered_at
            FROM results r
            JOIN tasks t ON r.task_id = t.id
            WHERE r.participant_id = %s
            ORDER BY t.order_number
        """, (participant_id,))
        
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        results_list = []
        total_points = 0
        
        for result in results:
            results_list.append({
                'task_id': result['task_id'],
                'question': result['question'],
                'user_answer': result['user_answer'],
                'is_correct': result['is_correct'],
                'points': result['points'] if result['is_correct'] else 0
            })
            if result['is_correct']:
                total_points += result['points']
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'results': results_list,
                'total_points': total_points
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}, ensure_ascii=False),
            'isBase64Encoded': False
        }
