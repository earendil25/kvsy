import sqlite3
import os

def init_db():
    # 데이터 디렉토리가 없으면 생성
    if not os.path.exists('data'):
        os.makedirs('data')
        
    conn = sqlite3.connect('data/scores.db')
    c = conn.cursor()
    
    # 기존 테이블이 있다면 삭제
    c.execute('DROP TABLE IF EXISTS school_scores')
    
    # 학교별 점수 테이블 생성
    c.execute('''
    CREATE TABLE IF NOT EXISTS school_scores (
        id INTEGER PRIMARY KEY,
        school_name TEXT NOT NULL UNIQUE,
        score INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # 초기 점수 113으로 설정
    c.execute('INSERT INTO school_scores (school_name, score) VALUES (?, ?)', ('yonsei', 193))
    c.execute('INSERT INTO school_scores (school_name, score) VALUES (?, ?)', ('korea', 193))
    
    conn.commit()
    conn.close()
    
    print("데이터베이스가 성공적으로 초기화되었습니다.")
    print("연세대학교와 고려대학교의 초기 점수가 113점으로 설정되었습니다.")

if __name__ == "__main__":
    print("데이터베이스 초기화를 시작합니다...")
    init_db() 