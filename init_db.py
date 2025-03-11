import sqlite3
import os

def init_db():
    # 데이터 디렉토리가 없으면 생성
    if not os.path.exists('data'):
        os.makedirs('data')
        
    conn = sqlite3.connect('data/scores.db')
    c = conn.cursor()
    # 학교별 점수 테이블 생성
    c.execute('''
    CREATE TABLE IF NOT EXISTS school_scores (
        id INTEGER PRIMARY KEY,
        school_name TEXT NOT NULL UNIQUE,
        score INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # 기본 데이터 추가 (처음 실행 시에만)
    c.execute('SELECT COUNT(*) FROM school_scores WHERE school_name IN ("yonsei", "korea")')
    count = c.fetchone()[0]
    if count < 2:
        c.execute('INSERT OR IGNORE INTO school_scores (school_name, score) VALUES (?, ?)', ('yonsei', 0))
        c.execute('INSERT OR IGNORE INTO school_scores (school_name, score) VALUES (?, ?)', ('korea', 0))
    
    conn.commit()
    conn.close()
    
    print("데이터베이스가 성공적으로 초기화되었습니다.")

if __name__ == "__main__":
    print("데이터베이스 초기화를 시작합니다...")
    init_db() 