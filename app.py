from flask import Flask, render_template, request, jsonify, session
import os
import json
from src.data.quiz_data import quiz_data
import random

app = Flask(__name__)
app.secret_key = os.urandom(24)

# File to store scores
SCORES_FILE = 'scores.json'

# Initialize scores
def load_scores():
    if os.path.exists(SCORES_FILE):
        try:
            with open(SCORES_FILE, 'r') as f:
                scores = json.load(f)
                return scores.get('yonsei', 0), scores.get('korea', 0)
        except:
            return 0, 0
    return 0, 0

# Save scores to file
def save_scores(yonsei_score, korea_score):
    with open(SCORES_FILE, 'w') as f:
        json.dump({
            'yonsei': yonsei_score,
            'korea': korea_score
        }, f)

# Global variables to store scores
yonsei_score, korea_score = load_scores()

# Store shuffled questions for each session
session_questions = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    # Generate a unique session ID if not exists
    if 'session_id' not in session:
        session['session_id'] = os.urandom(16).hex()
    
    # Reset session data for a new game
    session['current_question'] = 0
    session['score'] = 0
    session['university'] = request.args.get('university', 'yonsei')
    
    # Shuffle quiz questions and store in server-side dictionary
    session_questions[session['session_id']] = random.sample(quiz_data, len(quiz_data))
    
    return render_template('game.html', university=session['university'])

@app.route('/api/question', methods=['GET'])
def get_question():
    session_id = session.get('session_id')
    current_question = session.get('current_question', 0)
    
    # Get shuffled questions for this session
    shuffled_questions = session_questions.get(session_id, quiz_data)
    
    if current_question >= len(shuffled_questions):
        return jsonify({'gameOver': True})
    
    question_data = shuffled_questions[current_question]
    return jsonify({
        'question': question_data['question'],
        'questionNumber': current_question + 1,
        'totalQuestions': len(shuffled_questions)
    })

@app.route('/api/answer', methods=['POST'])
def check_answer():
    global yonsei_score, korea_score
    
    session_id = session.get('session_id')
    data = request.get_json()
    user_answer = data.get('answer')
    current_question = session.get('current_question', 0)
    
    # Get shuffled questions for this session
    shuffled_questions = session_questions.get(session_id, quiz_data)
    
    if current_question >= len(shuffled_questions):
        return jsonify({'gameOver': True})
    
    correct_answer = shuffled_questions[current_question]['answer']
    is_correct = user_answer == correct_answer
    
    if is_correct:
        session['score'] = session.get('score', 0) + 1
        
        # Update global score based on university
        if session.get('university') == 'yonsei':
            yonsei_score += 1
        else:
            korea_score += 1
        
        # Save scores to file
        save_scores(yonsei_score, korea_score)
    
    # Move to the next question
    session['current_question'] = current_question + 1
    
    return jsonify({
        'correct': is_correct,
        'correctAnswer': correct_answer,
        'score': session.get('score', 0),
        'gameOver': not is_correct  # Game over if answer is wrong
    })

@app.route('/api/result', methods=['GET'])
def get_result():
    # Clean up session data
    if 'session_id' in session and session['session_id'] in session_questions:
        del session_questions[session['session_id']]
    
    return jsonify({
        'score': session.get('score', 0),
        'yonseiScore': yonsei_score,
        'koreaScore': korea_score
    })

if __name__ == '__main__':
    # Heroku는 PORT 환경 변수를 제공합니다
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port) 