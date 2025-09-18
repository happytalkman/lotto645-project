-- 사용자 시스템 추가

-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    profile_data JSON, -- 향후 확장용
    settings JSON -- 사용자 설정
);

-- 사용자명 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC);

-- fortune_predictions 테이블에 user_id 컬럼 추가
ALTER TABLE fortune_predictions ADD COLUMN user_id INTEGER;

-- 외래키 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_fortune_predictions_user_id ON fortune_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_fortune_predictions_user_created ON fortune_predictions(user_id, created_at DESC);

-- 사용자별 예측 통계를 위한 뷰 업데이트
DROP VIEW IF EXISTS prediction_stats;
CREATE VIEW prediction_stats AS
SELECT 
    u.username,
    fp.method,
    COUNT(*) as total_count,
    SUM(CASE WHEN fp.favorite = 1 THEN 1 ELSE 0 END) as favorite_count,
    AVG(CASE WHEN fp.favorite = 1 THEN 1.0 ELSE 0.0 END) as favorite_ratio,
    MIN(fp.created_at) as first_prediction,
    MAX(fp.created_at) as last_prediction
FROM fortune_predictions fp
LEFT JOIN users u ON fp.user_id = u.id
GROUP BY u.username, fp.method;

-- 사용자별 최근 활동을 위한 뷰 생성
CREATE VIEW IF NOT EXISTS user_activity AS
SELECT 
    u.id as user_id,
    u.username,
    DATE(fp.created_at) as activity_date,
    COUNT(*) as predictions_count,
    SUM(CASE WHEN fp.favorite = 1 THEN 1 ELSE 0 END) as favorites_count,
    GROUP_CONCAT(DISTINCT fp.method) as methods_used
FROM fortune_predictions fp
JOIN users u ON fp.user_id = u.id
WHERE fp.created_at >= date('now', '-30 days')
GROUP BY u.id, u.username, DATE(fp.created_at)
ORDER BY activity_date DESC;

-- 사용자별 선호 방법 분석을 위한 뷰
CREATE VIEW IF NOT EXISTS user_preferences_analysis AS
SELECT 
    u.id as user_id,
    u.username,
    fp.method,
    COUNT(*) as usage_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY u.id), 2) as usage_percentage,
    AVG(CASE WHEN fp.favorite = 1 THEN 1.0 ELSE 0.0 END) as favorite_rate
FROM fortune_predictions fp
JOIN users u ON fp.user_id = u.id
GROUP BY u.id, u.username, fp.method
ORDER BY u.id, usage_count DESC;

-- 업데이트 트리거 추가
CREATE TRIGGER IF NOT EXISTS update_users_last_login 
    AFTER UPDATE ON users
    FOR EACH ROW
    WHEN NEW.last_login = OLD.last_login
BEGIN
    UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;