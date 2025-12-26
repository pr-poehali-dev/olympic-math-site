import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event, context):
    """API для регистрации участников олимпиады"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
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
        body = json.loads(event.get('body', '{}'))
        
        student_name = body.get('student_name', '').strip()
        school = body.get('school', '').strip()
        class_name = body.get('class_name', '').strip()
        parent_name = body.get('parent_name', '').strip()
        email = body.get('email', '').strip()
        phone = body.get('phone', '').strip()
        
        if not all([student_name, school, class_name, parent_name, email, phone]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Все поля обязательны для заполнения'}),
                'isBase64Encoded': False
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("""
            INSERT INTO participants (student_name, school, class_name, parent_name, email, phone)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, student_name, email, registered_at, payment_status
        """, (student_name, school, class_name, parent_name, email, phone))
        
        participant = cursor.fetchone()
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Регистрация успешна! На ваш email будет отправлена ссылка на оплату.',
                'participant': {
                    'id': participant['id'],
                    'student_name': participant['student_name'],
                    'email': participant['email'],
                    'registered_at': participant['registered_at'].isoformat(),
                    'payment_status': participant['payment_status']
                }
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except psycopg2.IntegrityError:
        return {
            'statusCode': 409,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Этот email уже зарегистрирован'}, ensure_ascii=False),
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
