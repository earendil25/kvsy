# Heroku 배포 가이드

이 문서는 연세대 vs 고려대 OX 퀴즈 대결 앱을 Heroku에 배포하는 방법을 안내합니다.

## 사전 준비

1. [Heroku 계정](https://signup.heroku.com/) 생성
2. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) 설치
3. Git이 설치되어 있어야 합니다

## 배포 단계

### 1. Heroku CLI 로그인

터미널에서 다음 명령어를 실행하여 Heroku 계정에 로그인합니다:

```bash
heroku login
```

### 2. Heroku 앱 생성

다음 명령어로 새 Heroku 앱을 생성합니다:

```bash
heroku create yonsei-korea-quiz
```

앱 이름(`yonsei-korea-quiz`)은 원하는 대로 변경할 수 있습니다. 이 이름은 URL의 일부가 됩니다 (예: `https://yonsei-korea-quiz.herokuapp.com`).

### 3. Git 저장소에 Heroku 원격 저장소 추가

```bash
heroku git:remote -a yonsei-korea-quiz
```

여기서 `yonsei-korea-quiz`는 2단계에서 생성한 앱 이름입니다.

### 4. Heroku에 코드 배포

```bash
git push heroku main
```

이 명령어는 현재 브랜치의 코드를 Heroku에 배포합니다.

### 5. 앱 실행 확인

배포가 완료되면 다음 명령어로 앱을 열 수 있습니다:

```bash
heroku open
```

또는 웹 브라우저에서 `https://yonsei-korea-quiz.herokuapp.com`(앱 이름에 따라 다름)으로 접속할 수 있습니다.

## 문제 해결

### 로그 확인

앱에 문제가 있는 경우 다음 명령어로 로그를 확인할 수 있습니다:

```bash
heroku logs --tail
```

### 앱 재시작

필요한 경우 다음 명령어로 앱을 재시작할 수 있습니다:

```bash
heroku restart
```

### 환경 변수 설정

필요한 환경 변수가 있다면 다음과 같이 설정할 수 있습니다:

```bash
heroku config:set VARIABLE_NAME=value
```

## 주의사항

1. Heroku의 무료 티어는 30분 동안 활동이 없으면 앱이 휴면 상태로 전환됩니다. 첫 접속 시 로딩 시간이 길어질 수 있습니다.

2. Heroku의 파일 시스템은 임시적이므로, `scores.json` 파일에 저장된 점수 데이터는 앱이 재시작될 때마다 초기화됩니다. 영구적인 데이터 저장이 필요하다면 Heroku Postgres와 같은 데이터베이스 서비스를 사용해야 합니다.

3. 이미지 파일(`static/images` 디렉토리)이 없는 경우, 앱이 제대로 작동하지 않을 수 있습니다. 배포 전에 이미지 파일이 있는지 확인하세요. 