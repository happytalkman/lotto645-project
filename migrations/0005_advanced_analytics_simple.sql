-- 단순화된 고급 분석 스키마 (0005_advanced_analytics_simple.sql)

-- 조합 분석 결과 테이블 (단순화)
CREATE TABLE IF NOT EXISTS combination_analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  analysis_type TEXT NOT NULL,
  combination_data TEXT NOT NULL,
  frequency INTEGER NOT NULL,
  probability REAL NOT NULL,
  last_appearance INTEGER,
  recommendation_score REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 예측 정확도 추적 테이블
CREATE TABLE IF NOT EXISTS prediction_accuracy (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  algorithm_type TEXT NOT NULL,
  predicted_numbers TEXT NOT NULL,
  actual_numbers TEXT,
  accuracy_score INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 알고리즘 성능 통계 테이블
CREATE TABLE IF NOT EXISTS algorithm_performance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  algorithm_type TEXT NOT NULL UNIQUE,
  total_predictions INTEGER DEFAULT 0,
  accuracy_by_count TEXT NOT NULL,
  average_accuracy REAL DEFAULT 0,
  best_accuracy INTEGER DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 알고리즘 성능 데이터
INSERT OR IGNORE INTO algorithm_performance (algorithm_type, accuracy_by_count) VALUES 
('bayesian_inference', '{"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}'),
('neural_network', '{"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}'),
('frequency_analysis', '{"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}'),
('pattern_recognition', '{"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}'),
('monte_carlo', '{"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0}');