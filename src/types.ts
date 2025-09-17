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
}

export interface Bindings {
  DB: D1Database;
  AI?: Ai;
}