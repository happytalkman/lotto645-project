# 로또645.AI 개발자 가이드

## 🚀 개발 환경 설정

### 필수 도구 설치

#### 1. Node.js 및 npm
```bash
# Node.js 18+ 설치 확인
node --version  # v18.0.0 이상
npm --version   # v9.0.0 이상

# 필요시 nvm 사용하여 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### 2. Wrangler CLI (Cloudflare)
```bash
# Wrangler 전역 설치
npm install -g wrangler

# 버전 확인
wrangler --version

# Cloudflare 로그인 (API 토큰 필요)
wrangler auth login
```

#### 3. PM2 (프로세스 관리)
```bash
# PM2 전역 설치 (개발 환경용)
npm install -g pm2

# PM2 상태 확인
pm2 status
```

### 프로젝트 클론 및 설정

#### 1. 리포지토리 클론
```bash
# 프로젝트 클론
git clone https://github.com/happytalkman/lotto645-project.git
cd lotto645-project

# 개발 브랜치 체크아웃 (선택사항)
git checkout develop
```

#### 2. 의존성 설치
```bash
# npm 의존성 설치 (약 2-3분 소요)
npm install

# 설치 확인
npm list --depth=0
```

#### 3. 환경 변수 설정
```bash
# .dev.vars 파일 생성 (로컬 개발용)
cat > .dev.vars << EOF
CLOUDFLARE_ACCOUNT_ID=your-account-id
DB_ID=lotto645ai-production
AI_BINDING=AI
EOF

# 환경 변수 확인
cat .dev.vars
```

### 로컬 데이터베이스 설정

#### 1. D1 데이터베이스 생성
```bash
# 로컬 D1 데이터베이스 디렉토리 생성
mkdir -p .wrangler/state/v3/d1/miniflare-D1DatabaseObject

# SQLite 파일 생성 (자동으로 생성됨)
npm run db:migrate:local
```

#### 2. 초기 데이터 로드
```bash
# 마이그레이션 실행 (스키마 생성)
npm run db:migrate:local

# 시드 데이터 삽입 (599회분 로또 데이터)
npm run db:seed

# 데이터베이스 확인
npm run db:console:local
# SQLite 콘솔에서 확인:
# SELECT COUNT(*) FROM lotto_draws;
# .quit
```

## 🛠️ 개발 워크플로우

### 1. 개발 서버 시작
```bash
# 방법 1: npm 스크립트 사용
npm run build        # 먼저 빌드
npm run dev:d1       # D1 데이터베이스와 함께 시작

# 방법 2: PM2 사용 (권장)
npm run build
pm2 start ecosystem.config.cjs
pm2 logs webapp --nostream
```

#### 개발 서버 접속
```bash
# 로컬 접속
curl http://localhost:3000

# 퍼블릭 URL 얻기 (sandbox 환경)
# GetServiceUrl 도구 사용하여 HTTPS URL 획득
```

### 2. 코드 변경 및 테스트 주기
```bash
# 1. 코드 수정 (src/index.tsx, src/types.ts)
# 2. 빌드 (변경사항이 많은 경우)
npm run build

# 3. 개발 서버 재시작 (필요시)
pm2 restart webapp

# 4. API 테스트
curl http://localhost:3000/api/draws/latest

# 5. 브라우저 테스트
# http://localhost:3000 접속하여 기능 확인
```

### 3. 데이터베이스 조작
```bash
# 로컬 DB 콘솔 접속
npm run db:console:local

# 프로덕션 DB 콘솔 접속 (조심해서 사용)
npm run db:console:prod

# 데이터베이스 리셋 (개발 시에만)
npm run db:reset

# 새로운 마이그레이션 생성
# migrations/ 폴더에 새 .sql 파일 생성 후
npm run db:migrate:local
```

## 🏗️ 코드 구조 이해

### 메인 애플리케이션 구조 (src/index.tsx)
```typescript
// 1. 임포트 및 타입 정의
import { Hono } from 'hono'
import type { Bindings } from './types'

// 2. Hono 앱 초기화
const app = new Hono<{ Bindings: Bindings }>()

// 3. 미들웨어 설정
app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './public' }))

// 4. 메인 페이지 (HTML)
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>...`) // 전체 프론트엔드 포함
})

// 5. API 라우트들
app.get('/api/draws/latest', async (c) => { ... })
app.post('/api/chatbot', async (c) => { ... })
// ... 기타 API들

// 6. 내장 JavaScript 함수들 (HTML 내부)
// - 챗봇 처리
// - 통계 분석 실행
// - 예측 저장 관리
// - UI 상호작용 처리

export default app
```

### 타입 정의 (src/types.ts)
```typescript
// 1. 기본 데이터 타입들
export interface LottoDraw { ... }
export interface LuckyStore { ... }
export interface User { ... }

// 2. API 응답 타입들
export interface APIResponse<T> { ... }
export interface NumberRecommendation { ... }

// 3. 알고리즘 및 분석 타입들
export type PredictionAlgorithm = '...'
export type StatisticalAnalysis = '...'

// 4. 사용자 기능 타입들
export interface SavedPrediction { ... }
export interface PersonalizedRecommendation { ... }

// 5. Cloudflare 바인딩
export interface Bindings {
  DB: D1Database;
  AI?: Ai;
}
```

### 프론트엔드 JavaScript 구조 (HTML 내부)
```javascript
// 1. 전역 상태 관리
let currentUser = null;
let currentSession = null;
let chatMessages = [];

// 2. 유틸리티 함수들
function safeGetElement(id) { ... }
function formatNumbers(numbers) { ... }
function validateSession() { ... }

// 3. API 호출 함수들
async function fetchLatestDraw() { ... }
async function sendChatMessage(message) { ... }
async function runAnalysis(type) { ... }

// 4. UI 이벤트 핸들러들
function showPrediction() { ... }
function savePrediction() { ... }
function toggleSection(id) { ... }

// 5. 초기화 및 이벤트 리스너들
window.addEventListener('load', initializeApp);
```

## 🔧 주요 개발 태스크

### 1. 새로운 API 엔드포인트 추가
```typescript
// src/index.tsx에 새 라우트 추가
app.get('/api/new-feature', async (c) => {
  try {
    const { env } = c;
    
    // 데이터베이스 쿼리
    const { results } = await env.DB.prepare(`
      SELECT * FROM table_name WHERE condition = ?
    `).bind(parameter).all();
    
    // 응답 반환
    return c.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error:', error);
    return c.json({
      success: false,
      error: '오류가 발생했습니다.'
    }, 500);
  }
});
```

### 2. 새로운 프론트엔드 기능 추가
```javascript
// HTML의 <script> 섹션에 함수 추가
async function newFeature() {
  try {
    // API 호출
    const response = await fetch('/api/new-feature');
    const data = await response.json();
    
    if (data.success) {
      // UI 업데이트
      updateUI(data.data);
    } else {
      showErrorMessage(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage('네트워크 오류가 발생했습니다.');
  }
}

// HTML에 버튼 추가
// <button onclick="newFeature()" class="...">새 기능</button>
```

### 3. 데이터베이스 스키마 변경
```sql
-- migrations/000X_new_feature.sql
CREATE TABLE new_table (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_new_table_name ON new_table(name);
```

```bash
# 마이그레이션 적용
npm run db:migrate:local
npm run db:migrate:prod  # 프로덕션 배포 시
```

### 4. 새로운 AI 예측 알고리즘 추가
```typescript
// src/index.tsx의 예측 함수에 알고리즘 추가
function generatePrediction(algorithm: string): number[] {
  switch (algorithm) {
    case 'new_algorithm':
      return newAlgorithmPrediction();
    // ... 기존 케이스들
  }
}

function newAlgorithmPrediction(): number[] {
  // 새로운 알고리즘 로직 구현
  // ...
  return selectedNumbers;
}
```

## 🧪 테스팅 가이드

### 1. API 테스트
```bash
# 기본 API 테스트
curl http://localhost:3000/api/draws/latest

# 챗봇 테스트
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"최신 당첨번호 알려줘"}'

# 예측 테스트
curl -X POST http://localhost:3000/api/prediction \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"bayesian_inference"}'

# 통계 분석 테스트
curl http://localhost:3000/api/statistics/frequency
```

### 2. 프론트엔드 테스트 체크리스트
- [ ] **페이지 로딩**: 메인 페이지가 정상적으로 로드되는가?
- [ ] **최신 당첨번호**: 상단에 최신 당첨번호가 표시되는가?
- [ ] **챗봇**: 메시지 전송 및 응답이 정상적으로 작동하는가?
- [ ] **통계 분석**: 8가지 분석 버튼이 모두 작동하는가?
- [ ] **AI 예측**: 10가지 예측 알고리즘이 모두 작동하는가?
- [ ] **로그인**: 로그인 모달이 정상적으로 작동하는가?
- [ ] **예측저장**: 예측 저장 및 조회가 작동하는가?
- [ ] **개인화 추천**: RAG 기반 추천이 작동하는가?
- [ ] **명당 판매점**: 판매점 정보가 올바르게 표시되는가?
- [ ] **반응형**: 모바일에서 정상적으로 표시되는가?

### 3. 데이터베이스 테스트
```sql
-- 데이터 무결성 확인
SELECT COUNT(*) FROM lotto_draws;  -- 599여야 함
SELECT MIN(draw_number), MAX(draw_number) FROM lotto_draws;  -- 1, 599

-- 외래키 제약 조건 확인
SELECT * FROM saved_predictions WHERE session_id NOT IN (SELECT session_id FROM user_sessions);

-- 인덱스 사용 확인 (개발 시)
EXPLAIN QUERY PLAN SELECT * FROM lotto_draws WHERE draw_number = 599;
```

### 4. 성능 테스트
```javascript
// 브라우저 개발자 도구에서 실행
console.time('API 응답 시간');
fetch('/api/draws/latest')
  .then(response => response.json())
  .then(data => {
    console.timeEnd('API 응답 시간');
    console.log('응답 데이터:', data);
  });
```

## 🐛 디버깅 가이드

### 1. 서버 로그 확인
```bash
# PM2 로그 실시간 확인
pm2 logs webapp

# PM2 로그 한 번만 확인
pm2 logs webapp --nostream

# Wrangler 개발 서버 직접 실행 (디버깅용)
cd /path/to/project
wrangler pages dev dist --d1=lotto645ai-production --local --ip 0.0.0.0 --port 3000
```

### 2. 브라우저 디버깅
```javascript
// 브라우저 콘솔에서 상태 확인
console.log('현재 사용자:', currentUser);
console.log('현재 세션:', currentSession);
console.log('채팅 메시지:', chatMessages);

// API 응답 디버깅
fetch('/api/draws/latest')
  .then(response => {
    console.log('Status:', response.status);
    return response.json();
  })
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error:', error));
```

### 3. 데이터베이스 디버깅
```bash
# 로컬 DB 직접 접근
sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/lotto645ai-production.sqlite

# 자주 사용하는 디버깅 쿼리들
.tables                    -- 테이블 목록
.schema lotto_draws        -- 테이블 스키마
SELECT * FROM lotto_draws ORDER BY id DESC LIMIT 5;  -- 최신 5개 데이터
```

### 4. 일반적인 문제 해결

#### 포트 3000 사용 중 오류
```bash
# 포트 사용 프로세스 확인
lsof -i :3000
netstat -tulpn | grep :3000

# 포트 해제
fuser -k 3000/tcp

# 또는 PM2로 정리
pm2 delete all
```

#### 빌드 오류
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install

# 캐시 정리
npm cache clean --force

# TypeScript 오류 확인
npx tsc --noEmit
```

#### 데이터베이스 연결 오류
```bash
# .wrangler 디렉토리 리셋
rm -rf .wrangler
npm run db:migrate:local
npm run db:seed
```

## 📦 빌드 및 배포

### 1. 로컬 빌드
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
ls -la dist/
cat dist/_routes.json

# 로컬에서 프로덕션 빌드 테스트
npm run preview
```

### 2. Cloudflare Pages 배포
```bash
# 1. Cloudflare 인증 확인
wrangler whoami

# 2. 프로덕션 데이터베이스 마이그레이션 (첫 배포 시)
wrangler d1 migrations apply lotto645ai-production

# 3. 배포
npm run deploy:prod

# 4. 배포 상태 확인
wrangler pages deployment list --project-name lotto645-ai
```

### 3. 환경별 배포 설정
```bash
# 개발 환경 배포
wrangler pages deploy dist --project-name lotto645-ai-dev

# 스테이징 환경 배포
wrangler pages deploy dist --project-name lotto645-ai-staging

# 프로덕션 환경 배포
wrangler pages deploy dist --project-name lotto645-ai
```

### 4. 배포 후 확인 사항
- [ ] 사이트가 정상적으로 로드되는가?
- [ ] API 엔드포인트가 모두 작동하는가?
- [ ] 데이터베이스 연결이 정상인가?
- [ ] 정적 파일들이 올바르게 서빙되는가?
- [ ] HTTPS 인증서가 적용되었는가?

## 🔄 Git 워크플로우

### 1. 브랜치 전략
```
main (프로덕션)
├── develop (개발)
│   ├── feature/new-algorithm (기능 개발)
│   ├── feature/ui-improvement (UI 개선)
│   └── hotfix/critical-bug (긴급 수정)
```

### 2. 개발 워크플로우
```bash
# 1. 개발 브랜치에서 작업 시작
git checkout develop
git pull origin develop

# 2. 기능 브랜치 생성
git checkout -b feature/new-prediction-algorithm

# 3. 개발 및 커밋
git add .
git commit -m "feat: 새로운 예측 알고리즘 추가

- 퀀텀 분석 알고리즘 구현
- API 엔드포인트 추가
- 프론트엔드 UI 연동"

# 4. 푸시 및 PR 생성
git push origin feature/new-prediction-algorithm
# GitHub에서 Pull Request 생성

# 5. 코드 리뷰 후 머지
# develop <- feature 브랜치 머지

# 6. 배포 준비 시 main으로 머지
git checkout main
git merge develop
git push origin main
```

### 3. 커밋 메시지 컨벤션
```bash
# 타입(스코프): 설명

feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 스타일 변경 (포맷팅 등)
refactor: 코드 리팩토링
test: 테스트 코드 추가/수정
chore: 빌드, 설정 파일 수정

# 예시:
feat(api): 개인화 추천 API 추가
fix(ui): 모바일에서 버튼 클릭 안되는 문제 수정
docs(readme): 설치 가이드 업데이트
```

## 📊 모니터링 및 로깅

### 1. 개발 환경 모니터링
```bash
# 개발 서버 상태 확인
pm2 status
pm2 monit  # 실시간 모니터링

# 리소스 사용량 확인
htop
df -h
```

### 2. 로그 분석
```bash
# 애플리케이션 로그
pm2 logs webapp --lines 100

# 시스템 로그
tail -f /var/log/syslog

# 특정 오류 검색
pm2 logs webapp | grep -i error
```

### 3. 성능 프로파일링
```javascript
// 브라우저에서 성능 측정
performance.mark('start');
// ... 코드 실행
performance.mark('end');
performance.measure('operation', 'start', 'end');
console.log(performance.getEntriesByType('measure'));
```

## 🛡️ 보안 가이드라인

### 1. 코드 보안
```typescript
// SQL 인젝션 방지 - 항상 바인딩 사용
const { results } = await env.DB.prepare(`
  SELECT * FROM users WHERE id = ?
`).bind(userId).all();  // ✅ 올바름

// 절대 하지 말 것:
// const query = `SELECT * FROM users WHERE id = ${userId}`;  // ❌ 위험

// XSS 방지 - 사용자 입력 검증
function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
```

### 2. 환경 변수 보안
```bash
# .dev.vars는 절대 커밋하지 말 것
echo ".dev.vars" >> .gitignore

# 프로덕션에서는 wrangler secrets 사용
wrangler pages secret put API_KEY --project-name lotto645-ai
```

### 3. API 보안
```typescript
// 세션 검증
async function validateSession(sessionId: string, env: any) {
  const session = await env.DB.prepare(`
    SELECT * FROM user_sessions 
    WHERE session_id = ? AND expires_at > datetime('now')
  `).bind(sessionId).first();
  
  return session !== null;
}

// 레이트 리미팅 (향후 구현)
const rateLimiter = new Map();
function checkRateLimit(ip: string): boolean {
  // 구현 로직...
}
```

## 🎯 성능 최적화

### 1. 프론트엔드 최적화
```javascript
// 이미지 lazy loading
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});

// API 호출 캐싱
const apiCache = new Map();
async function cachedFetch(url, options = {}) {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  
  if (apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey);
    if (Date.now() - cached.timestamp < 60000) { // 1분 캐시
      return cached.data;
    }
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  apiCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}
```

### 2. 백엔드 최적화
```typescript
// 데이터베이스 쿼리 최적화
// 인덱스 활용
const { results } = await env.DB.prepare(`
  SELECT * FROM lotto_draws 
  WHERE draw_number = ?  -- 인덱스 사용
  ORDER BY id DESC 
  LIMIT 1
`).bind(drawNumber).all();

// 불필요한 데이터 조회 방지
const { results } = await env.DB.prepare(`
  SELECT draw_number, draw_date, number1, number2, number3, number4, number5, number6
  FROM lotto_draws  -- created_at 등 불필요한 컬럼 제외
  ORDER BY draw_number DESC
  LIMIT 10
`).all();

// 페이지네이션 구현
async function getPaginatedResults(page: number, limit: number) {
  const offset = (page - 1) * limit;
  
  const { results } = await env.DB.prepare(`
    SELECT * FROM table_name
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();
  
  return results;
}
```

## 🧩 확장 개발 가이드

### 1. 새로운 분석 알고리즘 추가
```typescript
// src/index.tsx에 새 분석 함수 추가
async function newAnalysisAlgorithm(env: any): Promise<StatisticsResult> {
  // 1. 데이터 수집
  const { results: historicalData } = await env.DB.prepare(`
    SELECT number1, number2, number3, number4, number5, number6
    FROM lotto_draws
    ORDER BY draw_number DESC
    LIMIT 100
  `).all();
  
  // 2. 분석 로직
  const analysisResult = performNewAnalysis(historicalData);
  
  // 3. 결과 포맷팅
  return {
    type: 'new_analysis' as StatisticalAnalysis,
    data: analysisResult.data,
    summary: analysisResult.summary,
    recommended_numbers: analysisResult.recommendations,
    explanation: analysisResult.explanation
  };
}

// API 라우트 추가
app.get('/api/statistics/new-analysis', async (c) => {
  try {
    const result = await newAnalysisAlgorithm(c.env);
    return c.json({
      success: true,
      data: result
    });
  } catch (error) {
    return c.json({
      success: false,
      error: '분석 중 오류가 발생했습니다.'
    }, 500);
  }
});
```

### 2. 새로운 UI 컴포넌트 추가
```html
<!-- HTML 섹션에 새 컴포넌트 추가 -->
<div id="new-feature-section" class="hidden">
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-xl font-bold mb-4">새로운 기능</h3>
    <div id="new-feature-content">
      <!-- 컴포넌트 내용 -->
    </div>
    <button onclick="executeNewFeature()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      실행
    </button>
  </div>
</div>
```

```javascript
// JavaScript 함수 추가
async function executeNewFeature() {
  try {
    const loadingElement = document.getElementById('new-feature-content');
    loadingElement.innerHTML = '<div class="text-center">분석 중...</div>';
    
    const response = await fetch('/api/new-feature');
    const data = await response.json();
    
    if (data.success) {
      displayNewFeatureResult(data.data);
    } else {
      showErrorMessage(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage('네트워크 오류가 발생했습니다.');
  }
}

function displayNewFeatureResult(data) {
  const content = document.getElementById('new-feature-content');
  content.innerHTML = `
    <div class="space-y-4">
      <h4 class="font-semibold">분석 결과</h4>
      <div class="grid grid-cols-2 gap-4">
        <!-- 결과 표시 로직 -->
      </div>
    </div>
  `;
}
```

### 3. 데이터베이스 테이블 추가
```sql
-- migrations/000X_new_feature_table.sql
CREATE TABLE new_feature_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  feature_type TEXT NOT NULL,
  data_json TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_new_feature_data_user_id ON new_feature_data(user_id);
CREATE INDEX idx_new_feature_data_type ON new_feature_data(feature_type);
CREATE INDEX idx_new_feature_data_created_at ON new_feature_data(created_at);
```

```typescript
// src/types.ts에 타입 추가
export interface NewFeatureData {
  id: number;
  user_id?: number;
  feature_type: string;
  data_json: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
```

## 📚 참고 리소스

### 공식 문서
- [Hono.js](https://hono.dev/) - 웹 프레임워크
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - 데이터베이스
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - 서버리스 런타임
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) - 개발 도구
- [TailwindCSS](https://tailwindcss.com/) - CSS 프레임워크

### 유용한 도구
- [SQLite Browser](https://sqlitebrowser.org/) - DB 시각화 도구
- [Postman](https://www.postman.com/) - API 테스팅
- [VS Code Extensions](https://marketplace.visualstudio.com/):
  - Hono
  - SQLite Viewer
  - Tailwind CSS IntelliSense
  - TypeScript Importer

### 커뮤니티
- [Hono Discord](https://discord.gg/hono)
- [Cloudflare Developers Discord](https://discord.gg/cloudflaredev)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/hono+cloudflare-workers)

---

## 💡 팁과 베스트 프랙티스

### 개발 효율성
1. **핫 리로딩 활용**: `wrangler pages dev`는 자동 리로딩 지원
2. **브라우저 개발자 도구**: 네트워크 탭에서 API 응답 확인
3. **콘솔 로그 활용**: `console.log`로 디버깅 정보 출력
4. **PM2 모니터링**: `pm2 monit`로 실시간 상태 확인

### 코드 품질
1. **타입 안정성**: TypeScript 엄격 모드 사용
2. **에러 처리**: 모든 비동기 함수에 try-catch 블록
3. **입력 검증**: 사용자 입력은 항상 검증
4. **코드 분리**: 큰 함수는 작은 함수로 분리

### 성능 고려사항
1. **데이터베이스**: 인덱스 적절히 사용
2. **API**: 불필요한 데이터 전송 방지
3. **캐싱**: 자주 사용되는 데이터는 캐싱
4. **최적화**: 이미지 lazy loading, 코드 스플리팅

---

*이 개발 가이드는 지속적으로 업데이트됩니다. 새로운 기능이나 개선사항이 있으면 문서를 함께 업데이트해 주세요!*