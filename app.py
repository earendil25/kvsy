from flask import Flask, render_template, request, jsonify, session
import json
import random
from datetime import datetime
import os
import sqlite3

app = Flask(__name__)
app.secret_key = os.urandom(24)

# 점수 가져오기 함수
def get_scores():
    try:
        if not os.path.exists('data/scores.db'):
            app.logger.error("데이터베이스 파일이 없습니다. 'python init_db.py'를 실행하여 먼저 초기화해주세요.")
            return {'yonsei': 0, 'korea': 0}
            
        conn = sqlite3.connect('data/scores.db')
        c = conn.cursor()
        c.execute('SELECT school_name, score FROM school_scores')
        result = c.fetchall()
        conn.close()
        
        scores = {}
        for school, score in result:
            scores[school] = score
        
        return scores
    except Exception as e:
        app.logger.error(f"점수 조회 중 오류 발생: {str(e)}")
        return {'yonsei': 0, 'korea': 0}

# 점수 업데이트 함수
def update_score(school_name):
    try:
        if not os.path.exists('data/scores.db'):
            app.logger.error("데이터베이스 파일이 없습니다. 'python init_db.py'를 실행하여 먼저 초기화해주세요.")
            return False
            
        conn = sqlite3.connect('data/scores.db')
        c = conn.cursor()
        c.execute('UPDATE school_scores SET score = score + 1, last_updated = CURRENT_TIMESTAMP WHERE school_name = ?', (school_name,))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        app.logger.error(f"점수 업데이트 중 오류 발생: {str(e)}")
        return False

# Load quiz data
with open('data/quiz.json', 'r', encoding='utf-8') as f:
    QUIZ_DATA = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_question', methods=['GET'])
def get_question():
    # Get a random question
    question = random.choice(list(QUIZ_DATA.keys()))
    return jsonify({
        'question': question,
        'answer': QUIZ_DATA[question]
    })

#submit answer
@app.route('/submit_answer', methods=['POST'])
def submit_answer():
    data = request.json
    university = data.get('university')
    is_correct = data.get('isCorrect')
    
    if is_correct:
        update_score(university)
    
    scores = get_scores()
    return jsonify({
        'yonsei_score': scores.get('yonsei', 0),
        'korea_score': scores.get('korea', 0)
    })

if __name__ == '__main__':
    # 앱 시작 시 데이터베이스 존재 여부 확인
    if not os.path.exists('data/scores.db'):
        print("\n경고: 데이터베이스 파일이 없습니다!")
        print("다음 명령을 실행하여 데이터베이스를 초기화하세요:")
        print("python init_db.py\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True) 