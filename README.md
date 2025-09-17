# 로또645.AI - AI 기반 로또 분석 플랫폼

## 프로젝트 개요

- **이름**: 로또645.AI
- **목표**: AI 기술을 활용한 과학적이고 체계적인 로또 분석 플랫폼 제공
- **주요 기능**: AI 챗봇, 통계 분석, AI 예측, 명당 정보 제공

## 공개 URL

- **개발 서버**: https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev
- **GitHub**: https://github.com/happytalkman/lotto645-project

## 핵심 기능

### ✅ 완료된 기능

1. **AI 로또 분석 챗봇**
   - 자연어 처리를 통한 실시간 질문 응답
   - 최신 당첨 번호, 빈도 분석, 명당 정보 제공
   - 사용자 친화적인 채팅 인터페이스

2. **8가지 통계 분석 시스템**
   - 빈도 분석: 번호별 출현 빈도 통계
   - 핫/콜드 번호: 최근 자주/드물게 나온 번호 분석
   - 패턴 분석: 짝수/홀수, 저구간/고구간 비율 분석
   - 상관관계 분석: 번호 간 상관성 분석
   - 트렌드 분석: 시간에 따른 번호 출현 경향
   - 분포 분석: 번호 분포 패턴 분석
   - 연속 분석: 연속된 번호 출현 패턴
   - 확률 분석: 통계적 확률 계산

3. **10가지 AI 예측 알고리즘**
   - 베이지안 추론: 과거 데이터 기반 확률 모델
   - 신경망: 딥러닝을 통한 패턴 학습
   - 빈도 분석: 출현 빈도 기반 예측
   - 패턴 인식: 패턴 매칭 기반 예측
   - 몬테카를로: 무작위 시뮬레이션 기법
   - 마르코프 체인: 상태 전이 모델
   - 유전 알고리즘: 진화 알고리즘 기법
   - 클러스터링: 유사 패턴 그룹화
   - 회귀 분석: 트렌드 기반 회귀 모델
   - 앙상블: 여러 모델의 결과 종합

4. **명당 판매점 정보**
   - 전국 고액 당첨 판매점 정보
   - 지역별, 당첨 실적별 정렬
   - 1등 당첨 횟수 및 총 당첨 횟수 표시

5. **실시간 당첨 번호 정보**
   - 최신 당첨 번호 자동 업데이트
   - 회차별 당첨 번호 이력 조회
   - 시각적으로 보기 쉬운 번호 표시

6. **🆕 예측저장 시스템**
   - **사용자 인증**: 로그인/회원가입 (이메일 선택사항)
   - **예측 저장**: AI 예측 결과를 가상회차와 메모로 저장
   - **태그 시스템**: 예측에 태그 추가로 분류 관리
   - **즐겨찾기**: 중요한 예측을 즐겨찾기로 관리
   - **개인화 추천**: 저장된 예측 기반 RAG AI 추천
   - **패턴 학습**: 사용자 선호도와 행동 패턴 자동 학습

7. **🆕 개인화 추천 시스템 (RAG)**
   - 사용자의 저장된 예측 데이터 분석
   - 자주 선택한 번호 패턴 학습
   - 선호 알고리즘 기반 가중치 적용
   - 개인 맞춤형 번호 추천 생성
   - 추천 이유와 신뢰도 제공

### 🚧 개발 중인 기능

8. **프리미엄 구독 시스템**
   - 기본/프리미엄/플래티넘 3단계 구독제
   - 구독별 차별화된 기능 제공
   - 결제 시스템 연동

## 기술 스택

- **백엔드**: Hono (TypeScript)
- **프론트엔드**: Vanilla JavaScript + Tailwind CSS
- **데이터베이스**: Cloudflare D1 (SQLite)
- **배포**: Cloudflare Pages/Workers
- **개발 도구**: Vite, Wrangler, PM2

## 데이터 구조

### 주요 테이블

1. **lotto_draws**: 로또 당첨 번호 데이터
   - 599회분의 과거 당첨 번호 포함 (2002년~2025년)
   - 회차, 날짜, 6개 번호, 보너스 번호

2. **lucky_stores**: 명당 판매점 정보
   - 판매점명, 주소, 지역, 당첨 실적
   - 위도/경도 정보 포함

3. **users**: 사용자 정보
   - 이메일, 사용자명, 구독 유형, 마지막 로그인

4. **user_sessions**: 사용자 세션 관리
   - 세션 ID, 사용자 정보, 만료 시간

5. **🆕 saved_predictions**: 예측저장 데이터
   - 사용자별 저장된 AI 예측 결과
   - 가상회차, 메모, 태그, 즐겨찾기 여부
   - 예측 알고리즘 및 신뢰도 정보

6. **🆕 personalized_recommendations**: 개인화 추천 결과
   - 사용자별 RAG 기반 개인화 추천
   - 기반이 된 저장된 예측 ID들
   - 추천 이유 및 설명

7. **🆕 user_prediction_patterns**: 사용자 예측 패턴
   - 자주 사용하는 번호 패턴
   - 선호 알고리즘 분석
   - 시간대별, 키워드별 패턴 학습

## API 엔드포인트

### 현재 기능 중인 API

#### 기본 기능
- `GET /api/draws/latest` - 최신 당첨 번호
- `GET /api/draws` - 당첨 번호 목록 (페이지네이션)
- `GET /api/stores` - 명당 판매점 정보
- `POST /api/chatbot` - AI 챗봇 대화
- `POST /api/analysis` - 통계 분석 실행
- `POST /api/prediction` - AI 예측 실행

#### 🆕 사용자 인증 API
- `POST /api/auth/login` - 로그인/회원가입
- `GET /api/auth/session/{sessionId}` - 세션 확인
- `POST /api/auth/logout` - 로그아웃

#### 🆕 예측저장 API
- `POST /api/predictions/save` - AI 예측 결과 저장
- `GET /api/predictions/saved/{sessionId}` - 저장된 예측 조회
- `PUT /api/predictions/saved/{id}` - 저장된 예측 수정
- `DELETE /api/predictions/saved/{id}` - 저장된 예측 삭제

#### 🆕 개인화 추천 API
- `POST /api/recommendations/personalized` - RAG 기반 개인화 추천

#### ✅ 통계 분석 API (완료)
- `GET /api/statistics/frequency` - 빈도 분석
- `GET /api/statistics/hot-cold` - 핫/콜드 번호 분석
- `GET /api/statistics/pattern` - 패턴 분석  
- `GET /api/statistics/correlation` - 상관관계 분석
- `GET /api/statistics/trend` - 트렌드 분석
- `GET /api/statistics/distribution` - 분포 분석
- `GET /api/statistics/sequence` - 연속 분석
- `GET /api/statistics/probability` - 확률 분석 (최근 수정됨)

### API 사용 예시

#### 기본 기능
```bash
# 최신 당첨 번호 조회
curl https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/draws/latest

# AI 챗봇과 대화
curl -X POST https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"최신 당첨번호 알려줘"}'

# AI 예측 실행
curl -X POST https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/prediction \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"bayesian_inference"}'
```

#### ✅ 통계 분석 API 사용법 (완료)
```bash
# 빈도 분석
curl https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/statistics/frequency

# 확률 분석 (최근 수정됨)
curl https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/statistics/probability

# 패턴 분석
curl https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/statistics/pattern
```

#### 🆕 예측저장 기능
```bash
# 로그인
curl -X POST https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"테스트유저","email":"test@example.com"}'

# 예측 저장
curl -X POST https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/predictions/save \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId":"your-session-id",
    "prediction_type":"bayesian_inference",
    "predicted_numbers":[2,28,30,38,40,44],
    "confidence_score":0.629,
    "memo":"베이지안 추론으로 생성된 예측",
    "tags":["베이지안","높은신뢰도"]
  }'

# 저장된 예측 조회
curl "https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/predictions/saved/your-session-id?page=1&limit=10"

# 개인화 추천 받기
curl -X POST https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev/api/recommendations/personalized \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"your-session-id","include_favorites_only":false}'
```

## 사용자 가이드

### 웹 인터페이스 사용법

1. **홈페이지 접속**: https://3000-irzoqnqwwkij0968hkeys-6532622b.e2b.dev
2. **최신 당첨 번호 확인**: 메인 화면 상단에서 자동 표시
3. **🆕 사용자 로그인**:
   - 우상단 "로그인" 버튼 클릭
   - 사용자명 입력 (이메일 선택사항)
   - 로그인 후 예측저장 기능 이용 가능
4. **AI 챗봇 이용**: 
   - 채팅창에 질문 입력 (예: "지난 10회차 패턴 분석해줘")
   - Enter 키 또는 전송 버튼으로 메시지 전송
5. **통계 분석**:
   - 8가지 분석 버튼 중 원하는 기능 선택
   - 결과는 차트와 요약 텍스트로 표시
6. **AI 예측**:
   - 10가지 알고리즘 중 선택하여 예측 실행
   - 신뢰도와 설명이 포함된 결과 제공
   - 🆕 **로그인 후 "저장" 버튼**으로 예측 결과 저장 가능
7. **🆕 예측저장 관리**:
   - 네비게이션의 "예측저장" 메뉴 클릭
   - 저장된 예측 조회, 메모 수정, 즐겨찾기 설정
   - "개인화 추천받기" 버튼으로 맞춤형 번호 생성
8. **명당 정보**: 전국 고액 당첨 판매점 정보 확인

### 주요 기능별 사용 팁

- **챗봇**: "빈도", "명당", "예측", "최신" 등의 키워드 사용
- **통계 분석**: 각 분석 결과를 조합하여 종합적으로 판단
- **AI 예측**: 여러 알고리즘 결과를 비교하여 참고
- **🆕 예측저장**: 
  - 의미있는 메모와 태그로 예측 분류 관리
  - 가상회차 번호로 체계적인 기록 유지
  - 즐겨찾기로 중요한 예측 표시
- **🆕 개인화 추천**: 
  - 최소 3개 이상의 예측을 저장한 후 이용 권장
  - 다양한 알고리즘으로 예측하여 패턴 다양화
  - 메모에 선택 이유를 기록하면 더 정확한 추천
- **명당 정보**: 거주 지역 근처의 당첨 실적이 높은 판매점 확인

## 배포 상태

- **플랫폼**: Cloudflare Pages
- **상태**: ✅ 개발 서버 활성화 + GitHub 리포지토리 완성
- **마지막 업데이트**: 2025-09-17 (확률 분석 수정, 8개 통계 API 완성)
- **데이터**: 599회분 로또 데이터 (2002-2025년)

### 🆕 최근 업데이트 (2025-09-17)

#### ✅ 완료된 수정사항
1. **확률 분석 오류 수정**
   - SQLite "too many terms in compound SELECT" 오류 해결
   - 복잡한 UNION 쿼리를 단순한 반복문 방식으로 변경
   - 빈도 분석과 동일한 패턴 적용

2. **8개 통계 API 완성**
   - `/api/statistics/frequency` - 빈도 분석 ✅
   - `/api/statistics/hot-cold` - 핫/콜드 번호 분석 ✅
   - `/api/statistics/pattern` - 패턴 분석 ✅
   - `/api/statistics/correlation` - 상관관계 분석 ✅
   - `/api/statistics/trend` - 트렌드 분석 ✅
   - `/api/statistics/distribution` - 분포 분석 ✅
   - `/api/statistics/sequence` - 연속 분석 ✅
   - `/api/statistics/probability` - 확률 분석 ✅ (수정됨)

3. **GitHub 리포지토리 완성**
   - 전체 코드베이스 GitHub 업로드 완료
   - 상세한 커밋 메시지와 기능 설명 포함
   - 모든 기능 테스트 완료 및 검증

## 개발 환경 설정

### 로컬 개발

```bash
# 프로젝트 클론
git clone <repository-url>
cd webapp

# 의존성 설치
npm install

# 로컬 데이터베이스 설정
mkdir -p .wrangler/state/v3/d1/miniflare-D1DatabaseObject
sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/lotto645ai-production.sqlite < migrations/0001_initial_schema.sql
sqlite3 .wrangler/state/v3/d1/miniflare-D1DatabaseObject/lotto645ai-production.sqlite < seed.sql

# 빌드 및 실행
npm run build
npm run dev:d1
```

### 프로덕션 배포 (Cloudflare)

```bash
# Cloudflare API 토큰 설정 필요
npm run build
npm run deploy:prod
```

## 프로젝트 구조

```
webapp/
├── src/
│   ├── index.tsx           # 메인 애플리케이션
│   └── types.ts           # TypeScript 타입 정의
├── migrations/
│   ├── 0001_initial_schema.sql     # 기본 데이터베이스 스키마
│   └── 0002_prediction_save_schema.sql  # 🆕 예측저장 스키마
├── public/static/         # 정적 파일 (CSS, JS)
├── .wrangler/            # Wrangler 로컬 개발 파일
├── dist/                 # 빌드 출력 디렉토리
├── lotto_data.csv        # 로또 데이터 CSV
├── seed.sql              # 초기 데이터
├── package.json          # 의존성 및 스크립트
├── wrangler.jsonc        # Cloudflare 설정
├── ecosystem.config.cjs  # PM2 설정
└── README.md            # 이 파일
```

## 라이센스 및 면책사항

⚠️ **중요 안내사항**

본 애플리케이션은 **교육 및 연구 목적**으로 제작되었습니다.

- 로또는 **순전히 확률에 의한 게임**입니다
- AI 예측과 통계 분석은 **참고용**으로만 사용하세요
- 어떤 알고리즘도 당첨을 **보장할 수 없습니다**
- **적정선에서 건전하게** 로또를 즐기시기 바랍니다
- 과도한 도박은 개인과 가정에 해로울 수 있습니다

## 연락처

프로젝트 관련 문의나 개선 제안은 GitHub Issues를 통해 남겨주세요.

---

**Made with ❤️ using Hono, Cloudflare Workers, and AI**