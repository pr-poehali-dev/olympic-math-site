import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    """API для получения заданий олимпиады"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            SELECT id, question, points, difficulty_level, order_number
            FROM tasks
            ORDER BY order_number
        """)
        
        tasks = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        tasks_list = []
        for task in tasks:
            tasks_list.append({
                'id': task['id'],
                'question': task['question'],
                'points': task['points'],
                'difficulty_level': task['difficulty_level'],
                'order_number': task['order_number']
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'tasks': tasks_list,
                'total': len(tasks_list)
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
