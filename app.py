from flask import Flask, render_template, request, jsonify, session
import json
import random
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Load quiz data
with open('data/quiz.json', 'r', encoding='utf-8') as f:
    QUIZ_DATA = json.load(f)

# In-memory storage for scores (in production, this should be a database)
scores = {
    'yonsei': 0,
    'korea': 0
}

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
        scores[university] = scores[university] + 1
    
    return jsonify({
        'yonsei_score': scores['yonsei'],
        'korea_score': scores['korea']
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 