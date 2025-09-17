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

export interface Bindings {
  DB: D1Database;
  AI?: Ai;
}