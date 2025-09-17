-- 로또 당첨 번호 테이블
CREATE TABLE IF NOT EXISTS lotto_draws (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    draw_number INTEGER UNIQUE NOT NULL,
    draw_date TEXT NOT NULL,
    number1 INTEGER NOT NULL,
    number2 INTEGER NOT NULL,
    number3 INTEGER NOT NULL,
    number4 INTEGER NOT NULL,
    number5 INTEGER NOT NULL,
    number6 INTEGER NOT NULL,
    bonus_number INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 명당 판매점 정보 테이블
CREATE TABLE IF NOT EXISTS lucky_stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    region TEXT NOT NULL,
    first_prize_count INTEGER DEFAULT 0,
    total_prize_count INTEGER DEFAULT 0,
    latitude REAL,
    longitude REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    username TEXT,
    subscription_type TEXT DEFAULT 'basic', -- basic, premium, platinum
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- 사용자 선호 번호 패턴 테이블
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    favorite_numbers TEXT, -- JSON 배열 형태로 저장
    analysis_type TEXT, -- frequency, pattern, ai_prediction 등
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- AI 예측 결과 저장 테이블
CREATE TABLE IF NOT EXISTS ai_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prediction_type TEXT NOT NULL, -- bayesian, neural, frequency 등
    predicted_numbers TEXT NOT NULL, -- JSON 배열 형태
    confidence_score REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 통계 분석 결과 캐시 테이블
CREATE TABLE IF NOT EXISTS analysis_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    analysis_type TEXT NOT NULL,
    parameters TEXT, -- 분석 파라미터 JSON
    results TEXT NOT NULL, -- 결과 JSON
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_lotto_draws_number ON lotto_draws(draw_number);
CREATE INDEX IF NOT EXISTS idx_lotto_draws_date ON lotto_draws(draw_date);
CREATE INDEX IF NOT EXISTS idx_lucky_stores_region ON lucky_stores(region);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_type ON ai_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_analysis_cache_type ON analysis_cache(analysis_type);