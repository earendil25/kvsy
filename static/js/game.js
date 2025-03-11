document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const quizSection = document.getElementById('quiz-section');
    const resultSection = document.getElementById('result-section');
    const questionText = document.getElementById('question-text');
    const questionNumber = document.getElementById('question-number');
    const btnO = document.getElementById('btn-o');
    const btnX = document.getElementById('btn-x');
    const timerProgress = document.getElementById('timer-progress');
    const timerText = document.getElementById('timer-text');
    const scoreValue = document.getElementById('score-value');
    const correctCount = document.getElementById('correct-count');
    const totalScoreValue = document.getElementById('total-score-value');
    const yonseiScoreBar = document.getElementById('yonsei-score-bar');
    const koreaScoreBar = document.getElementById('korea-score-bar');
    const yonseiScoreValue = document.getElementById('yonsei-score-value');
    const koreaScoreValue = document.getElementById('korea-score-value');
    const yonseiScoreOverlay = document.getElementById('yonsei-score-overlay');
    const koreaScoreOverlay = document.getElementById('korea-score-overlay');
    
    // Game variables
    let timer;
    let timeLeft;
    const timeLimit = 3; // 3 seconds per question
    
    // Disable answer buttons initially
    btnO.disabled = true;
    btnX.disabled = true;
    
    // Load the first question
    loadQuestion();
    
    // Event listeners for answer buttons
    btnO.addEventListener('click', function() {
        submitAnswer('O');
    });
    
    btnX.addEventListener('click', function() {
        submitAnswer('X');
    });
    
    // Function to load a question
    function loadQuestion() {
        fetch('/api/question')
            .then(response => response.json())
            .then(data => {
                if (data.gameOver) {
                    showResults();
                    return;
                }
                
                // Update question text and number
                questionText.textContent = data.question;
                questionNumber.textContent = `${data.questionNumber} / ${data.totalQuestions}`;
                
                // Reset and start the timer
                resetTimer();
                startTimer();
                
                // Enable answer buttons
                btnO.disabled = false;
                btnX.disabled = false;
            })
            .catch(error => {
                console.error('Error loading question:', error);
            });
    }
    
    // Function to submit an answer
    function submitAnswer(answer) {
        // Stop the timer
        clearInterval(timer);
        
        // Disable answer buttons
        btnO.disabled = true;
        btnX.disabled = true;
        
        // Send the answer to the server
        fetch('/api/answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answer: answer })
        })
        .then(response => response.json())
        .then(data => {
            if (data.gameOver) {
                // Game over, show results
                showResults();
            } else {
                // Load the next question after a short delay
                setTimeout(loadQuestion, 1000);
            }
        })
        .catch(error => {
            console.error('Error submitting answer:', error);
        });
    }
    
    // Function to reset the timer
    function resetTimer() {
        timeLeft = timeLimit;
        timerText.textContent = timeLeft;
        timerProgress.style.width = '100%';
    }
    
    // Function to start the timer
    function startTimer() {
        timer = setInterval(function() {
            timeLeft -= 0.1;
            
            // Update timer display
            timerText.textContent = Math.ceil(timeLeft);
            const progressWidth = (timeLeft / timeLimit) * 100;
            timerProgress.style.width = `${progressWidth}%`;
            
            // Change color as time runs out
            if (timeLeft <= 1) {
                timerProgress.style.backgroundColor = '#f44336';
            } else {
                timerProgress.style.backgroundColor = '#4CAF50';
            }
            
            // Time's up
            if (timeLeft <= 0) {
                clearInterval(timer);
                submitAnswer(''); // Submit empty answer (time's up)
            }
        }, 100);
    }
    
    // Function to show the results
    function showResults() {
        // Hide quiz section and show result section
        quizSection.style.display = 'none';
        resultSection.style.display = 'block';
        
        // Get the final results from the server
        fetch('/api/result')
            .then(response => response.json())
            .then(data => {
                // Update personal score
                scoreValue.textContent = data.score;
                correctCount.textContent = data.score;
                
                // Update university scores
                yonseiScoreValue.textContent = data.yonseiScore;
                koreaScoreValue.textContent = data.koreaScore;
                
                // Update score overlays
                yonseiScoreOverlay.textContent = data.yonseiScore;
                koreaScoreOverlay.textContent = data.koreaScore;
                
                // Calculate max score for percentage
                const maxScore = Math.max(data.yonseiScore, data.koreaScore);
                const yonseiPercentage = maxScore > 0 ? (data.yonseiScore / maxScore) * 100 : 0;
                const koreaPercentage = maxScore > 0 ? (data.koreaScore / maxScore) * 100 : 0;
                
                // Animate score bars
                setTimeout(() => {
                    yonseiScoreBar.style.width = `${yonseiPercentage}%`;
                    koreaScoreBar.style.width = `${koreaPercentage}%`;
                    
                    // Show score overlays after bars are animated
                    setTimeout(() => {
                        yonseiScoreOverlay.style.opacity = '1';
                        koreaScoreOverlay.style.opacity = '1';
                    }, 500);
                }, 300);
            })
            .catch(error => {
                console.error('Error loading results:', error);
            });
    }
}); 