-- 예측저장에 즐겨찾기 기능 추가

-- fortune_predictions 테이블에 즐겨찾기 컬럼 추가
ALTER TABLE fortune_predictions ADD COLUMN favorite BOOLEAN DEFAULT FALSE;

-- 즐겨찾기 검색을 위한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_fortune_predictions_favorite ON fortune_predictions(favorite);
CREATE INDEX IF NOT EXISTS idx_fortune_predictions_favorite_created ON fortune_predictions(favorite, created_at DESC);

-- 예측 통계를 위한 뷰 생성
CREATE VIEW IF NOT EXISTS prediction_stats AS
SELECT 
    method,
    COUNT(*) as total_count,
    SUM(CASE WHEN favorite = 1 THEN 1 ELSE 0 END) as favorite_count,
    AVG(CASE WHEN favorite = 1 THEN 1.0 ELSE 0.0 END) as favorite_ratio,
    MIN(created_at) as first_prediction,
    MAX(created_at) as last_prediction
FROM fortune_predictions
GROUP BY method;

-- 최근 활동 통계를 위한 뷰 생성  
CREATE VIEW IF NOT EXISTS recent_activity AS
SELECT 
    DATE(created_at) as prediction_date,
    COUNT(*) as daily_count,
    method,
    SUM(CASE WHEN favorite = 1 THEN 1 ELSE 0 END) as daily_favorites
FROM fortune_predictions
WHERE created_at >= date('now', '-30 days')
GROUP BY DATE(created_at), method
ORDER BY prediction_date DESC;

-- 개인화 분석을 위한 함수용 테이블 (향후 확장용)
CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT, -- 향후 사용자 시스템 도입 시 활용
    preferred_method TEXT,
    lucky_numbers TEXT, -- JSON 배열 형태
    lucky_time_range TEXT,
    settings JSON, -- 사용자 개인 설정
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 업데이트 트리거 추가
CREATE TRIGGER IF NOT EXISTS update_user_preferences_timestamp 
    AFTER UPDATE ON user_preferences
    FOR EACH ROW
BEGIN
    UPDATE user_preferences SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;