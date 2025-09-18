# 로또645.AI API 참조 가이드

## 📡 API 개요

### 기본 정보
- **Base URL**: `https://lotto645-ai.pages.dev`
- **Content-Type**: `application/json`
- **인증 방식**: 세션 기반 인증
- **응답 형식**: JSON

### 공통 응답 형태
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 🎯 로또 데이터 API

### 1. 최신 당첨번호 조회
```http
GET /api/draws/latest
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 599,
    "draw_number": 599,
    "draw_date": "2025-09-17",
    "number1": 7,
    "number2": 14,
    "number3": 21,
    "number4": 28,
    "number5": 35,
    "number6": 42,
    "bonus_number": 15,
    "created_at": "2025-09-17T12:00:00Z"
  }
}
```

### 2. 당첨번호 목록 조회 (페이지네이션)
```http
GET /api/draws?page=1&limit=10
```

**쿼리 파라미터:**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 10, 최대: 100)

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "draws": [
      {
        "id": 599,
        "draw_number": 599,
        "draw_date": "2025-09-17",
        "number1": 7,
        "number2": 14,
        "number3": 21,
        "number4": 28,
        "number5": 35,
        "number6": 42,
        "bonus_number": 15
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 60,
      "total_items": 599,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

## 🤖 AI 챗봇 API

### 1. 챗봇과 대화
```http
POST /api/chatbot
```

**요청 본문:**
```json
{
  "message": "최신 당첨번호 알려줘"
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "reply": "최신 599회 당첨번호는 7, 14, 21, 28, 35, 42번이고 보너스번호는 15번입니다. 이번 회차는 연속번호가 포함된 흥미로운 조합이네요!",
    "context": "latest_draw_info",
    "timestamp": "2025-09-18T10:30:00Z"
  }
}
```

**챗봇 주요 키워드:**
- `"최신"`, `"당첨번호"` → 최신 당첨번호 조회
- `"빈도"`, `"자주"` → 빈도 분석 실행
- `"예측"`, `"추천"` → AI 예측 제안
- `"명당"`, `"판매점"` → 명당 판매점 정보
- `"통계"`, `"분석"` → 통계 분석 기능 안내

## 📊 통계 분석 API (8가지)

### 1. 빈도 분석
```http
GET /api/statistics/frequency
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "type": "frequency_analysis",
    "data": {
      "1": 45,
      "2": 38,
      "3": 52,
      "...": "...",
      "45": 41
    },
    "summary": "가장 많이 나온 번호는 3번(52회), 가장 적게 나온 번호는 2번(38회)입니다.",
    "recommended_numbers": [3, 17, 22, 31, 38, 44],
    "explanation": "과거 599회 추첨에서 각 번호의 출현 빈도를 분석하여 상위 빈도 번호들을 추천했습니다."
  }
}
```

### 2. 핫/콜드 번호 분석
```http
GET /api/statistics/hot-cold
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "type": "hot_cold_numbers",
    "data": {
      "hot_numbers": {
        "17": 8,
        "22": 7,
        "31": 7
      },
      "cold_numbers": {
        "5": 1,
        "13": 2,
        "41": 2
      }
    },
    "summary": "최근 20회차에서 17번이 8회로 가장 HOT하고, 5번이 1회로 가장 COLD합니다.",
    "recommended_numbers": [17, 22, 31, 8, 25, 38]
  }
}
```

### 3. 패턴 분석
```http
GET /api/statistics/pattern
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "type": "pattern_analysis",
    "data": {
      "even_odd_ratio": {
        "even": 51.2,
        "odd": 48.8
      },
      "range_distribution": {
        "low": 31.5,
        "middle": 37.2,
        "high": 31.3
      },
      "consecutive_count": 127
    },
    "summary": "짝수가 51.2%로 약간 우세하고, 연속번호는 127회(21.2%) 출현했습니다.",
    "recommended_numbers": [8, 15, 24, 31, 37, 42]
  }
}
```

### 4. 상관관계 분석
```http
GET /api/statistics/correlation
```

### 5. 트렌드 분석
```http
GET /api/statistics/trend
```

### 6. 분포 분석
```http
GET /api/statistics/distribution
```

### 7. 연속 분석
```http
GET /api/statistics/sequence
```

### 8. 확률 분석
```http
GET /api/statistics/probability
```

## 🔮 AI 예측 API (10가지)

### 1. AI 예측 실행
```http
POST /api/prediction
```

**요청 본문:**
```json
{
  "algorithm": "bayesian_inference"
}
```

**지원되는 알고리즘:**
- `bayesian_inference` - 베이지안 추론
- `neural_network` - 신경망
- `frequency_analysis` - 빈도 분석
- `pattern_recognition` - 패턴 인식
- `monte_carlo` - 몬테카를로
- `markov_chain` - 마르코프 체인
- `genetic_algorithm` - 유전 알고리즘
- `clustering_analysis` - 클러스터링
- `regression_analysis` - 회귀 분석
- `ensemble_method` - 앙상블

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "algorithm": "bayesian_inference",
    "numbers": [2, 28, 30, 38, 40, 44],
    "confidence": 0.629,
    "explanation": "베이지안 추론을 통해 과거 패턴을 분석한 결과입니다.",
    "reason": "최근 출현 패턴과 전체 확률 분포를 종합하여 계산했습니다.",
    "timestamp": "2025-09-18T10:30:00Z"
  }
}
```

## 🏪 명당 판매점 API

### 1. 명당 판매점 조회
```http
GET /api/stores
```

**쿼리 파라미터:**
- `region` (optional): 지역 필터 ("서울", "경기", "부산" 등)
- `sort` (optional): 정렬 기준 ("first_prize", "total_prize", "name")
- `limit` (optional): 반환 개수 제한 (기본값: 50)

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": 1,
        "name": "행운복권방",
        "address": "서울특별시 강남구 역삼동 123-45",
        "region": "서울",
        "first_prize_count": 3,
        "total_prize_count": 87,
        "latitude": 37.4979,
        "longitude": 127.0276
      }
    ],
    "total_count": 234
  }
}
```

## 👤 사용자 인증 API

### 1. 로그인/회원가입
```http
POST /api/auth/login
```

**요청 본문:**
```json
{
  "username": "테스트유저",
  "email": "test@example.com"
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "id": 123,
      "username": "테스트유저",
      "email": "test@example.com",
      "subscription_type": "basic"
    },
    "expires_at": "2025-09-19T10:30:00Z"
  }
}
```

### 2. 세션 확인
```http
GET /api/auth/session/{sessionId}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": 123,
      "username": "테스트유저",
      "subscription_type": "basic"
    },
    "expires_at": "2025-09-19T10:30:00Z"
  }
}
```

### 3. 로그아웃
```http
POST /api/auth/logout
```

**요청 본문:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## 💾 예측저장 API

### 1. 예측 저장
```http
POST /api/predictions/save
```

**요청 본문:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "prediction_type": "bayesian_inference",
  "predicted_numbers": [2, 28, 30, 38, 40, 44],
  "confidence_score": 0.629,
  "memo": "베이지안 추론으로 생성된 예측",
  "virtual_round": 600,
  "tags": ["베이지안", "높은신뢰도"]
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 456,
    "message": "예측이 성공적으로 저장되었습니다."
  }
}
```

### 2. 저장된 예측 조회
```http
GET /api/predictions/saved/{sessionId}?page=1&limit=10
```

**쿼리 파라미터:**
- `page` (optional): 페이지 번호
- `limit` (optional): 페이지당 항목 수
- `favorite` (optional): 즐겨찾기만 조회 (true/false)
- `algorithm` (optional): 특정 알고리즘 필터
- `tag` (optional): 특정 태그 필터

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "id": 456,
        "prediction_type": "bayesian_inference",
        "predicted_numbers": [2, 28, 30, 38, 40, 44],
        "confidence_score": 0.629,
        "memo": "베이지안 추론으로 생성된 예측",
        "virtual_round": 600,
        "is_favorite": false,
        "tags": ["베이지안", "높은신뢰도"],
        "created_at": "2025-09-18T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 48
    }
  }
}
```

### 3. 저장된 예측 수정
```http
PUT /api/predictions/saved/{id}
```

**요청 본문:**
```json
{
  "memo": "수정된 메모",
  "is_favorite": true,
  "tags": ["베이지안", "높은신뢰도", "즐겨찾기"]
}
```

### 4. 저장된 예측 삭제
```http
DELETE /api/predictions/saved/{id}
```

## 🌟 개인화 추천 API

### 1. RAG 기반 개인화 추천
```http
POST /api/recommendations/personalized
```

**요청 본문:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "based_on_prediction_ids": [456, 457, 458],
  "algorithm_preference": ["bayesian_inference", "neural_network"],
  "include_favorites_only": false
}
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "numbers": [5, 17, 23, 34, 39, 42],
    "algorithm_used": "personalized_rag",
    "confidence_score": 0.742,
    "explanation": "과거 선택한 예측들을 분석한 결과, 중간 구간 번호를 선호하고 베이지안 추론 알고리즘을 자주 사용하는 패턴을 발견했습니다. 이를 바탕으로 개인화된 번호를 생성했습니다.",
    "based_on_predictions": 12,
    "pattern_analysis": {
      "frequent_numbers": [17, 23, 34],
      "preferred_algorithms": ["bayesian_inference", "neural_network"],
      "number_range_preference": "중간구간 선호",
      "confidence_trend": "상승"
    }
  }
}
```

## 📈 고급 분석 API (프리미엄)

### 1. 조합 분석
```http
POST /api/analysis/advanced/combination
```

**요청 본문:**
```json
{
  "analysis_type": "pair",
  "min_frequency": 5
}
```

### 2. 정확도 추적
```http
GET /api/analysis/advanced/accuracy/{userId}
```

### 3. 알고리즘 성능 분석
```http
GET /api/analysis/advanced/algorithm-performance
```

## 🚨 에러 코드 및 처리

### HTTP 상태 코드
- `200` - 성공
- `400` - 잘못된 요청 (Bad Request)
- `401` - 인증 실패 (Unauthorized)
- `403` - 권한 없음 (Forbidden)
- `404` - 리소스 없음 (Not Found)
- `429` - 요청 제한 초과 (Too Many Requests)
- `500` - 서버 내부 오류 (Internal Server Error)

### 에러 응답 형태
```json
{
  "success": false,
  "error": "INVALID_SESSION",
  "message": "세션이 만료되었거나 유효하지 않습니다.",
  "code": 401,
  "details": {
    "session_id": "expired_session_id",
    "expires_at": "2025-09-17T10:30:00Z"
  }
}
```

### 주요 에러 코드
- `INVALID_SESSION` - 세션 만료 또는 유효하지 않음
- `INVALID_NUMBERS` - 로또 번호 형식 오류
- `ALGORITHM_NOT_SUPPORTED` - 지원되지 않는 알고리즘
- `RATE_LIMIT_EXCEEDED` - API 호출 제한 초과
- `DATABASE_ERROR` - 데이터베이스 오류
- `PREDICTION_NOT_FOUND` - 저장된 예측을 찾을 수 없음
- `INSUFFICIENT_DATA` - 개인화 추천을 위한 데이터 부족

## 🔐 인증 및 보안

### 세션 관리
- 세션 유효기간: 24시간
- 자동 갱신: 활동 시마다 연장
- 보안: HTTPS 필수, 안전한 세션 ID 생성

### API 제한
- 기본 사용자: 시간당 100회 요청
- 프리미엄 사용자: 시간당 500회 요청
- 플래티넘 사용자: 제한 없음

### 요청 예시 (curl)
```bash
# 기본 요청
curl -X GET "https://lotto645-ai.pages.dev/api/draws/latest" \
  -H "Content-Type: application/json"

# 세션이 필요한 요청
curl -X POST "https://lotto645-ai.pages.dev/api/predictions/save" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "prediction_type": "bayesian_inference",
    "predicted_numbers": [2, 28, 30, 38, 40, 44],
    "confidence_score": 0.629
  }'
```

## 🌐 CORS 설정

### 허용된 도메인
- `https://lotto645-ai.pages.dev`
- `https://3000-*.e2b.dev` (개발 환경)
- `http://localhost:3000` (로컬 개발)

### 지원되는 HTTP 메소드
- `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`

### 허용된 헤더
- `Content-Type`, `Authorization`, `X-Session-ID`

## 📊 사용 통계 및 모니터링

### 실시간 통계
```http
GET /api/stats/realtime
```

### 성능 메트릭
- 평균 응답 시간: < 200ms
- 가용성: 99.9%
- API 성공률: > 99%

---

## 📞 지원 및 문의

### 기술 지원
- **GitHub Issues**: https://github.com/happytalkman/lotto645-project/issues
- **이메일**: support@lotto645ai.com
- **문서**: https://wiki.lotto645ai.com

### API 버전 정보
- **현재 버전**: v1.2.0
- **최소 지원 버전**: v1.0.0
- **다음 업데이트**: 2025-10-01

### 변경 이력
- **v1.2.0** (2025-09-18): 개인화 추천 API 추가
- **v1.1.0** (2025-09-17): 예측저장 API 추가
- **v1.0.0** (2025-09-15): 초기 API 출시

---

*이 API 가이드는 지속적으로 업데이트됩니다. 최신 정보는 GitHub Wiki를 확인해주세요.*