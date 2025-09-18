# 로또645.AI 프로젝트 구성 가이드

## 🎯 프로젝트 개요

### 기본 정보
- **프로젝트명**: 로또645.AI
- **목적**: AI 기술과 전통 명리학을 결합한 종합 로또 분석 플랫폼
- **기술 스택**: Hono + TypeScript + Cloudflare D1 + Cloudflare Workers
- **개발 기간**: 2025년 9월 (진행중)
- **라이선스**: 교육 및 연구 목적

### 핵심 특징
- 🤖 **AI 챗봇**: 자연어 처리 기반 실시간 로또 상담
- 📊 **8가지 통계 분석**: 과학적 데이터 분석
- 🔮 **10가지 AI 예측**: 다양한 머신러닝 알고리즘
- 🏪 **명당 판매점**: 위치 기반 고액 당첨 판매점 추천
- 🌟 **개인화**: 사용자 맞춤형 예측 저장 및 추천
- 📱 **반응형 디자인**: 모바일/데스크톱 최적화

## 🏗️ 시스템 아키텍처

### 기술 스택
```
Frontend: HTML5 + CSS3 + Vanilla JavaScript + Tailwind CSS
Backend: Hono Framework (TypeScript)
Database: Cloudflare D1 (SQLite)
Deployment: Cloudflare Pages/Workers
Development: Vite + Wrangler + PM2
UI Library: FontAwesome + Chart.js
```

### 배포 구조
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   사용자 브라우저  │◄──►│ Cloudflare Pages │◄──►│ Cloudflare D1   │
│   (Frontend)   │    │   (Hono App)    │    │   (Database)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │ Cloudflare AI   │
                      │  (Chatbot)     │
                      └─────────────────┘
```

## 📁 프로젝트 구조

```
lotto645-ai/
├── 📂 src/
│   ├── index.tsx           # 메인 애플리케이션 (Frontend + Backend)
│   └── types.ts           # TypeScript 타입 정의 (31개 인터페이스)
├── 📂 migrations/         # 데이터베이스 마이그레이션
│   ├── 0001_initial_schema.sql          # 기본 스키마
│   ├── 0002_prediction_save_schema.sql  # 예측저장 기능
│   ├── 0003_premium_subscription_schema.sql  # 구독 시스템
│   ├── 0005_advanced_analytics_simple.sql    # 고급 분석
│   ├── 0006_fortune_prediction_schema.sql    # 운세 예측
│   ├── 0007_add_favorite_column.sql          # 즐겨찾기
│   └── 0008_add_users_table.sql             # 사용자 테이블
├── 📂 public/            # 정적 파일
│   └── favicon.ico       # 파비콘
├── 📂 .wrangler/         # 로컬 개발 환경 (자동생성)
├── 📂 dist/              # 빌드 출력 (자동생성)
├── 📂 node_modules/      # 의존성 (자동생성)
├── 📄 package.json       # 프로젝트 설정 및 스크립트
├── 📄 wrangler.jsonc     # Cloudflare 설정
├── 📄 vite.config.ts     # Vite 빌드 설정
├── 📄 ecosystem.config.cjs # PM2 개발 서버 설정
├── 📄 seed.sql           # 초기 데이터 (599회분 로또 데이터)
├── 📄 lotto_data.csv     # CSV 형태 로또 데이터
├── 📄 lotto_import.sql   # SQL 형태 로또 데이터
├── 📄 import_data.cjs    # 데이터 가져오기 스크립트
└── 📄 README.md          # 프로젝트 문서
```

## 📊 데이터베이스 설계

### 핵심 테이블 구조

#### 1. `lotto_draws` - 로또 당첨번호 (599회분)
```sql
CREATE TABLE lotto_draws (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  draw_number INTEGER UNIQUE NOT NULL,    -- 회차 번호
  draw_date TEXT NOT NULL,               -- 추첨 날짜
  number1 INTEGER NOT NULL,              -- 당첨번호 1
  number2 INTEGER NOT NULL,              -- 당첨번호 2
  number3 INTEGER NOT NULL,              -- 당첨번호 3
  number4 INTEGER NOT NULL,              -- 당첨번호 4
  number5 INTEGER NOT NULL,              -- 당첨번호 5
  number6 INTEGER NOT NULL,              -- 당첨번호 6
  bonus_number INTEGER NOT NULL,         -- 보너스 번호
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. `lucky_stores` - 명당 판매점
```sql
CREATE TABLE lucky_stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                   -- 판매점명
  address TEXT NOT NULL,                -- 주소
  region TEXT NOT NULL,                 -- 지역
  first_prize_count INTEGER DEFAULT 0,  -- 1등 당첨횟수
  total_prize_count INTEGER DEFAULT 0,  -- 총 당첨횟수
  latitude REAL,                        -- 위도
  longitude REAL,                       -- 경도
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. `users` - 사용자 정보
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,                    -- 이메일 (선택사항)
  username TEXT NOT NULL,               -- 사용자명
  subscription_type TEXT DEFAULT 'basic', -- 구독 타입
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

#### 4. `saved_predictions` - 예측저장 기능
```sql
CREATE TABLE saved_predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  session_id TEXT NOT NULL,
  prediction_type TEXT NOT NULL,        -- 예측 알고리즘
  predicted_numbers TEXT NOT NULL,      -- JSON 배열
  confidence_score REAL,               -- 신뢰도 (0-1)
  memo TEXT,                           -- 사용자 메모
  virtual_round INTEGER,               -- 가상회차 번호
  is_favorite BOOLEAN DEFAULT 0,       -- 즐겨찾기 여부
  tags TEXT,                           -- 태그 (JSON 배열)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. 기타 테이블들
- `user_sessions`: 세션 관리
- `personalized_recommendations`: 개인화 추천
- `user_prediction_patterns`: 사용자 패턴 분석
- `subscription_plans`: 구독 요금제
- `user_subscriptions`: 사용자 구독 정보
- `payment_history`: 결제 내역
- `usage_tracking`: 사용량 추적

## 🔧 핵심 기능 구현

### 1. AI 챗봇 시스템
```typescript
// Cloudflare AI Workers 연동
app.post('/api/chatbot', async (c) => {
  const { env } = c;
  const { message } = await c.req.json();
  
  // AI 모델에게 질문 전송
  const response = await env.AI.run("@cf/meta/llama-2-7b-chat-fp16", {
    messages: [
      {
        role: "system",
        content: "당신은 로또 분석 전문가입니다. 한국어로 친근하고 정확하게 답변해주세요."
      },
      {
        role: "user", 
        content: message
      }
    ]
  });
  
  return c.json({ reply: response.response });
});
```

### 2. 통계 분석 엔진 (8가지)
```typescript
// 빈도 분석 예시
app.get('/api/statistics/frequency', async (c) => {
  const { env } = c;
  
  const frequency = {};
  for (let num = 1; num <= 45; num++) {
    const { results } = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM lotto_draws 
      WHERE number1 = ? OR number2 = ? OR number3 = ? 
         OR number4 = ? OR number5 = ? OR number6 = ?
    `).bind(num, num, num, num, num, num).all();
    
    frequency[num] = results[0].count;
  }
  
  return c.json({
    type: 'frequency_analysis',
    data: frequency,
    summary: `가장 많이 나온 번호는 ${mostFrequent}번입니다.`
  });
});
```

### 3. AI 예측 알고리즘 (10가지)
```typescript
// 베이지안 추론 예시
function bayesianInference(historicalData: number[][]): number[] {
  const priors = Array(45).fill(1/45); // 균등 사전확률
  const likelihoods = calculateLikelihoods(historicalData);
  
  const posteriors = priors.map((prior, i) => 
    prior * likelihoods[i]
  );
  
  // 상위 6개 번호 선택
  return posteriors
    .map((prob, num) => ({ prob, num: num + 1 }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 6)
    .map(item => item.num)
    .sort((a, b) => a - b);
}
```

### 4. 예측저장 시스템
```typescript
// 예측 저장 API
app.post('/api/predictions/save', async (c) => {
  const { env } = c;
  const data = await c.req.json();
  
  const result = await env.DB.prepare(`
    INSERT INTO saved_predictions 
    (session_id, prediction_type, predicted_numbers, confidence_score, memo, tags)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    data.sessionId,
    data.prediction_type,
    JSON.stringify(data.predicted_numbers),
    data.confidence_score,
    data.memo || '',
    JSON.stringify(data.tags || [])
  ).run();
  
  return c.json({ success: true, id: result.meta.last_row_id });
});
```

### 5. 개인화 추천 시스템 (RAG)
```typescript
// RAG 기반 개인화 추천
app.post('/api/recommendations/personalized', async (c) => {
  const { env } = c;
  const { sessionId } = await c.req.json();
  
  // 사용자의 저장된 예측들 조회
  const { results: savedPredictions } = await env.DB.prepare(`
    SELECT * FROM saved_predictions WHERE session_id = ?
  `).bind(sessionId).all();
  
  // 패턴 분석 및 가중치 계산
  const patterns = analyzePredictionPatterns(savedPredictions);
  const weights = calculateAlgorithmWeights(patterns);
  
  // 개인화된 번호 생성
  const personalizedNumbers = generatePersonalizedPrediction(patterns, weights);
  
  return c.json({
    numbers: personalizedNumbers,
    explanation: "과거 예측 패턴을 분석하여 생성된 맞춤형 번호입니다.",
    confidence: calculateConfidence(patterns)
  });
});
```

## 🎨 프론트엔드 아키텍처

### UI 컴포넌트 구조
```
메인 화면
├── 헤더 (로그인/네비게이션)
├── 최신 당첨번호 표시
├── 기능 탭
│   ├── AI 챗봇 섹션
│   ├── 통계 분석 (8가지)
│   ├── AI 예측 (10가지) 
│   ├── 명당 판매점
│   └── 예측저장 관리
└── 푸터
```

### 상태 관리
```javascript
// 전역 상태 관리 (Vanilla JS)
const AppState = {
  user: null,              // 현재 사용자
  session: null,           // 세션 정보
  latestDraw: null,        // 최신 당첨번호
  chatMessages: [],        // 채팅 기록
  predictions: [],         // 저장된 예측
  currentAnalysis: null    // 현재 분석 결과
};

// 상태 업데이트 함수들
function updateUserState(user) { ... }
function addChatMessage(message) { ... }
function savePrediction(prediction) { ... }
```

### 반응형 디자인
```css
/* Tailwind CSS 기반 반응형 */
.container { @apply mx-auto px-4 max-w-7xl; }

/* 모바일 최적화 */
@media (max-width: 768px) {
  .grid-cols-3 { @apply grid-cols-1; }
  .text-3xl { @apply text-2xl; }
}

/* 태블릿 최적화 */
@media (min-width: 768px) and (max-width: 1024px) {
  .grid-cols-3 { @apply grid-cols-2; }
}
```

## 🛠️ 개발 환경 설정

### 1. 로컬 개발 환경
```bash
# 프로젝트 클론
git clone https://github.com/happytalkman/lotto645-project.git
cd lotto645-project

# 의존성 설치
npm install

# 로컬 데이터베이스 설정
npm run db:migrate:local
npm run db:seed

# 개발 서버 시작
npm run build
npm run dev:d1
```

### 2. 필수 도구
- **Node.js** 18+ 
- **npm** 9+
- **wrangler** CLI (Cloudflare)
- **PM2** (프로세스 관리)

### 3. 환경 변수
```bash
# .dev.vars (로컬 개발용)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
DB_ID=lotto645ai-production
```

### 4. 개발 스크립트
```json
{
  "scripts": {
    "dev": "vite",                                    // Vite 개발서버
    "dev:d1": "wrangler pages dev dist --d1=lotto645ai-production --local --ip 0.0.0.0 --port 3000",
    "build": "vite build",                           // 프로덕션 빌드
    "deploy": "npm run build && wrangler pages deploy dist --project-name lotto645-ai",
    "db:migrate:local": "wrangler d1 migrations apply lotto645ai-production --local",
    "db:migrate:prod": "wrangler d1 migrations apply lotto645ai-production",
    "db:seed": "wrangler d1 execute lotto645ai-production --local --file=./seed.sql",
    "db:reset": "rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local && npm run db:seed"
  }
}
```

## 🚀 배포 가이드

### 1. Cloudflare Pages 배포
```bash
# 1. 빌드
npm run build

# 2. Cloudflare 프로젝트 생성
wrangler pages project create lotto645-ai --production-branch main

# 3. 배포
wrangler pages deploy dist --project-name lotto645-ai
```

### 2. 데이터베이스 설정
```bash
# 1. D1 데이터베이스 생성
wrangler d1 create lotto645ai-production

# 2. 마이그레이션 실행
wrangler d1 migrations apply lotto645ai-production

# 3. 초기 데이터 삽입
wrangler d1 execute lotto645ai-production --file=./seed.sql
```

### 3. 환경 설정
```bash
# 프로덕션 환경변수 설정
wrangler pages secret put DATABASE_URL --project-name lotto645-ai
wrangler pages secret put AI_API_KEY --project-name lotto645-ai
```

## 📈 성능 최적화

### 1. 빌드 최적화
- **Vite 번들링**: Tree-shaking으로 불필요한 코드 제거
- **코드 분할**: 동적 import로 lazy loading
- **정적 자산**: CDN 활용 (TailwindCSS, FontAwesome, Chart.js)

### 2. 데이터베이스 최적화
```sql
-- 인덱스 설정
CREATE INDEX idx_lotto_draws_draw_number ON lotto_draws(draw_number);
CREATE INDEX idx_saved_predictions_session_id ON saved_predictions(session_id);
CREATE INDEX idx_lucky_stores_region ON lucky_stores(region);
```

### 3. 캐싱 전략
- **Cloudflare CDN**: 정적 파일 글로벌 캐싱
- **브라우저 캐싱**: 분석 결과 로컬 저장
- **API 응답 캐싱**: 자주 요청되는 데이터 캐싱

## 🔒 보안 가이드

### 1. 사용자 인증
```typescript
// 세션 기반 인증
const sessionId = crypto.randomUUID();
const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간

await env.DB.prepare(`
  INSERT INTO user_sessions (session_id, username, expires_at)
  VALUES (?, ?, ?)
`).bind(sessionId, username, expiresAt.toISOString()).run();
```

### 2. 데이터 검증
```typescript
// 입력값 검증
function validateLottoNumbers(numbers: number[]): boolean {
  return numbers.length === 6 &&
         numbers.every(n => n >= 1 && n <= 45) &&
         new Set(numbers).size === 6; // 중복 제거
}
```

### 3. CORS 설정
```typescript
// CORS 미들웨어
app.use('/api/*', cors({
  origin: ['https://lotto645-ai.pages.dev'],
  credentials: true
}));
```

## 📊 모니터링 및 분석

### 1. 사용량 추적
```typescript
// API 호출 로깅
app.use('/api/*', async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  
  console.log(`${c.req.method} ${c.req.url} - ${duration}ms`);
});
```

### 2. 에러 처리
```typescript
// 전역 에러 핸들러
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    success: false,
    error: '서버 오류가 발생했습니다.'
  }, 500);
});
```

### 3. 성능 메트릭
- **응답 시간**: API 엔드포인트별 평균 응답 시간
- **사용자 활동**: 일별/월별 활성 사용자 수
- **기능 사용률**: 각 분석/예측 기능 사용 빈도

## 🔮 향후 개발 계획

### Phase 1: 완료됨 ✅
- [x] 기본 UI/UX 구현
- [x] AI 챗봇 시스템
- [x] 8가지 통계 분석
- [x] 10가지 AI 예측 알고리즘
- [x] 명당 판매점 정보
- [x] 예측저장 시스템
- [x] 개인화 추천 (RAG)

### Phase 2: 개발중 🚧
- [ ] 프리미엄 구독 시스템
- [ ] 결제 연동 (Stripe)
- [ ] 고급 분석 도구
- [ ] 모바일 앱 (PWA)

### Phase 3: 계획 📋
- [ ] 소셜 기능 (커뮤니티)
- [ ] 실시간 알림
- [ ] 다국어 지원
- [ ] API 외부 개방

## 🤝 기여 가이드

### 1. 개발 참여
```bash
# 포크 후 클론
git clone https://github.com/your-username/lotto645-project.git

# 브랜치 생성
git checkout -b feature/new-feature

# 개발 후 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 푸시 후 PR
git push origin feature/new-feature
```

### 2. 코딩 컨벤션
- **TypeScript**: 엄격한 타입 사용
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Conventional Commits**: 커밋 메시지 규칙

### 3. 테스팅
```bash
# API 테스트
curl https://lotto645-ai.pages.dev/api/draws/latest

# 기능 테스트 체크리스트
- [ ] 챗봇 응답 정상
- [ ] 통계 분석 결과 출력
- [ ] 예측 알고리즘 동작
- [ ] 예측저장 기능
- [ ] 개인화 추천 생성
```

## 📚 참고 자료

### 1. 기술 문서
- [Hono 공식 문서](https://hono.dev/)
- [Cloudflare D1 문서](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers 문서](https://developers.cloudflare.com/workers/)
- [TailwindCSS 문서](https://tailwindcss.com/docs)

### 2. 로또 관련 자료
- [동행복권 공식사이트](https://www.dhlottery.co.kr/)
- [로또 당첨번호 API](https://www.dhlottery.co.kr/common.do?method=getLottoNumber)
- [통계청 확률 이론](https://kostat.go.kr/)

### 3. AI/ML 자료
- [베이지안 추론 이론](https://en.wikipedia.org/wiki/Bayesian_inference)
- [머신러닝 알고리즘 가이드](https://scikit-learn.org/)
- [RAG (Retrieval-Augmented Generation)](https://arxiv.org/abs/2005.11401)

## ⚠️ 중요 안내사항

### 법적 고지
- 본 서비스는 **교육 및 연구 목적**으로 제작되었습니다
- 로또는 **확률 게임**이며 어떤 알고리즘도 당첨을 보장하지 않습니다
- **적정선에서 건전하게** 로또를 즐기시기 바랍니다
- 과도한 도박은 개인과 가정에 해로울 수 있습니다

### 책임 제한
- AI 예측 결과에 대한 책임은 사용자에게 있습니다
- 투자/도박 결정에 따른 손실에 대해 책임지지 않습니다
- 서비스 이용 전 이용약관을 반드시 확인하세요

---

**📞 문의사항**  
프로젝트 관련 문의나 개선 제안은 [GitHub Issues](https://github.com/happytalkman/lotto645-project/issues)를 통해 남겨주세요.

**🏷️ 버전 정보**  
- 현재 버전: v1.2.0
- 마지막 업데이트: 2025-09-18
- 다음 업데이트 예정: 2025-10-01

**💝 후원 및 지원**  
이 프로젝트가 도움이 되었다면 ⭐ 스타를 눌러주세요!

---

*Made with ❤️ using Hono, Cloudflare Workers, and AI*