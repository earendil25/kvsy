# 연세대 vs 고려대 OX 퀴즈 대결

이 웹 애플리케이션은 연세대학교와 고려대학교 학생들이 OX 퀴즈를 통해 대결하는 게임입니다.

## 기능

1. 시작 시 팝업 광고가 표시됩니다.
2. 사용자는 자신의 학교(연세대 또는 고려대)를 선택할 수 있습니다.
3. 각 문제마다 3초의 제한 시간이 주어집니다.
4. 문제를 틀리거나 시간이 초과되면 게임이 종료됩니다.
5. 게임 종료 후 개인 점수와 학교별 누적 점수가 표시됩니다.

## 로컬에서 실행하기

1. 필요한 패키지 설치:
   ```
   pip install -r requirements.txt
   ```

2. 애플리케이션 실행:
   ```
   python app.py
   ```

3. 웹 브라우저에서 `http://localhost:5000`으로 접속

## Heroku 배포 방법

1. Heroku CLI 설치 및 로그인
   ```
   heroku login
   ```

2. 새 Heroku 앱 생성
   ```
   heroku create your-app-name
   ```

3. Git 저장소 초기화 및 Heroku 원격 저장소 추가
   ```
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-app-name
   ```

4. Heroku에 배포
   ```
   git push heroku main
   ```

5. 배포된 앱 열기
   ```
   heroku open
   ```

## 필요한 이미지 파일

`static/images` 디렉토리에 다음 이미지 파일들이 필요합니다:
- `yonsei_logo.png`: 연세대학교 로고
- `korea_logo.png`: 고려대학교 로고
- `square_ad.png`: 광고 이미지

## 라이센스

MIT 