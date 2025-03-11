let currentScore = 0;
let selectedUniversity = '';
let timerInterval;

// Handle university selection
document.querySelectorAll('.university-btn').forEach(button => {
    button.addEventListener('click', function() {
        selectedUniversity = this.dataset.university;
        document.getElementById('university-selection').classList.add('d-none');
        document.getElementById('quiz-screen').classList.remove('d-none');
        loadNewQuestion();
    });
});

// Handle answer selection
document.querySelectorAll('.answer-btn').forEach(button => {
    button.addEventListener('click', function() {
        clearInterval(timerInterval);
        checkAnswer(this.dataset.answer);
    });
});

function startTimer() {
    let timeLeft = 3;
    document.getElementById('timer-value').textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-value').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function loadNewQuestion() {
    fetch('/get_question')
        .then(response => response.json())
        .then(data => {
            document.getElementById('question-text').textContent = data.question;
            document.querySelector('.question-box').dataset.answer = data.answer;
            startTimer();
        });
}

function checkAnswer(selectedAnswer) {
    const correctAnswer = document.querySelector('.question-box').dataset.answer;
    
    if (selectedAnswer === correctAnswer) {
        currentScore++;
        document.getElementById('current-score').textContent = currentScore;
        
        // Submit score to server
        fetch('/submit_answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                university: selectedUniversity,
                isCorrect: true
            })
        })
        .then(response => response.json())
        .then(data => {
            loadNewQuestion();
        });
    } else {
        gameOver();
    }
}

function gameOver() {
    clearInterval(timerInterval);
    
    // Get final scores
    fetch('/submit_answer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            university: selectedUniversity,
            isCorrect: false
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('quiz-screen').classList.add('d-none');
        document.getElementById('game-over-screen').classList.remove('d-none');
        document.getElementById('final-score').textContent = currentScore;
        document.getElementById('yonsei-score').textContent = data.yonsei_score;
        document.getElementById('korea-score').textContent = data.korea_score;
    });
} 