-- 예측저장 관련 테이블 추가

-- 사용자 세션 테이블 (간단한 인증용)
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    username TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 예측저장 테이블
CREATE TABLE IF NOT EXISTS saved_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id TEXT NOT NULL,
    prediction_type TEXT NOT NULL, -- 예측 알고리즘 종류
    predicted_numbers TEXT NOT NULL, -- JSON 배열: [1,2,3,4,5,6]
    confidence_score REAL,
    memo TEXT, -- 사용자 메모
    virtual_round INTEGER, -- 가상회차 번호
    is_favorite BOOLEAN DEFAULT FALSE, -- 즐겨찾기 여부
    tags TEXT, -- 태그 (JSON 배열)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 예측저장 기반 개인화 추천 결과 테이블
CREATE TABLE IF NOT EXISTS personalized_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    based_on_predictions TEXT NOT NULL, -- 기반이 된 저장된 예측들의 ID 배열 (JSON)
    recommended_numbers TEXT NOT NULL, -- 추천된 번호 (JSON 배열)
    algorithm_used TEXT NOT NULL, -- 사용된 추천 알고리즘
    confidence_score REAL,
    explanation TEXT, -- 추천 이유 설명
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 사용자 예측 패턴 분석 테이블
CREATE TABLE IF NOT EXISTS user_prediction_patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    pattern_type TEXT NOT NULL, -- 'frequent_numbers', 'number_combinations', 'algorithm_preference' 등
    pattern_data TEXT NOT NULL, -- JSON 형태의 패턴 데이터
    frequency INTEGER DEFAULT 1,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_predictions_user_id ON saved_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_predictions_session_id ON saved_predictions(session_id);
CREATE INDEX IF NOT EXISTS idx_saved_predictions_type ON saved_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_saved_predictions_created_at ON saved_predictions(created_at);
CREATE INDEX IF NOT EXISTS idx_personalized_recommendations_user_id ON personalized_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_prediction_patterns_user_id ON user_prediction_patterns(user_id);
CREATE INDEX IF NOT EXISTS idx_user_prediction_patterns_type ON user_prediction_patterns(pattern_type);