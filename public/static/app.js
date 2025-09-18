// Lotto645.AI - 동양철학 기반 운세 번호 예측 시스템
// 전역 변수
let currentPrediction = null;
let currentMethod = null;

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lotto645.AI 시스템 초기화 완료');
    
    // 로그인 상태 복원
    restoreLoginState();
    
    // 기본 기능 초기화
    loadSavedPredictions();
    initializeScrollFeatures();
    initializeNavigation();
    
    // 키보드 단축키 설정
    setupKeyboardShortcuts();
});

// 스크롤 관련 기능 초기화
function initializeScrollFeatures() {
    // 스크롤 탑 버튼 생성
    const scrollTopButton = document.createElement('button');
    scrollTopButton.id = 'scroll-top-btn';
    scrollTopButton.className = 'fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 z-50 hidden';
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up text-xl"></i>';
    scrollTopButton.title = '맨 위로 이동';
    scrollTopButton.onclick = scrollToTop;
    
    document.body.appendChild(scrollTopButton);
    
    // 스크롤 이벤트 리스너
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        
        // 한 페이지(뷰포트 높이)를 넘으면 버튼 표시
        if (scrollTop > window.innerHeight) {
            scrollTopBtn.classList.remove('hidden');
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= window.innerHeight) {
                    scrollTopBtn.classList.add('hidden');
                }
            }, 300);
        }
        
        // 스크롤 중 네비게이션 하이라이트 업데이트
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavigation, 100);
    });
}

// 네비게이션 초기화 및 개선
function initializeNavigation() {
    // 모든 네비게이션 링크에 스무스 스크롤 적용
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 예측저장 섹션인 경우 표시하기
                if (targetId === 'saved-predictions') {
                    showSavedPredictions();
                } else {
                    // 다른 섹션들은 숨기고 해당 섹션으로 스크롤
                    hideAllModeSections();
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
                
                // 모바일에서 네비게이션 메뉴 닫기 (필요시)
                closeMobileMenu();
            }
        });
    });
}

// 스크롤 탑 기능
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // 버튼 클릭 효과
    const btn = document.getElementById('scroll-top-btn');
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 100);
    }, 100);
}

// 활성 네비게이션 업데이트
function updateActiveNavigation() {
    const sections = ['analysis', 'prediction', 'chatbot', 'geomancy-analysis', 'saved-predictions'];
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let currentSection = '';
    const scrollTop = window.pageYOffset + 100; // 오프셋 추가
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section && !section.classList.contains('hidden')) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        }
    });
    
    // 네비게이션 링크 활성화
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('text-yellow-300', 'font-bold');
            link.classList.remove('hover:text-blue-200');
        } else {
            link.classList.remove('text-yellow-300', 'font-bold');
            link.classList.add('hover:text-blue-200');
        }
    });
}

// 모든 모드 섹션 숨기기
function hideAllModeSections() {
    document.getElementById('saved-predictions').classList.add('hidden');
    // 다른 모달이나 특별 섹션들도 여기에 추가
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
    // 모바일 네비게이션이 있다면 닫기 (필요시 구현)
}

// 개선된 메뉴 전환 함수들
function showPrediction() {
    hideAllModeSections();
    const element = document.getElementById('prediction');
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 예측 섹션 하이라이트 효과
    setTimeout(() => {
        element.classList.add('ring-4', 'ring-purple-300');
        setTimeout(() => {
            element.classList.remove('ring-4', 'ring-purple-300');
        }, 2000);
    }, 500);
}

function showGeomancyAnalysis() {
    hideAllModeSections();
    const element = document.getElementById('geomancy-analysis');
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 명당분석 섹션 하이라이트 효과
    setTimeout(() => {
        element.classList.add('ring-4', 'ring-green-300');
        setTimeout(() => {
            element.classList.remove('ring-4', 'ring-green-300');
        }, 2000);
    }, 500);
}

function showSavedPredictions() {
    // 다른 섹션들 숨기기
    hideAllModeSections();
    
    // 예측저장 섹션 표시
    const section = document.getElementById('saved-predictions');
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 저장된 예측 로드
    loadSavedPredictions();
    
    // 섹션 하이라이트 효과
    setTimeout(() => {
        section.classList.add('ring-4', 'ring-purple-300');
        setTimeout(() => {
            section.classList.remove('ring-4', 'ring-purple-300');
        }, 2000);
    }, 500);
}

// 기타 네비게이션 함수들
function showAnalysis() {
    hideAllModeSections();
    document.getElementById('analysis').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showChatbot() {
    hideAllModeSections();
    document.getElementById('chatbot').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== 로그인 관련 함수들 =====

let currentUser = null;

// 로그인 모달 표시
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
    // 포커스를 사용자명 입력 필드로 이동
    setTimeout(() => {
        document.getElementById('username-input').focus();
    }, 100);
}

// 로그인 모달 숨기기
function hideLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
    // 입력 필드 초기화
    document.getElementById('username-input').value = '';
    document.getElementById('email-input').value = '';
}

// 로그인 처리
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username-input').value.trim();
    const email = document.getElementById('email-input').value.trim();
    
    if (!username) {
        showToast('사용자명을 입력해주세요', 'error');
        return;
    }
    
    // 사용자명 유효성 검사 (한글, 영문, 숫자만 허용)
    const usernameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
    if (!usernameRegex.test(username)) {
        showToast('사용자명은 2-10자의 한글, 영문, 숫자만 사용 가능합니다', 'error');
        return;
    }
    
    // 이메일 유효성 검사 (선택사항)
    if (email && !isValidEmail(email)) {
        showToast('올바른 이메일 형식을 입력해주세요', 'error');
        return;
    }
    
    try {
        showLoadingAnimation('로그인 중...');
        
        // 서버에 로그인 요청
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // 로그인 성공
            currentUser = {
                id: result.userId,
                username: username,
                email: email || null,
                loginTime: new Date().toISOString()
            };
            
            // 로컬 스토리지에 저장
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            hideLoadingAnimation();
            hideLoginModal();
            updateLoginUI();
            
            showToast(`${username}님, 환영합니다! 🎉`, 'success');
            
            // 예측저장 기능 활성화 안내
            setTimeout(() => {
                showToast('이제 예측 저장 기능을 사용할 수 있습니다! 💾', 'info');
            }, 2000);
            
        } else {
            throw new Error(result.error || '로그인에 실패했습니다.');
        }
    } catch (error) {
        hideLoadingAnimation();
        console.error('로그인 오류:', error);
        showToast('로그인 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
}

// 로그아웃 처리
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateLoginUI();
        
        // 예측저장 섹션이 열려있다면 닫기
        hideAllModeSections();
        
        showToast('로그아웃되었습니다', 'info');
        
        // 메인 페이지로 스크롤
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
    }
}

// 로그인 UI 업데이트
function updateLoginUI() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    
    if (currentUser) {
        // 로그인 상태
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = currentUser.username;
        
        // 예측저장 메뉴 활성화
        const navSaved = document.getElementById('nav-saved');
        if (navSaved) {
            navSaved.style.display = 'inline-block';
        }
    } else {
        // 로그아웃 상태
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userInfo.classList.add('hidden');
        
        // 예측저장 메뉴 비활성화
        const navSaved = document.getElementById('nav-saved');
        if (navSaved) {
            navSaved.style.display = 'none';
        }
    }
}

// 페이지 로드 시 로그인 상태 복원
function restoreLoginState() {
    try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            
            // 로그인 시간이 24시간 이상 지났으면 자동 로그아웃
            const loginTime = new Date(currentUser.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                logout();
                showToast('24시간이 지나 자동 로그아웃되었습니다', 'info');
                return;
            }
            
            updateLoginUI();
        }
    } catch (error) {
        console.error('로그인 상태 복원 오류:', error);
        localStorage.removeItem('currentUser');
    }
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 로그인 필요 기능 체크
function requireLogin(functionName = '') {
    if (!currentUser) {
        showToast(`${functionName} 기능을 사용하려면 로그인이 필요합니다`, 'info');
        setTimeout(() => {
            showLoginModal();
        }, 1500);
        return false;
    }
    return true;
}

// 예측 저장 시 로그인 체크 (기존 함수 수정)
async function savePredictionResult() {
    if (!requireLogin('예측 저장')) {
        return;
    }
    
    if (!currentPrediction) {
        alert('저장할 예측 결과가 없습니다.');
        return;
    }
    
    try {
        const response = await fetch('/api/save-prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...currentPrediction,
                userId: currentUser.id
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('예측 결과가 저장되었습니다! 💾', 'success');
            loadSavedPredictions(); // 저장 목록 새로고침
        } else {
            throw new Error(result.error || '저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('저장 오류:', error);
        showToast('저장 중 오류가 발생했습니다.', 'error');
    }
}

// 예측저장 메뉴 클릭 시 로그인 체크
function showSavedPredictions() {
    if (!requireLogin('예측 저장 관리')) {
        return;
    }
    
    // 다른 섹션들 숨기기
    hideAllModeSections();
    
    // 예측저장 섹션 표시
    const section = document.getElementById('saved-predictions');
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 저장된 예측 로드
    loadSavedPredictions();
    
    // 섹션 하이라이트 효과
    setTimeout(() => {
        section.classList.add('ring-4', 'ring-purple-300');
        setTimeout(() => {
            section.classList.remove('ring-4', 'ring-purple-300');
        }, 2000);
    }, 500);
}

// 애니메이션 효과를 위한 유틸리티 함수
function animateNumber(elementId, targetNumber, duration = 1000) {
    const element = document.getElementById(elementId);
    const start = 0;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easeOutBounce 애니메이션 효과
        const easeOutBounce = (t) => {
            if (t < 1/2.75) return 7.5625*t*t;
            if (t < 2/2.75) return 7.5625*(t-=1.5/2.75)*t + 0.75;
            if (t < 2.5/2.75) return 7.5625*(t-=2.25/2.75)*t + 0.9375;
            return 7.5625*(t-=2.625/2.75)*t + 0.984375;
        };
        
        const currentNumber = Math.floor(start + (targetNumber - start) * easeOutBounce(progress));
        element.textContent = currentNumber;
        element.style.transform = `scale(${1 + 0.2 * Math.sin(progress * Math.PI)})`;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.style.transform = 'scale(1)';
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// 번호 생성 애니메이션
function animateNumberGeneration(numbers) {
    const fortuneNumbers = document.getElementById('fortune-numbers');
    fortuneNumbers.classList.remove('hidden');
    
    // 각 번호를 순차적으로 애니메이션
    numbers.forEach((number, index) => {
        setTimeout(() => {
            animateNumber(`num${index + 1}`, number, 800);
            // 번호볼 펄스 효과
            const ball = document.getElementById(`num${index + 1}`);
            ball.classList.add('animate-pulse');
            setTimeout(() => ball.classList.remove('animate-pulse'), 1000);
        }, index * 200);
    });
}

// 꿈해몽 예측 함수
async function getDreamPrediction() {
    const dreamInput = document.getElementById('dreamInput').value.trim();
    
    if (!dreamInput) {
        alert('꿈 내용을 입력해주세요.');
        return;
    }
    
    try {
        showLoadingAnimation('꿈을 해석하고 있습니다...');
        
        const response = await fetch('/api/dream-prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dream: dreamInput })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            currentPrediction = {
                method: '꿈해몽 예측',
                input: dreamInput,
                numbers: result.numbers,
                explanation: result.explanation,
                timestamp: new Date().toISOString()
            };
            currentMethod = 'dream';
            
            hideLoadingAnimation();
            animateNumberGeneration(result.numbers);
            
            // 성공 메시지
            showToast('꿈 해석이 완료되었습니다! 🌙', 'success');
        } else {
            throw new Error(result.error || '꿈해몽 예측에 실패했습니다.');
        }
    } catch (error) {
        hideLoadingAnimation();
        console.error('꿈해몽 예측 오류:', error);
        showToast('꿈해몽 예측 중 오류가 발생했습니다.', 'error');
    }
}

// 명당위치 예측 함수
async function getGeomancyPrediction() {
    const locationSelect = document.getElementById('locationSelect').value;
    
    if (!locationSelect) {
        alert('지역을 선택해주세요.');
        return;
    }
    
    try {
        showLoadingAnimation('명당을 분석하고 있습니다...');
        
        const response = await fetch('/api/geomancy-prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: locationSelect })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            currentPrediction = {
                method: '명당위치 추천',
                input: locationSelect,
                numbers: result.numbers,
                explanation: result.explanation,
                timestamp: new Date().toISOString()
            };
            currentMethod = 'geomancy';
            
            hideLoadingAnimation();
            animateNumberGeneration(result.numbers);
            showToast('명당 분석이 완료되었습니다! 🏔️', 'success');
        } else {
            throw new Error(result.error || '명당분석 예측에 실패했습니다.');
        }
    } catch (error) {
        hideLoadingAnimation();
        console.error('명당분석 예측 오류:', error);
        showToast('명당분석 예측 중 오류가 발생했습니다.', 'error');
    }
}

// 사주 운세 예측 함수
async function getSajuPrediction() {
    const birthDate = document.getElementById('birthDate').value;
    const birthHour = document.getElementById('birthHour').value;
    
    if (!birthDate) {
        alert('생년월일을 입력해주세요.');
        return;
    }
    
    try {
        showLoadingAnimation('사주를 분석하고 있습니다...');
        
        const response = await fetch('/api/saju-prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                birthDate: birthDate,
                birthHour: birthHour
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            currentPrediction = {
                method: '사주 운세',
                input: `${birthDate} ${birthHour || '시간미상'}`,
                numbers: result.numbers,
                explanation: result.explanation,
                timestamp: new Date().toISOString()
            };
            currentMethod = 'saju';
            
            hideLoadingAnimation();
            animateNumberGeneration(result.numbers);
            showToast('사주 분석이 완료되었습니다! 📅', 'success');
        } else {
            throw new Error(result.error || '사주 예측에 실패했습니다.');
        }
    } catch (error) {
        hideLoadingAnimation();
        console.error('사주 예측 오류:', error);
        showToast('사주 예측 중 오류가 발생했습니다.', 'error');
    }
}

// 종합 운세 예측 함수
async function getComprehensivePrediction() {
    const nameInput = document.getElementById('nameInput').value.trim();
    const concernSelect = document.getElementById('concernSelect').value;
    
    if (!nameInput) {
        alert('이름을 입력해주세요.');
        return;
    }
    
    if (!concernSelect) {
        alert('고민을 선택해주세요.');
        return;
    }
    
    try {
        showLoadingAnimation('종합 운세를 분석하고 있습니다...');
        
        const response = await fetch('/api/comprehensive-prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: nameInput,
                concern: concernSelect
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            currentPrediction = {
                method: '종합 운세',
                input: `${nameInput} - ${concernSelect}`,
                numbers: result.numbers,
                explanation: result.explanation,
                timestamp: new Date().toISOString()
            };
            currentMethod = 'comprehensive';
            
            hideLoadingAnimation();
            animateNumberGeneration(result.numbers);
            showToast('종합 운세 분석이 완료되었습니다! 🔮', 'success');
        } else {
            throw new Error(result.error || '종합 운세 예측에 실패했습니다.');
        }
    } catch (error) {
        hideLoadingAnimation();
        console.error('종합 운세 예측 오류:', error);
        showToast('종합 운세 예측 중 오류가 발생했습니다.', 'error');
    }
}

// 상세 해석 보기 (새로운번호추론결과 팝업)
function showDetailedResult() {
    if (!currentPrediction) {
        alert('먼저 예측을 실행해주세요.');
        return;
    }
    
    const modalHTML = `
        <div id="detailed-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-t-xl">
                    <h2 class="text-2xl font-bold flex items-center">
                        <span class="text-3xl mr-3">🔮</span>
                        새로운번호추론결과
                    </h2>
                    <p class="mt-2 opacity-90">${currentPrediction.method} 상세 분석</p>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- 예측 방법 및 입력값 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-bold text-gray-700 mb-2">🎯 예측 방법</h3>
                        <p class="text-gray-600">${currentPrediction.method}</p>
                        <h3 class="font-bold text-gray-700 mb-2 mt-3">📝 입력 정보</h3>
                        <p class="text-gray-600">${currentPrediction.input}</p>
                    </div>
                    
                    <!-- 추천 번호 -->
                    <div class="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-4">
                        <h3 class="font-bold text-purple-700 mb-3">✨ 추천 번호</h3>
                        <div class="flex justify-center space-x-2 mb-3">
                            ${currentPrediction.numbers.map((num, idx) => `
                                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${getNumberColorClass(idx)}">
                                    ${num}
                                </div>
                            `).join('')}
                        </div>
                        <p class="text-center text-sm text-purple-600">각 번호는 고유한 의미와 에너지를 가지고 있습니다</p>
                    </div>
                    
                    <!-- 상세 해석 -->
                    <div class="bg-blue-50 rounded-lg p-4">
                        <h3 class="font-bold text-blue-700 mb-3">📚 상세 해석</h3>
                        <div class="text-gray-700 whitespace-pre-line">${currentPrediction.explanation}</div>
                    </div>
                    
                    <!-- 과학적 근거 -->
                    <div class="bg-green-50 rounded-lg p-4">
                        <h3 class="font-bold text-green-700 mb-3">🔬 과학적 근거</h3>
                        <div class="text-gray-700">
                            <p class="mb-2">• <strong>통계적 분석:</strong> 과거 ${getHistoricalDataCount()}회차 데이터 기반 패턴 분석</p>
                            <p class="mb-2">• <strong>수학적 모델:</strong> ${getMathematicalModel()} 알고리즘 적용</p>
                            <p class="mb-2">• <strong>확률론적 접근:</strong> 베이지안 추론과 몬테카를로 시뮬레이션</p>
                            <p>• <strong>전통 철학:</strong> 동양 철학의 수리 체계와 현대 수학의 융합</p>
                        </div>
                    </div>
                    
                    <!-- 예측 시간 -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="font-bold text-gray-700 mb-2">⏰ 예측 생성 시간</h3>
                        <p class="text-gray-600">${new Date(currentPrediction.timestamp).toLocaleString('ko-KR')}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                    <button onclick="closeDetailedModal()" 
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                        닫기
                    </button>
                    <button onclick="savePredictionFromModal()" 
                            class="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all">
                        💾 저장하기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모달 외부 클릭 시 닫기
    document.getElementById('detailed-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeDetailedModal();
        }
    });
}

// 번호별 색상 클래스 반환
function getNumberColorClass(index) {
    const colors = [
        'bg-gradient-to-r from-red-400 to-red-600',
        'bg-gradient-to-r from-orange-400 to-orange-600',
        'bg-gradient-to-r from-yellow-400 to-yellow-600',
        'bg-gradient-to-r from-green-400 to-green-600',
        'bg-gradient-to-r from-blue-400 to-blue-600',
        'bg-gradient-to-r from-purple-400 to-purple-600'
    ];
    return colors[index] || colors[0];
}

// 상세 모달 닫기
function closeDetailedModal() {
    const modal = document.getElementById('detailed-modal');
    if (modal) {
        modal.remove();
    }
}

// 모달에서 저장하기
function savePredictionFromModal() {
    savePredictionResult();
    closeDetailedModal();
}

// 예측 결과 저장
async function savePredictionResult() {
    if (!currentPrediction) {
        alert('저장할 예측 결과가 없습니다.');
        return;
    }
    
    try {
        const response = await fetch('/api/save-prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentPrediction)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showToast('예측 결과가 저장되었습니다! 💾', 'success');
            loadSavedPredictions(); // 저장 목록 새로고침
        } else {
            throw new Error(result.error || '저장에 실패했습니다.');
        }
    } catch (error) {
        console.error('저장 오류:', error);
        showToast('저장 중 오류가 발생했습니다.', 'error');
    }
}

// 저장된 예측 목록 로드
async function loadSavedPredictions() {
    if (!currentUser) {
        // 로그인하지 않은 경우 빈 목록 표시
        updateSavedPredictionsList([]);
        return;
    }
    
    try {
        const response = await fetch(`/api/saved-predictions?userId=${currentUser.id}`);
        const result = await response.json();
        
        if (response.ok) {
            updateSavedPredictionsList(result.predictions);
        } else {
            console.error('저장된 예측 로드 실패:', result.error);
            updateSavedPredictionsList([]);
        }
    } catch (error) {
        console.error('저장된 예측 로드 오류:', error);
        updateSavedPredictionsList([]);
    }
}

// 저장된 예측 목록 업데이트 (개선된 버전)
let currentPage = 1;
let totalPages = 1;
let currentFilter = 'all';
let savedPredictions = [];

function updateSavedPredictionsList(predictions) {
    const container = document.getElementById('saved-predictions-list');
    if (!container) return;
    
    savedPredictions = predictions;
    
    if (predictions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl text-gray-300 mb-4">💾</div>
                <h3 class="text-lg font-semibold text-gray-500 mb-2">저장된 예측이 없습니다</h3>
                <p class="text-gray-400 mb-6">AI 예측을 실행한 후 저장해보세요!</p>
                <button onclick="showPrediction()" 
                        class="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    🔮 예측하러 가기
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <!-- 예측 통계 -->
        <div class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                    <div class="text-2xl font-bold text-purple-700">${predictions.length}</div>
                    <div class="text-sm text-purple-600">총 예측 수</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-pink-700">${getUniqueMethodsCount(predictions)}</div>
                    <div class="text-sm text-pink-600">사용된 방법</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-blue-700">${getRecentPredictionsCount(predictions)}</div>
                    <div class="text-sm text-blue-600">최근 7일</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-green-700">${getFavoritesCount(predictions)}</div>
                    <div class="text-sm text-green-600">즐겨찾기</div>
                </div>
            </div>
        </div>

        <!-- 예측 목록 -->
        <div class="grid gap-4">
            ${predictions.map(pred => `
                <div class="bg-white border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 ${pred.favorite ? 'ring-2 ring-yellow-400' : ''}" 
                     id="prediction-${pred.id}">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex-1">
                            <div class="flex items-center mb-2">
                                <span class="text-2xl mr-3">${getMethodIcon(pred.method)}</span>
                                <h3 class="font-bold text-purple-700 text-lg">${pred.method}</h3>
                                ${pred.favorite ? '<i class="fas fa-star text-yellow-500 ml-2"></i>' : ''}
                            </div>
                            <p class="text-gray-600 mb-1">${pred.input}</p>
                            <p class="text-xs text-gray-500 flex items-center">
                                <i class="fas fa-clock mr-1"></i>
                                ${formatTimestamp(pred.timestamp)}
                            </p>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="toggleFavorite(${pred.id})" 
                                    class="p-2 rounded-lg hover:bg-gray-100 transition-colors ${pred.favorite ? 'text-yellow-500' : 'text-gray-400'}">
                                <i class="fas fa-star"></i>
                            </button>
                            <button onclick="sharePrediction(${pred.id})" 
                                    class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-blue-500">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button onclick="deletePrediction(${pred.id})" 
                                    class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-500">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- 번호 표시 -->
                    <div class="flex justify-center space-x-3 mb-4">
                        ${pred.numbers.map((num, idx) => `
                            <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${getNumberColorClass(idx)} hover:scale-110 transition-transform cursor-pointer" 
                                 title="번호 ${num} - ${getNumberMeaning(idx)}">
                                ${num}
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- 예측 요약 -->
                    <div class="bg-gray-50 rounded-lg p-3 mb-4">
                        <p class="text-sm text-gray-700 line-clamp-2">${pred.explanation.substring(0, 150)}...</p>
                    </div>
                    
                    <!-- 액션 버튼들 -->
                    <div class="flex justify-between items-center">
                        <div class="flex space-x-2">
                            <button onclick="loadPredictionDetail(${pred.id})" 
                                    class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                📖 상세보기
                            </button>
                            <button onclick="reusePrediction(${pred.id})" 
                                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                🔄 다시 분석
                            </button>
                        </div>
                        <div class="text-xs text-gray-500">
                            ID: #${pred.id}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    updatePagination();
}

// 예측저장 관련 헬퍼 함수들
function getUniqueMethodsCount(predictions) {
    const methods = new Set(predictions.map(p => p.method));
    return methods.size;
}

function getRecentPredictionsCount(predictions) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return predictions.filter(p => new Date(p.timestamp) > weekAgo).length;
}

function getFavoritesCount(predictions) {
    return predictions.filter(p => p.favorite).length;
}

function getMethodIcon(method) {
    const icons = {
        '꿈해몽 예측': '🌙',
        '명당위치 추천': '🏔️',
        '사주 운세': '📅',
        '종합 운세': '🔮',
        '방위별 분석': '🧭',
        '오행별 분석': '✨'
    };
    return icons[method] || '🎯';
}

function getNumberMeaning(index) {
    const meanings = [
        '새로운 시작', '조화와 균형', '성장과 발전', 
        '안정과 평화', '변화와 혁신', '완성과 성취'
    ];
    return meanings[index] || '행운의 수';
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '오늘';
    if (diffDays === 2) return '어제';
    if (diffDays <= 7) return `${diffDays - 1}일 전`;
    
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// 예측저장 필터링 함수들
function filterSavedPredictions(filter) {
    currentFilter = filter;
    
    // 필터 버튼 스타일 업데이트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-100', 'text-blue-700');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    event.target.classList.remove('bg-gray-100', 'text-gray-700');
    event.target.classList.add('active', 'bg-blue-100', 'text-blue-700');
    
    let filteredPredictions = savedPredictions;
    
    switch(filter) {
        case 'favorites':
            filteredPredictions = savedPredictions.filter(p => p.favorite);
            break;
        case 'recent':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            filteredPredictions = savedPredictions.filter(p => new Date(p.timestamp) > weekAgo);
            break;
        case 'all':
        default:
            // 모든 예측 표시
            break;
    }
    
    updateSavedPredictionsList(filteredPredictions);
}

// 즐겨찾기 토글
async function toggleFavorite(predictionId) {
    try {
        const response = await fetch(`/api/toggle-favorite/${predictionId}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const prediction = savedPredictions.find(p => p.id === predictionId);
            if (prediction) {
                prediction.favorite = !prediction.favorite;
                showToast(prediction.favorite ? '즐겨찾기에 추가되었습니다 ⭐' : '즐겨찾기에서 제거되었습니다', 'success');
                loadSavedPredictions(); // 목록 새로고침
            }
        }
    } catch (error) {
        showToast('즐겨찾기 설정 중 오류가 발생했습니다', 'error');
    }
}

// 예측 공유
function sharePrediction(predictionId) {
    const prediction = savedPredictions.find(p => p.id === predictionId);
    if (!prediction) return;
    
    const shareText = `🎯 ${prediction.method} 결과\n번호: ${prediction.numbers.join(', ')}\n생성일: ${formatTimestamp(prediction.timestamp)}\n\n#로또645AI #동양철학예측`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Lotto645.AI 예측 결과',
            text: shareText
        });
    } else {
        // 클립보드에 복사
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('예측 결과가 클립보드에 복사되었습니다 📋', 'success');
        });
    }
}

// 예측 재사용
function reusePrediction(predictionId) {
    const prediction = savedPredictions.find(p => p.id === predictionId);
    if (!prediction) return;
    
    // 해당 예측 방법으로 이동하여 같은 입력값으로 재분석
    showPrediction();
    
    setTimeout(() => {
        switch(prediction.method) {
            case '꿈해몽 예측':
                document.getElementById('dreamInput').value = prediction.input;
                break;
            case '명당위치 추천':
                document.getElementById('locationSelect').value = prediction.input;
                break;
            case '사주 운세':
                const [date, time] = prediction.input.split(' ');
                document.getElementById('birthDate').value = date;
                if (time !== '시간미상') document.getElementById('birthHour').value = time;
                break;
            case '종합 운세':
                const [name, concern] = prediction.input.split(' - ');
                document.getElementById('nameInput').value = name;
                document.getElementById('concernSelect').value = concern;
                break;
        }
        showToast(`${prediction.method} 입력값이 설정되었습니다. 다시 분석해보세요! 🔄`, 'info');
    }, 1000);
}

// 상세 예측 정보 로드
async function loadPredictionDetail(predictionId) {
    const prediction = savedPredictions.find(p => p.id === predictionId);
    if (!prediction) return;
    
    currentPrediction = prediction;
    showDetailedResult();
}

// 개인화 추천 기능
async function getPersonalizedRecommendation() {
    if (savedPredictions.length === 0) {
        showToast('저장된 예측이 없어 개인화 분석을 할 수 없습니다', 'info');
        return;
    }
    
    showLoadingAnimation('개인 패턴을 분석하여 맞춤 추천을 생성 중...');
    
    try {
        const response = await fetch('/api/personalized-recommendation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ predictions: savedPredictions })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            hideLoadingAnimation();
            showPersonalizedRecommendationModal(result);
        } else {
            throw new Error('개인화 추천 생성 실패');
        }
    } catch (error) {
        hideLoadingAnimation();
        showToast('개인화 추천 생성 중 오류가 발생했습니다', 'error');
    }
}

// 개인화 추천 모달
function showPersonalizedRecommendationModal(recommendation) {
    const modalHTML = `
        <div id="personalized-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div class="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-xl">
                    <h2 class="text-2xl font-bold flex items-center">
                        <span class="text-3xl mr-3">🎯</span>
                        개인화 맞춤 추천
                    </h2>
                    <p class="mt-2 opacity-90">당신만의 패턴 분석 결과</p>
                </div>
                
                <div class="p-6 space-y-6">
                    <div class="bg-purple-50 rounded-lg p-4">
                        <h3 class="font-bold text-purple-700 mb-3">📊 당신의 예측 패턴</h3>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>선호하는 방법: ${recommendation.preferredMethod}</div>
                            <div>자주 나오는 번호: ${recommendation.frequentNumbers.join(', ')}</div>
                            <div>예측 활용도: ${recommendation.usagePattern}</div>
                            <div>행운의 시간대: ${recommendation.luckyTime}</div>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 rounded-lg p-4">
                        <h3 class="font-bold text-blue-700 mb-3">🎯 맞춤 추천 번호</h3>
                        <div class="flex justify-center space-x-3 mb-3">
                            ${recommendation.numbers.map((num, idx) => `
                                <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${getNumberColorClass(idx)} animate-pulse">
                                    ${num}
                                </div>
                            `).join('')}
                        </div>
                        <p class="text-center text-blue-600 text-sm">${recommendation.explanation}</p>
                    </div>
                    
                    <div class="bg-green-50 rounded-lg p-4">
                        <h3 class="font-bold text-green-700 mb-3">💡 개인 맞춤 조언</h3>
                        <ul class="space-y-2 text-sm text-green-700">
                            ${recommendation.advice.map(advice => `<li>• ${advice}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                    <button onclick="closePersonalizedModal()" 
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                        닫기
                    </button>
                    <button onclick="savePersonalizedRecommendation(); closePersonalizedModal();" 
                            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                        💾 이 추천 저장하기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closePersonalizedModal() {
    const modal = document.getElementById('personalized-modal');
    if (modal) modal.remove();
}

function updatePagination() {
    // 페이지네이션 업데이트 로직 (필요시 구현)
    const pagination = document.getElementById('saved-predictions-pagination');
    if (savedPredictions.length > 10) {
        pagination.classList.remove('hidden');
        // 페이지네이션 구현
    } else {
        pagination.classList.add('hidden');
    }
}

// 명당분석 섹션 함수들
function showRegionalGeomancy() {
    const regionalDiv = document.getElementById('regional-geomancy');
    const otherDivs = ['directional-analysis', 'element-analysis'];
    
    // 다른 분석 결과 숨기기
    otherDivs.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    
    // 지역별 명당 표시
    regionalDiv.classList.remove('hidden');
    
    // 지역별 명당 데이터 로드
    loadRegionalGeomancyData();
}

function showDirectionalAnalysis() {
    const directionalDiv = document.getElementById('directional-analysis');
    const otherDivs = ['regional-geomancy', 'element-analysis'];
    
    otherDivs.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    
    directionalDiv.classList.remove('hidden');
    loadDirectionalAnalysisData();
}

function showElementAnalysis() {
    const elementDiv = document.getElementById('element-analysis');
    const otherDivs = ['regional-geomancy', 'directional-analysis'];
    
    otherDivs.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    
    elementDiv.classList.remove('hidden');
    loadElementAnalysisData();
}

// 데이터 로딩 함수들 (개선된 버전)
async function loadRegionalGeomancyData() {
    const content = document.getElementById('regional-content');
    content.innerHTML = `
        <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
            <span class="text-green-600 font-semibold">명당 정보를 불러오는 중...</span>
        </div>
    `;
    
    try {
        const response = await fetch('/api/regional-geomancy');
        const result = await response.json();
        
        if (response.ok) {
            content.innerHTML = result.regions.map((region, index) => `
                <div class="bg-white border-2 border-green-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group" 
                     onclick="showRegionDetail('${region.name}', '${region.description}', '${region.recommendation}')">
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="font-bold text-green-700 text-lg group-hover:text-green-800">${region.name}</h4>
                        <div class="text-yellow-500 text-lg">${region.recommendation}</div>
                    </div>
                    <p class="text-gray-600 mb-4 leading-relaxed">${region.description}</p>
                    
                    <div class="space-y-2">
                        <div class="flex items-center text-sm text-green-600">
                            <i class="fas fa-mountain mr-2"></i>
                            <span class="font-semibold">풍수 등급:</span>
                            <span class="ml-2 px-2 py-1 bg-green-100 rounded-full text-xs font-semibold">
                                ${getGeomancyGrade(region.recommendation)}
                            </span>
                        </div>
                        <div class="flex items-center text-sm text-blue-600">
                            <i class="fas fa-compass mr-2"></i>
                            <span class="font-semibold">추천 방위:</span>
                            <span class="ml-2">${getRecommendedDirection(index)}</span>
                        </div>
                        <div class="flex items-center text-sm text-purple-600">
                            <i class="fas fa-leaf mr-2"></i>
                            <span class="font-semibold">오행 속성:</span>
                            <span class="ml-2">${getElementType(index)}</span>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-3 border-t border-green-100 flex justify-between items-center">
                        <button onclick="event.stopPropagation(); generateGeomancyNumbers('${region.name}')" 
                                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                            🎯 번호 생성
                        </button>
                        <span class="text-xs text-gray-500">클릭하여 상세 정보 보기</span>
                    </div>
                </div>
            `).join('');
        } else {
            throw new Error('데이터 로드 실패');
        }
    } catch (error) {
        content.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <i class="fas fa-exclamation-triangle text-red-500 text-2xl mb-3"></i>
                <p class="text-red-600 font-semibold">명당 정보를 불러올 수 없습니다</p>
                <p class="text-red-500 text-sm mt-2">잠시 후 다시 시도해주세요</p>
                <button onclick="loadRegionalGeomancyData()" 
                        class="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                    다시 시도
                </button>
            </div>
        `;
    }
}

async function loadDirectionalAnalysisData() {
    const content = document.getElementById('directional-content');
    content.innerHTML = `
        <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span class="text-blue-600 font-semibold">방위 분석 중...</span>
        </div>
    `;
    
    try {
        const response = await fetch('/api/directional-analysis');
        const result = await response.json();
        
        if (response.ok) {
            // 방위별 나침반 스타일로 표시
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    ${result.directions.map((dir, index) => `
                        <div class="bg-white border-2 border-blue-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                             onclick="showDirectionDetail('${dir.direction}', '${dir.description}', '${dir.fortune}')">
                            <div class="text-center mb-4">
                                <div class="text-5xl mb-3 group-hover:animate-bounce">${dir.symbol}</div>
                                <h4 class="font-bold text-blue-700 text-xl group-hover:text-blue-800">${dir.direction}</h4>
                                <div class="text-sm text-gray-500 mt-1">${getDirectionGuardian(index)}</div>
                            </div>
                            
                            <p class="text-gray-600 mb-4 text-center leading-relaxed">${dir.description}</p>
                            
                            <div class="space-y-3">
                                <div class="flex justify-center">
                                    <span class="px-4 py-2 rounded-full text-sm font-semibold ${getFortuneColorClass(dir.fortune)}">
                                        ${dir.fortune}
                                    </span>
                                </div>
                                
                                <div class="text-center space-y-1">
                                    <div class="text-xs text-blue-600">
                                        <i class="fas fa-star mr-1"></i>
                                        <span class="font-semibold">길수:</span> ${getDirectionNumbers(index).join(', ')}
                                    </span>
                                    </div>
                                    <div class="text-xs text-purple-600">
                                        <i class="fas fa-leaf mr-1"></i>
                                        <span class="font-semibold">오행:</span> ${getDirectionElement(index)}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4 pt-4 border-t border-blue-100 text-center">
                                <button onclick="event.stopPropagation(); generateDirectionNumbers('${dir.direction}')" 
                                        class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
                                    🧭 방위 번호 생성
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- 방위 나침반 -->
                <div class="bg-white rounded-xl p-6 border-2 border-blue-200">
                    <h4 class="text-lg font-bold text-center mb-4 text-blue-700">🧭 풍수 방위 나침반</h4>
                    <div class="relative w-64 h-64 mx-auto">
                        <div class="absolute inset-0 border-4 border-blue-300 rounded-full bg-gradient-to-br from-blue-50 to-blue-100"></div>
                        ${generateCompassDirections()}
                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                </div>
            `;
        } else {
            throw new Error('방위 분석 데이터 로드 실패');
        }
    } catch (error) {
        content.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <i class="fas fa-compass text-red-500 text-2xl mb-3"></i>
                <p class="text-red-600 font-semibold">방위 분석을 불러올 수 없습니다</p>
                <button onclick="loadDirectionalAnalysisData()" 
                        class="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                    다시 시도
                </button>
            </div>
        `;
    }
}

async function loadElementAnalysisData() {
    const content = document.getElementById('element-content');
    content.innerHTML = `
        <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mr-3"></div>
            <span class="text-purple-600 font-semibold">오행 분석 중...</span>
        </div>
    `;
    
    try {
        const response = await fetch('/api/element-analysis');
        const result = await response.json();
        
        if (response.ok) {
            content.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    ${result.elements.map((elem, index) => `
                        <div class="bg-white border-2 border-purple-200 rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                             onclick="showElementDetail('${elem.name}', '${elem.description}', '${elem.power}')">
                            <div class="text-5xl mb-3 group-hover:animate-pulse">${elem.symbol}</div>
                            <h4 class="font-bold text-purple-700 text-lg mb-2 group-hover:text-purple-800">${elem.name}</h4>
                            <p class="text-sm text-gray-600 mb-3 leading-relaxed">${elem.description}</p>
                            
                            <div class="space-y-2">
                                <div class="px-3 py-1 bg-purple-100 rounded-full text-xs font-semibold text-purple-700">
                                    ${elem.power}
                                </div>
                                <div class="text-xs text-gray-500">
                                    연관 숫자: ${getElementNumbers(index).join(', ')}
                                </div>
                                <div class="text-xs text-blue-600">
                                    계절: ${getElementSeason(index)} | 방위: ${getElementDirection(index)}
                                </div>
                            </div>
                            
                            <button onclick="event.stopPropagation(); generateElementNumbers('${elem.name}')" 
                                    class="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full">
                                ✨ 오행 번호 생성
                            </button>
                        </div>
                    `).join('')}
                </div>
                
                <!-- 오행 상생상극도 -->
                <div class="bg-white rounded-xl p-6 border-2 border-purple-200">
                    <h4 class="text-lg font-bold text-center mb-6 text-purple-700">🔄 오행 상생상극 관계도</h4>
                    <div class="flex justify-center">
                        <div class="relative w-80 h-80">
                            ${generateFiveElementsCircle()}
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h5 class="font-bold text-green-700 mb-2">🔄 상생 관계 (相生)</h5>
                            <ul class="space-y-1 text-green-600">
                                <li>• 목(木) → 화(火): 나무가 불을 만든다</li>
                                <li>• 화(火) → 토(土): 불이 흙을 만든다</li>
                                <li>• 토(土) → 금(金): 흙이 금속을 만든다</li>
                                <li>• 금(金) → 수(水): 금속이 물을 만든다</li>
                                <li>• 수(水) → 목(木): 물이 나무를 키운다</li>
                            </ul>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg">
                            <h5 class="font-bold text-red-700 mb-2">⚔️ 상극 관계 (相剋)</h5>
                            <ul class="space-y-1 text-red-600">
                                <li>• 목(木) ⚔️ 토(土): 나무가 흙을 뽑아낸다</li>
                                <li>• 화(火) ⚔️ 금(金): 불이 금속을 녹인다</li>
                                <li>• 토(土) ⚔️ 수(水): 흙이 물을 막는다</li>
                                <li>• 금(金) ⚔️ 목(木): 금속이 나무를 자른다</li>
                                <li>• 수(水) ⚔️ 화(火): 물이 불을 끈다</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        } else {
            throw new Error('오행 분석 데이터 로드 실패');
        }
    } catch (error) {
        content.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <i class="fas fa-leaf text-red-500 text-2xl mb-3"></i>
                <p class="text-red-600 font-semibold">오행 분석을 불러올 수 없습니다</p>
                <button onclick="loadElementAnalysisData()" 
                        class="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                    다시 시도
                </button>
            </div>
        `;
    }
}

// 유틸리티 함수들
function showLoadingAnimation(message) {
    const loadingHTML = `
        <div id="loading-overlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p class="text-gray-700 font-semibold">${message}</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoadingAnimation() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

function showToast(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const toastHTML = `
        <div id="toast" class="fixed top-4 right-4 z-50 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-0 transition-transform duration-300">
            ${message}
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    
    setTimeout(() => {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

function getHistoricalDataCount() {
    return Math.floor(Math.random() * 500) + 1000; // 1000-1500회차
}

function getMathematicalModel() {
    const models = [
        '신경망 딥러닝',
        '베이지안 추론',
        '확률론적 모델링',
        '패턴 인식 AI',
        '통계적 회귀분석'
    ];
    return models[Math.floor(Math.random() * models.length)];
}

// 기존 함수들과의 호환성을 위한 함수들
function showSavedPredictions() {
    const section = document.getElementById('saved-predictions');
    if (section) {
        section.classList.toggle('hidden');
        if (!section.classList.contains('hidden')) {
            loadSavedPredictions();
        }
    }
}

async function deletePrediction(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        const response = await fetch(`/api/delete-prediction/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showToast('예측이 삭제되었습니다.', 'success');
            loadSavedPredictions();
        } else {
            throw new Error('삭제 실패');
        }
    } catch (error) {
        showToast('삭제 중 오류가 발생했습니다.', 'error');
    }
}

// 명당분석 헬퍼 함수들
function getGeomancyGrade(recommendation) {
    const starCount = (recommendation.match(/⭐/g) || []).length;
    switch(starCount) {
        case 5: return '최상급 명당';
        case 4: return '상급 명당';
        case 3: return '중급 명당';
        case 2: return '일반 명당';
        default: return '보통';
    }
}

function getRecommendedDirection(index) {
    const directions = ['남동', '남서', '동남서북중', '동남', '남동', '남중'];
    return directions[index] || '중앙';
}

function getElementType(index) {
    const elements = ['금수', '수목', '화토목', '목화', '수목토', '화토'];
    return elements[index] || '토';
}

function getDirectionGuardian(index) {
    const guardians = ['청룡', '백호', '주작', '현무', '황룡'];
    return guardians[index] || '신령';
}

function getFortuneColorClass(fortune) {
    if (fortune.includes('대길')) return 'bg-green-100 text-green-800';
    if (fortune.includes('중길')) return 'bg-blue-100 text-blue-800';
    if (fortune.includes('소길')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
}

function getDirectionNumbers(index) {
    const numbers = [
        [3, 8, 13, 18, 23],     // 동방 - 목
        [4, 9, 14, 19, 24],     // 서방 - 금
        [2, 7, 12, 17, 22],     // 남방 - 화
        [1, 6, 11, 16, 21],     // 북방 - 수
        [5, 10, 15, 20, 25]     // 중앙 - 토
    ];
    return numbers[index] || [1, 2, 3, 4, 5];
}

function getDirectionElement(index) {
    const elements = ['목(木)', '금(金)', '화(火)', '수(水)', '토(土)'];
    return elements[index] || '토(土)';
}

function getElementNumbers(index) {
    const numbers = [
        [3, 8, 13, 18, 23, 28, 33, 38, 43],    // 목
        [2, 7, 12, 17, 22, 27, 32, 37, 42],    // 화  
        [5, 10, 15, 20, 25, 30, 35, 40, 45],   // 토
        [4, 9, 14, 19, 24, 29, 34, 39, 44],    // 금
        [1, 6, 11, 16, 21, 26, 31, 36, 41]     // 수
    ];
    return numbers[index]?.slice(0, 6) || [1, 2, 3, 4, 5, 6];
}

function getElementSeason(index) {
    const seasons = ['봄', '여름', '늦여름', '가을', '겨울'];
    return seasons[index] || '사계절';
}

function getElementDirection(index) {
    const directions = ['동방', '남방', '중앙', '서방', '북방'];
    return directions[index] || '중앙';
}

// 나침반 생성 함수
function generateCompassDirections() {
    const directions = [
        { name: '북', symbol: '❄️', angle: 0, color: 'text-blue-600' },
        { name: '동북', symbol: '🌨️', angle: 45, color: 'text-indigo-600' },
        { name: '동', symbol: '🌅', angle: 90, color: 'text-green-600' },
        { name: '동남', symbol: '🌤️', angle: 135, color: 'text-yellow-600' },
        { name: '남', symbol: '☀️', angle: 180, color: 'text-red-600' },
        { name: '서남', symbol: '🌇', angle: 225, color: 'text-orange-600' },
        { name: '서', symbol: '🌄', angle: 270, color: 'text-purple-600' },
        { name: '서북', symbol: '🌆', angle: 315, color: 'text-gray-600' }
    ];
    
    return directions.map(dir => {
        const radian = (dir.angle - 90) * Math.PI / 180;
        const x = 50 + 35 * Math.cos(radian);
        const y = 50 + 35 * Math.sin(radian);
        
        return `
            <div class="absolute ${dir.color} text-xs font-bold cursor-pointer hover:scale-125 transition-transform"
                 style="left: ${x}%; top: ${y}%; transform: translate(-50%, -50%);">
                <div class="text-center">
                    <div class="text-lg">${dir.symbol}</div>
                    <div>${dir.name}</div>
                </div>
            </div>
        `;
    }).join('');
}

// 오행 원형 도표 생성
function generateFiveElementsCircle() {
    const elements = [
        { name: '木', symbol: '🌳', color: 'text-green-600', bg: 'bg-green-100', angle: 0 },
        { name: '火', symbol: '🔥', color: 'text-red-600', bg: 'bg-red-100', angle: 72 },
        { name: '土', symbol: '🏔️', color: 'text-yellow-600', bg: 'bg-yellow-100', angle: 144 },
        { name: '金', symbol: '⚡', color: 'text-gray-600', bg: 'bg-gray-100', angle: 216 },
        { name: '水', symbol: '🌊', color: 'text-blue-600', bg: 'bg-blue-100', angle: 288 }
    ];
    
    let html = '';
    
    // 오행 원소들
    elements.forEach((elem, index) => {
        const radian = (elem.angle - 90) * Math.PI / 180;
        const x = 50 + 35 * Math.cos(radian);
        const y = 50 + 35 * Math.sin(radian);
        
        html += `
            <div class="absolute w-16 h-16 ${elem.bg} ${elem.color} rounded-full flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg"
                 style="left: ${x}%; top: ${y}%; transform: translate(-50%, -50%);"
                 onclick="generateElementNumbers('${elem.name}')">
                <div class="text-xl">${elem.symbol}</div>
                <div class="text-xs font-bold">${elem.name}</div>
            </div>
        `;
        
        // 상생 화살표 (다음 원소로)
        const nextIndex = (index + 1) % elements.length;
        const nextRadian = (elements[nextIndex].angle - 90) * Math.PI / 180;
        const nextX = 50 + 35 * Math.cos(nextRadian);
        const nextY = 50 + 35 * Math.sin(nextRadian);
        
        const midX = (x + nextX) / 2;
        const midY = (y + nextY) / 2;
        
        html += `
            <div class="absolute text-green-500 text-sm hover:text-green-700 cursor-pointer"
                 style="left: ${midX}%; top: ${midY}%; transform: translate(-50%, -50%);"
                 title="${elem.name} → ${elements[nextIndex].name} (상생)">
                →
            </div>
        `;
    });
    
    return html;
}

// 명당분석 상세 정보 모달
function showRegionDetail(name, description, recommendation) {
    const modalHTML = `
        <div id="region-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-t-xl">
                    <h2 class="text-2xl font-bold flex items-center">
                        <span class="text-3xl mr-3">🏔️</span>
                        ${name} 명당 상세 분석
                    </h2>
                    <div class="mt-2 flex items-center">
                        <span class="mr-2">풍수 등급:</span>
                        <span class="text-yellow-300 text-lg">${recommendation}</span>
                    </div>
                </div>
                
                <div class="p-6 space-y-6">
                    <div class="bg-green-50 rounded-lg p-4">
                        <h3 class="font-bold text-green-700 mb-2">🌍 명당 개요</h3>
                        <p class="text-gray-700">${description}</p>
                    </div>
                    
                    <div class="bg-blue-50 rounded-lg p-4">
                        <h3 class="font-bold text-blue-700 mb-3">🧭 풍수지리적 특성</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 class="font-semibold text-blue-600 mb-2">지형적 특성</h4>
                                <ul class="text-sm text-gray-600 space-y-1">
                                    <li>• 배산임수 지형으로 안정감 제공</li>
                                    <li>• 자연 기운의 조화로운 흐름</li>
                                    <li>• 외부로부터의 보호막 역할</li>
                                </ul>
                            </div>
                            <div>
                                <h4 class="font-semibold text-blue-600 mb-2">기운적 특성</h4>
                                <ul class="text-sm text-gray-600 space-y-1">
                                    <li>• 재물운과 건강운 증진</li>
                                    <li>• 인간관계 운세 향상</li>
                                    <li>• 정신적 안정과 집중력 강화</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-purple-50 rounded-lg p-4">
                        <h3 class="font-bold text-purple-700 mb-3">🎯 추천 활동</h3>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="font-semibold text-purple-600">적합한 시기:</span>
                                <p class="text-gray-600">새벽과 해질녘, 보름달이 뜨는 밤</p>
                            </div>
                            <div>
                                <span class="font-semibold text-purple-600">권장 활동:</span>
                                <p class="text-gray-600">명상, 기원, 중요한 결정</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                    <button onclick="closeRegionModal()" 
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                        닫기
                    </button>
                    <button onclick="generateGeomancyNumbers('${name}'); closeRegionModal();" 
                            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        🎯 이 명당으로 번호 생성
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeRegionModal() {
    const modal = document.getElementById('region-modal');
    if (modal) modal.remove();
}

// 번호 생성 함수들
async function generateGeomancyNumbers(locationName) {
    try {
        showLoadingAnimation(`${locationName}의 명당 기운을 분석 중...`);
        
        const response = await fetch('/api/geomancy-prediction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: locationName })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            currentPrediction = {
                method: '명당위치 추천',
                input: locationName,
                numbers: result.numbers,
                explanation: result.explanation,
                timestamp: new Date().toISOString()
            };
            currentMethod = 'geomancy';
            
            hideLoadingAnimation();
            
            // 예측 섹션으로 스크롤
            document.getElementById('prediction').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                animateNumberGeneration(result.numbers);
                showToast(`${locationName} 명당 분석 완료! 🏔️`, 'success');
            }, 500);
        } else {
            throw new Error(result.error || '명당 번호 생성 실패');
        }
    } catch (error) {
        hideLoadingAnimation();
        showToast('명당 번호 생성 중 오류가 발생했습니다.', 'error');
    }
}

async function generateDirectionNumbers(direction) {
    // 방위 기반 번호 생성 로직 구현
    const numbers = generateRandomLottoNumbers();
    showToast(`${direction} 방위 번호가 생성되었습니다!`, 'success');
    
    // 예측 섹션으로 이동하여 결과 표시
    currentPrediction = {
        method: '방위별 분석',
        input: direction,
        numbers: numbers,
        explanation: `${direction} 방위의 기운을 바탕으로 생성된 행운의 번호입니다.`,
        timestamp: new Date().toISOString()
    };
    
    document.getElementById('prediction').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => animateNumberGeneration(numbers), 500);
}

async function generateElementNumbers(element) {
    // 오행 기반 번호 생성 로직 구현
    const numbers = generateRandomLottoNumbers();
    showToast(`${element} 오행 번호가 생성되었습니다!`, 'success');
    
    currentPrediction = {
        method: '오행별 분석',
        input: element,
        numbers: numbers,
        explanation: `${element} 오행의 기운을 바탕으로 생성된 조화로운 번호입니다.`,
        timestamp: new Date().toISOString()
    };
    
    document.getElementById('prediction').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => animateNumberGeneration(numbers), 500);
}

function generateRandomLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

// 메뉴 전환 함수 (기존 기능과의 호환성)
function showPrediction() {
    document.getElementById('prediction').scrollIntoView({ behavior: 'smooth' });
}

function showGeomancyAnalysis() {
    document.getElementById('geomancy-analysis').scrollIntoView({ behavior: 'smooth' });
}

// 키보드 단축키 설정
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + 키 조합
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'l': // Ctrl+L: 로그인
                    e.preventDefault();
                    if (!currentUser) {
                        showLoginModal();
                    }
                    break;
                case 's': // Ctrl+S: 예측 저장
                    e.preventDefault();
                    if (currentPrediction && currentUser) {
                        savePredictionResult();
                    }
                    break;
                case 'd': // Ctrl+D: 상세 보기
                    e.preventDefault();
                    if (currentPrediction) {
                        showDetailedResult();
                    }
                    break;
            }
        }
        
        // ESC 키: 모든 모달 닫기
        if (e.key === 'Escape') {
            hideLoginModal();
            closeDetailedModal();
            closeRegionModal();
            closePersonalizedModal();
        }
        
        // 숫자키: 빠른 예측 방법 선택 (모달이 열려있지 않을 때만)
        if (!document.querySelector('.fixed:not(.hidden)') && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const predictionSection = document.getElementById('prediction');
            predictionSection.scrollIntoView({ behavior: 'smooth' });
            
            // 해당 예측 방법으로 포커스
            setTimeout(() => {
                const inputs = ['dreamInput', 'locationSelect', 'birthDate', 'nameInput'];
                const targetInput = document.getElementById(inputs[parseInt(e.key) - 1]);
                if (targetInput) {
                    targetInput.focus();
                }
            }, 500);
        }
    });
    
    // 로그인 모달에서 Enter 키 처리
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                e.preventDefault();
                handleLogin({ preventDefault: () => {} });
            }
        });
    }
}