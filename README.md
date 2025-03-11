# 연고전 O/X 퀴즈

연세대학교와 고려대학교 학생들을 위한 O/X 퀴즈 게임입니다.

## 특징

- 학교 선택 (연세대/고려대)
- 랜덤 O/X 퀴즈 문제
- 3초 제한 시간
- 학교별 총점 집계
- SQLite 데이터베이스에 점수 저장

## 설치 방법

1. 저장소를 클론합니다:
```bash
git clone <repository-url>
cd <repository-name>
```

2. 가상환경을 생성하고 활성화합니다:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는
venv\Scripts\activate  # Windows
```

3. 필요한 패키지를 설치합니다:
```bash
pip install -r requirements.txt
```

4. 데이터베이스를 초기화합니다:
```bash
python init_db.py
```

## 실행 방법

1. Flask 애플리케이션을 실행합니다:
```bash
python app.py
```

2. 웹 브라우저에서 다음 주소로 접속합니다:
```
http://localhost:5000
```

## 게임 방법

1. 시작 화면에서 자신의 학교(연세대/고려대)를 선택합니다.
2. 문제가 표시되면 3초 안에 O 또는 X를 선택합니다.
3. 정답을 맞추면 다음 문제로 넘어가고 점수가 올라갑니다.
4. 오답을 선택하거나 시간 초과시 게임이 종료됩니다.
5. 게임 종료 후 자신의 점수와 각 학교의 총점을 확인할 수 있습니다.

## 데이터베이스 관리

학교별 점수는 SQLite 데이터베이스(`data/scores.db`)에 저장됩니다.

- 초기화: `python init_db.py`를 실행하여 데이터베이스를 초기화합니다.
- 데이터베이스 스키마: `school_scores` 테이블에 학교별 이름과 점수가 저장됩니다.
  - `id`: 기본 키
  - `school_name`: 학교 이름 (유일한 값)
  - `score`: 현재 점수
  - `last_updated`: 마지막 업데이트 시간 