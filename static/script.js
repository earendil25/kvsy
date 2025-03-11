// Ad popup handling
document.querySelector('.ad-close').addEventListener('click', function() {
    document.getElementById('ad-popup').style.display = 'none';
});

// Function to show ad popup
function showAdPopup() {
    document.getElementById('ad-popup').style.display = 'flex';
}

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

function createScoreBar(university, score, maxScore, isTop) {
    const barItem = document.createElement('div');
    barItem.className = 'score-bar-item';
    
    const scoreBarInfo = document.createElement('div');
    scoreBarInfo.className = 'score-bar-info';
    
    const logo = document.createElement('img');
    logo.src = `/static/images/${university}_logo.png`;
    logo.alt = `${university === 'yonsei' ? '연세대학교' : '고려대학교'} 로고`;
    logo.className = 'university-logo-small';
    
    const scoreText = document.createElement('span');
    scoreText.textContent = score;
    
    scoreBarInfo.appendChild(logo);
    scoreBarInfo.appendChild(scoreText);
    
    const barContainer = document.createElement('div');
    barContainer.className = 'score-bar-container';
    
    const bar = document.createElement('div');
    bar.className = `score-bar ${university}`;
    const percentage = (score / (maxScore || 1)) * 100;
    bar.style.width = `${percentage}%`;
    bar.textContent = score;
    
    barContainer.appendChild(bar);
    barItem.appendChild(scoreBarInfo);
    barItem.appendChild(barContainer);
    
    return barItem;
}

function gameOver() {
    clearInterval(timerInterval);
    
    // Show ad popup when game is over
    showAdPopup();
    
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
        
        // Clear previous score bars
        const scoreBarsContainer = document.getElementById('score-bars');
        scoreBarsContainer.innerHTML = '';
        
        // Calculate max score for percentage calculation
        const maxScore = Math.max(data.yonsei_score, data.korea_score);
        
        // Create and append score bars in order (higher score first)
        if (data.yonsei_score >= data.korea_score) {
            scoreBarsContainer.appendChild(createScoreBar('yonsei', data.yonsei_score, maxScore, true));
            scoreBarsContainer.appendChild(createScoreBar('korea', data.korea_score, maxScore, false));
        } else {
            scoreBarsContainer.appendChild(createScoreBar('korea', data.korea_score, maxScore, true));
            scoreBarsContainer.appendChild(createScoreBar('yonsei', data.yonsei_score, maxScore, false));
        }
    });
} 