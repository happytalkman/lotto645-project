export interface LottoDraw {
  id: number;
  draw_number: number;
  draw_date: string;
  number1: number;
  number2: number;
  number3: number;
  number4: number;
  number5: number;
  number6: number;
  bonus_number: number;
  created_at?: string;
}

export interface LuckyStore {
  id: number;
  name: string;
  address: string;
  region: string;
  first_prize_count: number;
  total_prize_count: number;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export interface User {
  id: number;
  email?: string;
  username?: string;
  subscription_type: 'basic' | 'premium' | 'platinum';
  created_at?: string;
  last_login?: string;
}

export interface UserPreference {
  id: number;
  user_id: number;
  favorite_numbers: number[];
  analysis_type: 'frequency' | 'pattern' | 'ai_prediction';
  created_at?: string;
}

export interface AIPrediction {
  id: number;
  prediction_type: string;
  predicted_numbers: number[];
  confidence_score: number;
  created_at?: string;
}

export interface AnalysisResult {
  id: number;
  analysis_type: string;
  parameters: Record<string, any>;
  results: Record<string, any>;
  created_at?: string;
  expires_at?: string;
}

// AI 예측 알고리즘 타입
export type PredictionAlgorithm = 
  | 'bayesian_inference'
  | 'neural_network' 
  | 'frequency_analysis'
  | 'pattern_recognition'
  | 'monte_carlo'
  | 'markov_chain'
  | 'genetic_algorithm'
  | 'clustering_analysis'
  | 'regression_analysis'
  | 'ensemble_method';

// 통계 분석 타입
export type StatisticalAnalysis = 
  | 'frequency_analysis'
  | 'hot_cold_numbers'
  | 'pattern_analysis'
  | 'correlation_analysis'
  | 'trend_analysis'
  | 'distribution_analysis'
  | 'sequence_analysis'
  | 'probability_analysis';

// API 응답 타입
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 챗봇 메시지 타입
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 번호 추천 결과 타입
export interface NumberRecommendation {
  numbers: number[];
  algorithm: PredictionAlgorithm;
  confidence: number;
  explanation: string;
  reason: string;
}

// 통계 분석 결과 타입
export interface StatisticsResult {
  type: StatisticalAnalysis;
  data: Record<string, any>;
  visualization?: string; // Chart.js 설정 JSON
  summary: string;
  recommended_numbers: number[]; // 분석 기반 추천 번호
  explanation: string; // 분석 방법 및 추천 이유 설명
}

// 사용자 세션 타입
export interface UserSession {
  id: number;
  session_id: string;
  user_id?: number;
  username: string;
  email?: string;
  created_at?: string;
  expires_at: string;
}

// 예측저장 타입
export interface SavedPrediction {
  id: number;
  user_id: number;
  session_id: string;
  prediction_type: PredictionAlgorithm;
  predicted_numbers: number[];
  confidence_score?: number;
  memo?: string;
  virtual_round?: number;
  is_favorite: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// 개인화 추천 타입
export interface PersonalizedRecommendation {
  id: number;
  user_id: number;
  based_on_predictions: number[]; // SavedPrediction ID들
  recommended_numbers: number[];
  algorithm_used: string;
  confidence_score?: number;
  explanation?: string;
  created_at?: string;
}

// 사용자 예측 패턴 타입
export interface UserPredictionPattern {
  id: number;
  user_id: number;
  pattern_type: 'frequent_numbers' | 'number_combinations' | 'algorithm_preference' | 'time_patterns' | 'memo_keywords';
  pattern_data: Record<string, any>;
  frequency: number;
  last_updated?: string;
}

// 예측저장 요청 타입
export interface SavePredictionRequest {
  prediction_type: PredictionAlgorithm;
  predicted_numbers: number[];
  confidence_score?: number;
  memo?: string;
  virtual_round?: number;
  tags?: string[];
}

// 개인화 추천 요청 타입
export interface PersonalizedRecommendationRequest {
  based_on_prediction_ids?: number[];
  algorithm_preference?: PredictionAlgorithm[];
  include_favorites_only?: boolean;
}

// 구독 플랜 타입
export interface SubscriptionPlan {
  id: number;
  plan_name: 'basic' | 'premium' | 'platinum';
  display_name: string;
  price_monthly: number;
  price_yearly: number;
  features: string[]; // JSON으로 저장되지만 파싱 후 배열
  max_predictions_per_day: number; // -1은 무제한
  max_saved_predictions: number; // -1은 무제한
  ai_analysis_limit: number; // -1은 무제한
  premium_algorithms: boolean;
  advanced_analytics: boolean;
  priority_support: boolean;
  created_at?: string;
  updated_at?: string;
}

// 사용자 구독 타입
export interface UserSubscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  subscription_type: 'monthly' | 'yearly' | 'trial';
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed';
  trial_used: boolean;
  created_at?: string;
  updated_at?: string;
}

// 결제 기록 타입
export interface PaymentHistory {
  id: number;
  user_id: number;
  subscription_id: number;
  amount: number;
  currency: string;
  payment_method?: string;
  payment_provider_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_date?: string;
  refund_date?: string;
  refund_amount?: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

// 사용량 추적 타입
export interface UsageTracking {
  id: number;
  user_id: number;
  date: string;
  predictions_count: number;
  analysis_requests: number;
  api_calls: number;
  premium_features_used: string[]; // JSON으로 저장되지만 파싱 후 배열
  created_at?: string;
  updated_at?: string;
}

// 기능 접근 권한 로그 타입
export interface FeatureAccessLog {
  id: number;
  user_id: number;
  feature_name: string;
  access_granted: boolean;
  subscription_plan?: string;
  access_time?: string;
  ip_address?: string;
  user_agent?: string;
}

// 구독 업그레이드 요청 타입
export interface SubscriptionUpgradeRequest {
  target_plan: 'premium' | 'platinum';
  payment_method: 'stripe' | 'paypal' | 'crypto';
  billing_cycle: 'monthly' | 'yearly';
  promo_code?: string;
}

// 기능 권한 체크 결과 타입
export interface FeaturePermission {
  has_access: boolean;
  reason?: string;
  upgrade_required?: boolean;
  current_usage?: number;
  daily_limit?: number;
  plan_required?: 'premium' | 'platinum';
}

// 고급 분석 타입들
export interface CombinationAnalysis {
  id: number;
  analysis_type: 'pair' | 'triple' | 'quadruple' | 'sequence' | 'sum_range';
  combination_data: Record<string, any>; // JSON 파싱 후 객체
  frequency: number;
  probability: number;
  last_appearance?: number;
  gap_analysis?: Record<string, any>;
  recommendation_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface PredictionAccuracy {
  id: number;
  user_id?: number;
  prediction_id?: number;
  algorithm_type: PredictionAlgorithm;
  predicted_numbers: number[];
  actual_draw_number?: number;
  actual_numbers?: number[];
  accuracy_score: number; // 0-6 맞춘 개수
  bonus_match: boolean;
  prize_tier?: '1등' | '2등' | '3등' | '4등' | '5등' | '낙첨';
  points_earned: number;
  confidence_vs_accuracy?: number;
  created_at?: string;
}

export interface AlgorithmPerformance {
  id: number;
  algorithm_type: PredictionAlgorithm;
  total_predictions: number;
  accuracy_by_count: Record<string, number>; // {"0": count, "1": count, ...}
  average_accuracy: number;
  best_accuracy: number;
  confidence_reliability: number;
  last_updated?: string;
}

export interface AdvancedNumberPattern {
  id: number;
  pattern_type: 'consecutive' | 'arithmetic' | 'geometric' | 'fibonacci' | 'prime';
  pattern_data: Record<string, any>;
  frequency: number;
  success_rate: number;
  average_gap: number;
  trend_direction?: 'increasing' | 'decreasing' | 'stable';
  recommendation_weight: number;
  created_at?: string;
  updated_at?: string;
}

export interface AnalysisCache {
  id: number;
  cache_key: string;
  analysis_type: string;
  result_data: Record<string, any>;
  computation_time_ms?: number;
  expires_at: string;
  hit_count: number;
  created_at?: string;
  last_accessed?: string;
}

export interface UserAnalysisHistory {
  id: number;
  user_id: number;
  analysis_type: string;
  analysis_params?: Record<string, any>;
  execution_time?: string;
  processing_time_ms?: number;
  result_summary?: string;
  satisfaction_rating?: number; // 1-5
}

// 고급 분석 요청 타입
export interface AdvancedAnalysisRequest {
  analysis_type: 'combination' | 'accuracy_tracking' | 'pattern_recognition' | 'algorithm_performance';
  parameters?: {
    combination_type?: 'pair' | 'triple' | 'quadruple' | 'sequence' | 'sum_range';
    algorithm_filter?: PredictionAlgorithm[];
    date_range?: {
      start_date: string;
      end_date: string;
    };
    min_frequency?: number;
    min_accuracy?: number;
  };
  user_id?: number;
}

// 고급 분석 결과 타입
export interface AdvancedAnalysisResult {
  analysis_type: string;
  data: Record<string, any>;
  insights: string[];
  recommendations: number[];
  performance_metrics?: {
    computation_time_ms: number;
    data_points_analyzed: number;
    confidence_score: number;
  };
  visualization_config?: Record<string, any>; // Chart.js 설정
  summary: string;
  created_at: string;
}

export interface Bindings {
  DB: D1Database;
  AI?: Ai;
}