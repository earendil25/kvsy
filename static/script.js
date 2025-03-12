// Ad popup handling
document.querySelector('.ad-close').addEventListener('click', function(e) {
    e.stopPropagation(); // 클릭 이벤트가 부모 요소로 전파되지 않도록 함
    document.getElementById('ad-popup').style.display = 'none';
});

// Function to show ad popup
function showAdPopup() {
    document.getElementById('ad-popup').style.display = 'flex';
}

// 팝업 광고 이미지 순서 랜덤화 함수
function randomizePopupAds() {
    const popupAdsContainer = document.querySelector('.popup-ads-container');
    if (!popupAdsContainer) return;

    const adLinks = Array.from(popupAdsContainer.children);
    if (Math.random() < 0.5) {
        // 50% 확률로 순서를 바꿈
        adLinks.reverse().forEach(link => popupAdsContainer.appendChild(link));
    }
}

// 배너 이미지 회전 기능
function setupRotatingBanners() {
    const rotatingBanners = document.querySelectorAll('.rotating-banner');
    
    rotatingBanners.forEach((banner) => {
        const images = banner.querySelectorAll('.banner-image');
        const bannerLink = banner.closest('.ad-link');
        let currentIndex = 0;
        
        setInterval(() => {
            // 현재 이미지 비활성화
            images[currentIndex].classList.remove('active');
            
            // 다음 이미지 인덱스 계산
            currentIndex = (currentIndex + 1) % images.length;
            
            // 다음 이미지 활성화
            images[currentIndex].classList.add('active');
            
            // 링크 업데이트
            if (bannerLink) {
                const newLink = images[currentIndex].getAttribute('data-link');
                if (newLink) {
                    bannerLink.href = newLink;
                }
            }
        }, 4000); // 4초마다 이미지 전환
    });
}

// Share functionality
document.addEventListener('DOMContentLoaded', function() {
    // 팝업 광고 이미지 순서 랜덤화
    randomizePopupAds();
    
    // 공유 버튼 클릭 이벤트 처리
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            copyToClipboard(window.location.href);
        });
    }
    
    // 초기 팝업 광고 표시
    setTimeout(showAdPopup, 500);
    
    // 광고 이벤트 추적 설정
    setupAdTracking();
    
    // 배너 이미지 회전 시작
    setupRotatingBanners();
});

// 광고 클릭 추적 함수
function setupAdTracking() {
    const adLinks = document.querySelectorAll('.ad-link');
    adLinks.forEach((link, index) => {
        link.addEventListener('click', function() {
            // Google Analytics나 다른 추적 서비스가 있다면 여기에 추적 코드 추가 가능
            console.log(`광고 ${index + 1} 클릭됨: ${link.href}`);
            
            // gtag가 정의되어 있다면 광고 클릭 이벤트 전송
            if (typeof gtag === 'function') {
                gtag('event', 'ad_click', {
                    'ad_index': index + 1,
                    'ad_url': link.href
                });
            }
        });
    });
}

// 공유 텍스트 생성 함수
function generateShareText(yonseiScore, koreaScore, playerScore) {
    const siteUrl = window.location.href;
    if (yonseiScore >= koreaScore) {
        return `연대 VS 고대 상식대항전\n연세대 총점: ${yonseiScore}\n고려대 총점: ${koreaScore}\n나의 점수: ${playerScore}\n나도 참여하기: ${siteUrl}`;
    } else {
        return `고대 VS 연대 상식대항전\n고려대 총점: ${koreaScore}\n연세대 총점: ${yonseiScore}\n나의 점수: ${playerScore}\n나도 참여하기: ${siteUrl}`;
    }
}

// 클립보드에 복사하고 스플래시 메시지 표시 함수
function copyToClipboard(text) {
    // 클립보드에 텍스트 복사
    navigator.clipboard.writeText(text)
        .then(() => {
            showSplashMessage();
        })
        .catch(err => {
            // 클립보드 API가 지원되지 않는 경우 대체 방법 사용
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';  // textarea가 화면에 보이지 않게 설정
            textArea.style.opacity = 0;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showSplashMessage();
                }
            } catch (err) {
                console.error('클립보드 복사 오류:', err);
                alert('링크 복사에 실패했습니다.');
            }
            
            document.body.removeChild(textArea);
        });
}

// 스플래시 메시지 표시 함수
function showSplashMessage() {
    const splashMessage = document.getElementById('splash-message');
    splashMessage.classList.add('show');
    
    // 2초 후 메시지 사라짐
    setTimeout(() => {
        splashMessage.classList.remove('show');
    }, 2000);
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
    scoreText.className = 'score-value';
    
    scoreBarInfo.appendChild(logo);
    scoreBarInfo.appendChild(scoreText);
    
    const barContainer = document.createElement('div');
    barContainer.className = 'score-bar-container';
    
    const bar = document.createElement('div');
    bar.className = `score-bar ${university}`;
    // 최소 10%의 너비를 가지도록 조정
    const percentage = Math.max(10, (score / (maxScore || 1)) * 100);
    bar.style.width = `${percentage}%`;
    
    // 모바일 화면에서는 점수 텍스트가 보이지 않게 할 수 있음
    if (window.innerWidth <= 767 && percentage < 30) {
        bar.textContent = '';
    } else {
        bar.textContent = score;
    }
    
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

        // 공유 버튼 클릭 이벤트 업데이트
        const shareButton = document.getElementById('share-button');
        if (shareButton) {
            shareButton.onclick = function() {
                const shareText = generateShareText(data.yonsei_score, data.korea_score, currentScore);
                copyToClipboard(shareText);
            };
        }
    });
} 