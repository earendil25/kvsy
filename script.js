// DOM Elements
const schoolSelectScreen = document.getElementById('school-select-screen');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const yonseiButton = document.getElementById('yonsei-button');
const koreaButton = document.getElementById('korea-button');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const changeSchoolButton = document.getElementById('change-school-button');
const trueButton = document.getElementById('true-button');
const falseButton = document.getElementById('false-button');
const questionText = document.getElementById('question-text');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const finalScoreElement = document.getElementById('final-score');
const selectedSchoolElement = document.getElementById('selected-school');
const gameSchoolNameElement = document.getElementById('game-school-name');
const resultSchoolNameElement = document.getElementById('result-school-name');
const yonseiTotalScoreElement = document.getElementById('yonsei-total-score');
const koreaTotalScoreElement = document.getElementById('korea-total-score');

// Game variables
let questions = {};
let currentQuestion = '';
let currentAnswer = '';
let score = 0;
let timer = 3;
let timerInterval;
let questionKeys = [];
let usedQuestionIndices = [];
let selectedSchool = '';
let yonseiTotalScore = 0;
let koreaTotalScore = 0;

// Local storage keys
const YONSEI_SCORE_KEY = 'yonseiTotalScore';
const KOREA_SCORE_KEY = 'koreaTotalScore';

// Fetch questions from JSON file
async function fetchQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        questionKeys = Object.keys(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionText.textContent = '질문을 불러오는 중 오류가 발생했습니다.';
    }
}

// Initialize the game
async function initGame() {
    await fetchQuestions();
    
    // Load total scores from local storage
    loadTotalScores();
    
    // Add event listeners for school selection
    yonseiButton.addEventListener('click', () => selectSchool('연세대학교'));
    koreaButton.addEventListener('click', () => selectSchool('고려대학교'));
    
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    changeSchoolButton.addEventListener('click', changeSchool);
    trueButton.addEventListener('click', () => checkAnswer('O'));
    falseButton.addEventListener('click', () => checkAnswer('X'));
}

// Load total scores from local storage
function loadTotalScores() {
    const savedYonseiScore = localStorage.getItem(YONSEI_SCORE_KEY);
    const savedKoreaScore = localStorage.getItem(KOREA_SCORE_KEY);
    
    if (savedYonseiScore !== null) {
        yonseiTotalScore = parseInt(savedYonseiScore);
    }
    
    if (savedKoreaScore !== null) {
        koreaTotalScore = parseInt(savedKoreaScore);
    }
    
    updateTotalScores();
}

// Save total scores to local storage
function saveTotalScores() {
    localStorage.setItem(YONSEI_SCORE_KEY, yonseiTotalScore.toString());
    localStorage.setItem(KOREA_SCORE_KEY, koreaTotalScore.toString());
}

// Update total scores display
function updateTotalScores() {
    yonseiTotalScoreElement.textContent = yonseiTotalScore;
    koreaTotalScoreElement.textContent = koreaTotalScore;
}

// Select school
function selectSchool(school) {
    selectedSchool = school;
    selectedSchoolElement.textContent = school;
    gameSchoolNameElement.textContent = school;
    resultSchoolNameElement.textContent = school;
    
    // Apply school theme
    const container = document.querySelector('.container');
    container.classList.remove('yonsei-theme', 'korea-theme');
    
    if (school === '연세대학교') {
        container.classList.add('yonsei-theme');
    } else {
        container.classList.add('korea-theme');
    }
    
    schoolSelectScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// Change school
function changeSchool() {
    gameOverScreen.classList.add('hidden');
    schoolSelectScreen.classList.remove('hidden');
}

// Start the game
function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    score = 0;
    usedQuestionIndices = [];
    updateScore();
    nextQuestion();
}

// Restart the game
function restartGame() {
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    score = 0;
    usedQuestionIndices = [];
    updateScore();
    nextQuestion();
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
    finalScoreElement.textContent = score;
}

// Get a random question that hasn't been used yet
function getRandomQuestion() {
    if (usedQuestionIndices.length >= questionKeys.length) {
        // All questions have been used, reset the used questions
        usedQuestionIndices = [];
    }
    
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * questionKeys.length);
    } while (usedQuestionIndices.includes(randomIndex));
    
    usedQuestionIndices.push(randomIndex);
    return questionKeys[randomIndex];
}

// Set the next question
function nextQuestion() {
    clearInterval(timerInterval);
    timer = 3;
    timerElement.textContent = timer;
    
    currentQuestion = getRandomQuestion();
    currentAnswer = questions[currentQuestion];
    
    questionText.textContent = currentQuestion;
    
    startTimer();
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

// Check the answer
function checkAnswer(answer) {
    clearInterval(timerInterval);
    
    if (answer === currentAnswer) {
        score++;
        updateScore();
        nextQuestion();
    } else {
        gameOver();
    }
}

// Game over
function gameOver() {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
    
    // Update total score based on selected school
    if (selectedSchool === '연세대학교') {
        yonseiTotalScore += score;
    } else if (selectedSchool === '고려대학교') {
        koreaTotalScore += score;
    }
    
    // Update and save total scores
    updateTotalScores();
    saveTotalScores();
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame); 