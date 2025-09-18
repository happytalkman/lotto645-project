-- 동양철학 기반 운세 예측 저장 테이블 생성
-- 꿈해몽, 명당분석, 사주, 종합운세 등의 예측 결과를 저장

-- 운세 예측 결과 테이블
CREATE TABLE IF NOT EXISTS fortune_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method TEXT NOT NULL, -- 예측 방법: '꿈해몽 예측', '명당위치 추천', '사주 운세', '종합 운세'
    input_data TEXT NOT NULL, -- 사용자 입력 데이터 (꿈 내용, 지역명, 생년월일, 이름+고민 등)
    numbers TEXT NOT NULL, -- 추천 번호 (JSON 배열 형태)
    explanation TEXT NOT NULL, -- 상세 해석 내용
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 성능 최적화를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_fortune_predictions_method ON fortune_predictions(method);
CREATE INDEX IF NOT EXISTS idx_fortune_predictions_created_at ON fortune_predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fortune_predictions_method_created ON fortune_predictions(method, created_at DESC);

-- 명당분석 관련 데이터 테이블
CREATE TABLE IF NOT EXISTS geomancy_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_name TEXT NOT NULL UNIQUE, -- 지역명
    description TEXT NOT NULL, -- 명당 설명
    recommendation_level INTEGER DEFAULT 3, -- 추천 레벨 (1-5)
    feng_shui_type TEXT, -- 풍수 유형 (배산임수, 장풍득수 등)
    lucky_directions TEXT, -- 길한 방위 (JSON 배열)
    elements TEXT, -- 해당 지역의 오행 속성 (JSON 배열)
    historical_significance TEXT, -- 역사적 의미
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 명당 데이터 삽입
INSERT OR IGNORE INTO geomancy_locations (
    region_name, description, recommendation_level, feng_shui_type, 
    lucky_directions, elements, historical_significance
) VALUES 
(
    '서울 강남구',
    '한강 남쪽의 명당, 번영과 발전의 기운이 강한 지역으로 현대적 발전과 전통이 조화를 이루는 곳',
    5,
    '배산임수',
    '["남방", "동방", "중앙"]',
    '["금", "수"]',
    '조선시대부터 양반가들이 거주했던 명당 터'
),
(
    '부산 해운대구', 
    '바다와 산이 어우러진 천혜의 명당, 재물운과 인간관계운이 매우 강함',
    4,
    '장풍득수',
    '["남방", "서방"]',
    '["수", "목"]',
    '신라시대부터 해상교통의 요충지로 번영'
),
(
    '제주 한라산',
    '신령스러운 기운이 깃든 영산, 정신적 각성과 지혜 증진에 최적의 명당',
    5,
    '영산명당',
    '["동방", "남방", "서방", "북방", "중앙"]',
    '["화", "토", "목"]',
    '고대부터 신선이 거주한다는 전설의 영산'
),
(
    '경주 불국사',
    '천년 고도의 불교 성지, 마음의 평화와 정신력 강화에 뛰어난 명당',
    4,
    '사찰명당',
    '["동방", "남방"]',
    '["목", "화"]',
    '신라 불교문화의 중심지, 천년 세월의 기원 터'
),
(
    '안동 하회마을',
    '전통 풍수의 완벽한 배산임수 지형, 가문의 번영과 학문 성취에 탁월',
    5,
    '배산임수',
    '["남방", "동방"]',
    '["수", "목", "토"]',
    '조선 유학의 본향, 대대로 명문가들이 거주'
),
(
    '전주 한옥마을',
    '조선 왕조의 발상지, 문화예술과 학문의 기운이 매우 강한 명당',
    4,
    '왕기명당',
    '["남방", "중앙"]',
    '["화", "토"]',
    '조선 왕조 창업의 터전, 문화예술의 중심지'
);

-- 오행별 특성 테이블
CREATE TABLE IF NOT EXISTS five_elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    element_name TEXT NOT NULL UNIQUE, -- 오행명 (목, 화, 토, 금, 수)
    korean_name TEXT NOT NULL,
    symbol TEXT NOT NULL, -- 상징 이모지
    characteristics TEXT NOT NULL, -- 특성 설명
    compatible_elements TEXT, -- 상생 관계 (JSON 배열)
    conflicting_elements TEXT, -- 상극 관계 (JSON 배열)
    associated_numbers TEXT, -- 관련 숫자들 (JSON 배열)
    season TEXT, -- 계절
    direction TEXT, -- 방위
    color TEXT, -- 대표 색상
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 오행 기본 데이터 삽입
INSERT OR IGNORE INTO five_elements (
    element_name, korean_name, symbol, characteristics,
    compatible_elements, conflicting_elements, associated_numbers,
    season, direction, color
) VALUES 
(
    'wood', '목(木)', '🌳',
    '성장과 발전의 원소. 생명력이 강하고 창조적 에너지를 상징',
    '["fire"]', '["metal"]', '[3, 8, 13, 18, 23, 28, 33, 38, 43]',
    '봄', '동방', '청록색'
),
(
    'fire', '화(火)', '🔥', 
    '열정과 에너지의 원소. 의지력과 추진력을 상징',
    '["earth"]', '["water"]', '[2, 7, 12, 17, 22, 27, 32, 37, 42]',
    '여름', '남방', '적색'
),
(
    'earth', '토(土)', '🏔️',
    '안정과 포용의 원소. 신뢰와 중심을 상징',
    '["metal"]', '["wood"]', '[5, 10, 15, 20, 25, 30, 35, 40, 45]',
    '늦여름', '중앙', '황색'
),
(
    'metal', '금(金)', '⚡',
    '정의와 결단의 원소. 판단력과 의지를 상징',
    '["water"]', '["fire"]', '[4, 9, 14, 19, 24, 29, 34, 39, 44]',
    '가을', '서방', '백색'
),
(
    'water', '수(水)', '🌊',
    '지혜와 유연성의 원소. 적응력과 포용력을 상징',
    '["wood"]', '["earth"]', '[1, 6, 11, 16, 21, 26, 31, 36, 41]',
    '겨울', '북방', '흑색'
);

-- 방위별 풍수 정보 테이블
CREATE TABLE IF NOT EXISTS directions_fengshui (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    direction_name TEXT NOT NULL UNIQUE, -- 방위명
    korean_name TEXT NOT NULL,
    guardian_symbol TEXT NOT NULL, -- 수호신 (청룡, 백호, 주작, 현무)
    symbol TEXT NOT NULL, -- 방위 상징 이모지
    characteristics TEXT NOT NULL, -- 특성
    fortune_level TEXT NOT NULL, -- 길흉 등급
    associated_elements TEXT, -- 관련 오행 (JSON 배열)
    lucky_numbers TEXT, -- 길한 숫자들 (JSON 배열)
    unlucky_numbers TEXT, -- 흉한 숫자들 (JSON 배열)
    best_activities TEXT, -- 권장 활동 (JSON 배열)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 방위별 풍수 데이터 삽입
INSERT OR IGNORE INTO directions_fengshui (
    direction_name, korean_name, guardian_symbol, symbol, characteristics,
    fortune_level, associated_elements, lucky_numbers, unlucky_numbers, best_activities
) VALUES 
(
    'east', '동방(東方)', '청룡(靑龍)', '🌅',
    '새로운 시작과 희망의 방향. 생명력과 성장의 기운이 강함',
    '대길(大吉)', '["wood"]', '[3, 8, 13, 18, 23, 28]', '[4, 9, 14]',
    '["새로운 사업 시작", "학업", "건강 증진", "창조적 활동"]'
),
(
    'west', '서방(西方)', '백호(白虎)', '🌅', 
    '수확과 성취의 방향. 안정과 보호의 기운이 강함',
    '중길(中吉)', '["metal"]', '[4, 9, 14, 19, 24, 29]', '[3, 8, 13]',
    '["재정 관리", "계약", "수확", "안정 추구"]'
),
(
    'south', '남방(南方)', '주작(朱雀)', '☀️',
    '번영과 명예의 방향. 열정과 성공의 기운이 강함',
    '대길(大吉)', '["fire"]', '[2, 7, 12, 17, 22, 27]', '[1, 6, 11]',
    '["사업 확장", "명예 추구", "리더십 발휘", "공적 활동"]'
),
(
    'north', '북방(北方)', '현무(玄武)', '❄️',
    '지혜와 깊이의 방향. 학문과 사색의 기운이 강함',
    '소길(小吉)', '["water"]', '[1, 6, 11, 16, 21, 26]', '[2, 7, 12]',
    '["학문 연구", "명상", "내적 성장", "장기 계획"]'
),
(
    'center', '중앙(中央)', '황룡(黃龍)', '⚡',
    '균형과 조화의 중심. 통합과 안정의 기운이 강함',
    '대길(大吉)', '["earth"]', '[5, 10, 15, 20, 25, 30]', '[]',
    '["중재", "조화", "통합", "균형 유지"]'
);

-- 꿈해몽 키워드 테이블
CREATE TABLE IF NOT EXISTS dream_keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT NOT NULL UNIQUE, -- 꿈 키워드
    category TEXT NOT NULL, -- 카테고리 (동물, 자연, 사물 등)
    meaning TEXT NOT NULL, -- 꿈의 의미
    lucky_numbers TEXT, -- 연관 길수 (JSON 배열)
    fortune_impact TEXT, -- 운세 영향도 (길몽/흉몽/중성)
    detailed_explanation TEXT, -- 상세 해석
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 꿈해몽 기본 키워드 데이터 삽입
INSERT OR IGNORE INTO dream_keywords (
    keyword, category, meaning, lucky_numbers, fortune_impact, detailed_explanation
) VALUES 
('용', '신성동물', '권력과 성공의 상징', '[1, 9, 17, 25, 33, 41]', '대길몽', '용꿈은 최고의 길몽으로 출세와 성공을 의미합니다.'),
('물', '자연', '재물과 지혜의 상징', '[6, 11, 16, 21, 26, 31]', '길몽', '맑은 물은 재물운 상승을, 흐른 물은 변화를 의미합니다.'),
('불', '자연', '열정과 에너지의 상징', '[2, 7, 12, 17, 22, 27]', '길몽', '타오르는 불꿈은 성공과 발전의 기운을 나타냅니다.'),
('산', '자연', '안정과 성취의 상징', '[5, 10, 15, 20, 25, 30]', '길몽', '높은 산은 목표 달성을, 산 오르기는 노력의 결실을 의미합니다.'),
('돼지', '동물', '재물운의 상징', '[8, 18, 28, 38]', '길몽', '돼지꿈은 전통적으로 재물운과 풍요를 상징하는 대표적 길몽입니다.'),
('뱀', '동물', '변화와 재생의 상징', '[3, 13, 23, 33, 43]', '길몽', '뱀꿈은 재물운과 지혜 증진을 의미하는 길한 꿈입니다.'),
('집', '건축물', '안정과 기반의 상징', '[4, 14, 24, 34, 44]', '길몽', '새집이나 큰 집 꿈은 가정의 안정과 재산 증가를 의미합니다.'),
('나무', '식물', '성장과 발전의 상징', '[3, 8, 13, 18, 23]', '길몽', '푸른 나무나 열매 맺는 나무는 성장과 성과를 상징합니다.');

-- 사주 간지 정보 테이블 (간단한 버전)
CREATE TABLE IF NOT EXISTS saju_elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gan_name TEXT NOT NULL, -- 천간 (갑, 을, 병, 정, 무, 기, 경, 신, 임, 계)
    ji_name TEXT NOT NULL, -- 지지 (자, 축, 인, 묘, 진, 사, 오, 미, 신, 유, 술, 해)
    element TEXT NOT NULL, -- 오행 속성
    yin_yang TEXT NOT NULL, -- 음양 (음/양)
    lucky_numbers TEXT, -- 관련 길수 (JSON 배열)
    personality TEXT, -- 성격 특성
    fortune_tendency TEXT, -- 운세 경향
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 업데이트 트리거 추가
CREATE TRIGGER IF NOT EXISTS update_fortune_predictions_timestamp 
    AFTER UPDATE ON fortune_predictions
    FOR EACH ROW
BEGIN
    UPDATE fortune_predictions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;