-- 프리미엄 구독 시스템 스키마 (0003_premium_subscription_schema.sql)

-- 구독 플랜 테이블
CREATE TABLE IF NOT EXISTS subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_name VARCHAR(50) NOT NULL, -- 'basic', 'premium', 'platinum'
  display_name VARCHAR(100) NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features TEXT NOT NULL, -- JSON 형태로 기능 목록 저장
  max_predictions_per_day INTEGER NOT NULL,
  max_saved_predictions INTEGER NOT NULL,
  ai_analysis_limit INTEGER NOT NULL, -- 일일 AI 분석 요청 제한
  premium_algorithms BOOLEAN DEFAULT FALSE, -- 고급 알고리즘 접근 권한
  advanced_analytics BOOLEAN DEFAULT FALSE, -- 고급 분석 기능
  priority_support BOOLEAN DEFAULT FALSE, -- 우선 지원
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 구독 테이블
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'trial'
  subscription_type VARCHAR(20) NOT NULL, -- 'monthly', 'yearly', 'trial'
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  payment_method VARCHAR(50), -- 'stripe', 'paypal', 'crypto', etc.
  payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
  trial_used BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id)
);

-- 결제 기록 테이블
CREATE TABLE IF NOT EXISTS payment_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  subscription_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  payment_provider_id VARCHAR(255), -- Stripe 결제 ID 등
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  payment_date DATETIME,
  refund_date DATETIME,
  refund_amount DECIMAL(10,2),
  metadata TEXT, -- JSON 형태로 추가 결제 정보 저장
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (subscription_id) REFERENCES user_subscriptions(id)
);

-- 사용량 추적 테이블 
CREATE TABLE IF NOT EXISTS usage_tracking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  predictions_count INTEGER DEFAULT 0,
  analysis_requests INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  premium_features_used TEXT, -- JSON 배열로 사용된 프리미엄 기능 목록
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);

-- 기능 접근 권한 로그 테이블
CREATE TABLE IF NOT EXISTS feature_access_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  feature_name VARCHAR(100) NOT NULL,
  access_granted BOOLEAN NOT NULL,
  subscription_plan VARCHAR(50),
  access_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 기본 구독 플랜 데이터 삽입
INSERT OR IGNORE INTO subscription_plans (
  plan_name, display_name, price_monthly, price_yearly, features, 
  max_predictions_per_day, max_saved_predictions, ai_analysis_limit,
  premium_algorithms, advanced_analytics, priority_support
) VALUES 
(
  'basic',
  '베이직',
  0.00,
  0.00,
  '["기본 AI 예측", "8가지 통계 분석", "예측 저장 (10개)", "기본 챗봇", "명당 정보"]',
  5,
  10,
  10,
  FALSE,
  FALSE,
  FALSE
),
(
  'premium',
  '프리미엄',
  9.99,
  99.99,
  '["고급 AI 예측", "전체 통계 분석", "예측 저장 (100개)", "고급 챗봇", "개인화 추천", "조합 분석", "예측 정확도 추적", "이메일 알림"]',
  50,
  100,
  100,
  TRUE,
  TRUE,
  FALSE
),
(
  'platinum',
  '플래티넘',
  19.99,
  199.99,
  '["전문가급 AI 예측", "전체 고급 분석", "무제한 예측 저장", "AI 컨설팅", "실시간 알림", "API 접근", "커스텀 알고리즘", "우선 고객지원", "수익률 분석"]',
  -1,
  -1,
  -1,
  TRUE,
  TRUE,
  TRUE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date ON usage_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS idx_feature_access_user_feature ON feature_access_log(user_id, feature_name);