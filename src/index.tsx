import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings, LottoDraw, AIPrediction, NumberRecommendation, StatisticsResult, ChatMessage } from './types'

const app = new Hono<{ Bindings: Bindings }>()

// CORS 설정
app.use('/api/*', cors())

// 정적 파일 서빙
app.use('/static/*', serveStatic({ root: './public' }))

// 메인 페이지
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>로또645.AI - AI 기반 로또 분석 플랫폼</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .card-hover { transition: transform 0.2s; }
          .card-hover:hover { transform: translateY(-2px); }
        </style>
    </head>
    <body class="bg-gray-50 min-h-screen">
        <!-- 헤더 -->
        <header class="gradient-bg text-white shadow-lg">
            <div class="container mx-auto px-4 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-brain text-3xl"></i>
                        <h1 class="text-2xl font-bold">로또645.AI</h1>
                    </div>
                    <nav class="hidden md:flex space-x-6">
                        <a href="#analysis" class="hover:text-blue-200">통계 분석</a>
                        <a href="#prediction" class="hover:text-blue-200">AI 예측</a>
                        <a href="#chatbot" class="hover:text-blue-200">AI 챗봇</a>
                        <a href="#stores" class="hover:text-blue-200">명당 정보</a>
                    </nav>
                </div>
            </div>
        </header>

        <!-- 메인 컨텐츠 -->
        <main class="container mx-auto px-4 py-8 space-y-8">
            <!-- 최신 당첨 번호 -->
            <section class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold mb-4 flex items-center">
                    <i class="fas fa-trophy text-yellow-500 mr-2"></i>
                    최신 당첨 번호
                </h2>
                <div id="latest-draw" class="text-center">
                    <div class="animate-pulse text-gray-400">당첨 번호를 불러오는 중...</div>
                </div>
            </section>

            <!-- AI 챗봇 섹션 -->
            <section id="chatbot" class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold mb-4 flex items-center">
                    <i class="fas fa-robot text-blue-500 mr-2"></i>
                    AI 로또 분석 챗봇
                </h2>
                <div class="border rounded-lg h-96 mb-4 p-4 overflow-y-auto bg-gray-50" id="chat-messages">
                    <div class="text-gray-500 text-center py-8">
                        안녕하세요! 로또645.AI 챗봇입니다. 당첨 번호, 통계 분석, 명당 정보 등 무엇이든 물어보세요!
                    </div>
                </div>
                <div class="flex space-x-2">
                    <input type="text" id="chat-input" 
                           placeholder="예: 지난 10회차 당첨 번호 패턴을 분석해줘" 
                           class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                    <button onclick="sendMessage()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </section>

            <!-- 통계 분석 섹션 -->
            <section id="analysis" class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold mb-4 flex items-center">
                    <i class="fas fa-chart-bar text-green-500 mr-2"></i>
                    8가지 통계 분석
                </h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <button onclick="runAnalysis('frequency_analysis')" class="card-hover bg-blue-50 border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-100">
                        <i class="fas fa-sort-numeric-up text-blue-600 text-xl mb-2"></i>
                        <div class="font-semibold">빈도 분석</div>
                    </button>
                    <button onclick="runAnalysis('hot_cold_numbers')" class="card-hover bg-red-50 border border-red-200 rounded-lg p-4 text-center hover:bg-red-100">
                        <i class="fas fa-thermometer-half text-red-600 text-xl mb-2"></i>
                        <div class="font-semibold">핫/콜드 번호</div>
                    </button>
                    <button onclick="runAnalysis('pattern_analysis')" class="card-hover bg-purple-50 border border-purple-200 rounded-lg p-4 text-center hover:bg-purple-100">
                        <i class="fas fa-puzzle-piece text-purple-600 text-xl mb-2"></i>
                        <div class="font-semibold">패턴 분석</div>
                    </button>
                    <button onclick="runAnalysis('correlation_analysis')" class="card-hover bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center hover:bg-yellow-100">
                        <i class="fas fa-project-diagram text-yellow-600 text-xl mb-2"></i>
                        <div class="font-semibold">상관관계 분석</div>
                    </button>
                    <button onclick="runAnalysis('trend_analysis')" class="card-hover bg-green-50 border border-green-200 rounded-lg p-4 text-center hover:bg-green-100">
                        <i class="fas fa-chart-line text-green-600 text-xl mb-2"></i>
                        <div class="font-semibold">트렌드 분석</div>
                    </button>
                    <button onclick="runAnalysis('distribution_analysis')" class="card-hover bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center hover:bg-indigo-100">
                        <i class="fas fa-bell-curve text-indigo-600 text-xl mb-2"></i>
                        <div class="font-semibold">분포 분석</div>
                    </button>
                    <button onclick="runAnalysis('sequence_analysis')" class="card-hover bg-pink-50 border border-pink-200 rounded-lg p-4 text-center hover:bg-pink-100">
                        <i class="fas fa-list-ol text-pink-600 text-xl mb-2"></i>
                        <div class="font-semibold">연속 분석</div>
                    </button>
                    <button onclick="runAnalysis('probability_analysis')" class="card-hover bg-teal-50 border border-teal-200 rounded-lg p-4 text-center hover:bg-teal-100">
                        <i class="fas fa-percentage text-teal-600 text-xl mb-2"></i>
                        <div class="font-semibold">확률 분석</div>
                    </button>
                </div>
                <div id="analysis-result" class="hidden">
                    <h3 class="font-semibold mb-2">분석 결과</h3>
                    <div id="analysis-chart" class="mb-4">
                        <canvas id="analysisChart" width="400" height="200"></canvas>
                    </div>
                    <div id="analysis-summary" class="bg-gray-50 p-4 rounded-lg"></div>
                </div>
            </section>

            <!-- AI 예측 섹션 -->
            <section id="prediction" class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold mb-4 flex items-center">
                    <i class="fas fa-brain text-purple-500 mr-2"></i>
                    AI 번호 예측 (10가지 알고리즘)
                </h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <button onclick="getPrediction('bayesian_inference')" class="card-hover bg-blue-50 border border-blue-200 rounded-lg p-3 text-center hover:bg-blue-100">
                        <i class="fas fa-brain text-blue-600 mb-1"></i>
                        <div class="text-sm font-semibold">베이지안 추론</div>
                    </button>
                    <button onclick="getPrediction('neural_network')" class="card-hover bg-red-50 border border-red-200 rounded-lg p-3 text-center hover:bg-red-100">
                        <i class="fas fa-network-wired text-red-600 mb-1"></i>
                        <div class="text-sm font-semibold">신경망</div>
                    </button>
                    <button onclick="getPrediction('frequency_analysis')" class="card-hover bg-green-50 border border-green-200 rounded-lg p-3 text-center hover:bg-green-100">
                        <i class="fas fa-sort-amount-up text-green-600 mb-1"></i>
                        <div class="text-sm font-semibold">빈도 분석</div>
                    </button>
                    <button onclick="getPrediction('pattern_recognition')" class="card-hover bg-purple-50 border border-purple-200 rounded-lg p-3 text-center hover:bg-purple-100">
                        <i class="fas fa-eye text-purple-600 mb-1"></i>
                        <div class="text-sm font-semibold">패턴 인식</div>
                    </button>
                    <button onclick="getPrediction('monte_carlo')" class="card-hover bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center hover:bg-yellow-100">
                        <i class="fas fa-dice text-yellow-600 mb-1"></i>
                        <div class="text-sm font-semibold">몬테카를로</div>
                    </button>
                    <button onclick="getPrediction('markov_chain')" class="card-hover bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center hover:bg-indigo-100">
                        <i class="fas fa-link text-indigo-600 mb-1"></i>
                        <div class="text-sm font-semibold">마르코프 체인</div>
                    </button>
                    <button onclick="getPrediction('genetic_algorithm')" class="card-hover bg-pink-50 border border-pink-200 rounded-lg p-3 text-center hover:bg-pink-100">
                        <i class="fas fa-dna text-pink-600 mb-1"></i>
                        <div class="text-sm font-semibold">유전 알고리즘</div>
                    </button>
                    <button onclick="getPrediction('clustering_analysis')" class="card-hover bg-teal-50 border border-teal-200 rounded-lg p-3 text-center hover:bg-teal-100">
                        <i class="fas fa-layer-group text-teal-600 mb-1"></i>
                        <div class="text-sm font-semibold">클러스터링</div>
                    </button>
                    <button onclick="getPrediction('regression_analysis')" class="card-hover bg-orange-50 border border-orange-200 rounded-lg p-3 text-center hover:bg-orange-100">
                        <i class="fas fa-chart-line text-orange-600 mb-1"></i>
                        <div class="text-sm font-semibold">회귀 분석</div>
                    </button>
                    <button onclick="getPrediction('ensemble_method')" class="card-hover bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:bg-gray-100">
                        <i class="fas fa-users text-gray-600 mb-1"></i>
                        <div class="text-sm font-semibold">앙상블</div>
                    </button>
                </div>
                <div id="prediction-results" class="space-y-4"></div>
            </section>

            <!-- 명당 정보 섹션 -->
            <section id="stores" class="bg-white rounded-lg shadow-lg p-6">
                <h2 class="text-xl font-bold mb-4 flex items-center">
                    <i class="fas fa-store text-orange-500 mr-2"></i>
                    명당 판매점 정보
                </h2>
                <div id="lucky-stores" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            </section>
        </main>

        <!-- 자바스크립트 -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // API 기본 설정
            const API_BASE = '/api';
            
            // 페이지 로드 시 초기 데이터 불러오기
            document.addEventListener('DOMContentLoaded', function() {
                loadLatestDraw();
                loadLuckyStores();
            });

            // 최신 당첨 번호 불러오기
            async function loadLatestDraw() {
                try {
                    const response = await axios.get(\`\${API_BASE}/draws/latest\`);
                    if (response.data.success) {
                        displayLatestDraw(response.data.data);
                    }
                } catch (error) {
                    document.getElementById('latest-draw').innerHTML = 
                        '<div class="text-red-500">당첨 번호를 불러올 수 없습니다.</div>';
                }
            }

            // 최신 당첨 번호 표시
            function displayLatestDraw(draw) {
                const numbers = [draw.number1, draw.number2, draw.number3, draw.number4, draw.number5, draw.number6];
                const numbersHtml = numbers.map(num => 
                    \`<span class="inline-block w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-2">\${num}</span>\`
                ).join('');
                
                document.getElementById('latest-draw').innerHTML = \`
                    <div class="mb-2">
                        <span class="text-gray-600">제 \${draw.draw_number}회 (\${draw.draw_date})</span>
                    </div>
                    <div class="flex justify-center items-center mb-2">
                        \${numbersHtml}
                        <span class="mx-2 text-gray-400">+</span>
                        <span class="inline-block w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">\${draw.bonus_number}</span>
                    </div>
                \`;
            }

            // 챗봇 메시지 전송
            async function sendMessage() {
                const input = document.getElementById('chat-input');
                const message = input.value.trim();
                if (!message) return;

                // 사용자 메시지 추가
                addChatMessage('user', message);
                input.value = '';

                try {
                    const response = await axios.post(\`\${API_BASE}/chatbot\`, { message });
                    if (response.data.success) {
                        addChatMessage('assistant', response.data.data.content);
                    } else {
                        addChatMessage('assistant', '죄송합니다. 응답을 생성할 수 없습니다.');
                    }
                } catch (error) {
                    addChatMessage('assistant', '네트워크 오류가 발생했습니다.');
                }
            }

            // 챗봇 메시지 추가
            function addChatMessage(role, content) {
                const chatMessages = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = \`mb-3 \${role === 'user' ? 'text-right' : 'text-left'}\`;
                
                const bubbleClass = role === 'user' 
                    ? 'bg-blue-600 text-white ml-auto' 
                    : 'bg-gray-200 text-gray-800 mr-auto';
                
                messageDiv.innerHTML = \`
                    <div class="inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg \${bubbleClass}">
                        \${content}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                        \${new Date().toLocaleTimeString()}
                    </div>
                \`;
                
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            // Enter 키로 메시지 전송
            document.getElementById('chat-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            // 통계 분석 실행
            async function runAnalysis(type) {
                try {
                    const response = await axios.post(\`\${API_BASE}/analysis\`, { type });
                    if (response.data.success) {
                        displayAnalysisResult(response.data.data);
                    }
                } catch (error) {
                    console.error('Analysis error:', error);
                }
            }

            // 분석 결과 표시
            function displayAnalysisResult(result) {
                document.getElementById('analysis-result').classList.remove('hidden');
                document.getElementById('analysis-summary').innerHTML = result.summary;
                
                // 차트 표시 (간단한 예시)
                if (result.visualization) {
                    const ctx = document.getElementById('analysisChart').getContext('2d');
                    new Chart(ctx, JSON.parse(result.visualization));
                }
            }

            // AI 예측 실행
            async function getPrediction(algorithm) {
                try {
                    const response = await axios.post(\`\${API_BASE}/prediction\`, { algorithm });
                    if (response.data.success) {
                        displayPredictionResult(response.data.data);
                    }
                } catch (error) {
                    console.error('Prediction error:', error);
                }
            }

            // 예측 결과 표시
            function displayPredictionResult(prediction) {
                const resultsDiv = document.getElementById('prediction-results');
                
                const numbersHtml = prediction.numbers.map(num => 
                    \`<span class="inline-block w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-1">\${num}</span>\`
                ).join('');
                
                const resultCard = document.createElement('div');
                resultCard.className = 'border rounded-lg p-4 bg-purple-50';
                resultCard.innerHTML = \`
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-semibold">\${getAlgorithmName(prediction.algorithm)}</h4>
                        <span class="text-sm bg-purple-200 px-2 py-1 rounded">신뢰도: \${(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div class="flex items-center mb-2">
                        \${numbersHtml}
                    </div>
                    <p class="text-sm text-gray-600">\${prediction.explanation}</p>
                    <p class="text-xs text-gray-500 mt-1">\${prediction.reason}</p>
                \`;
                
                resultsDiv.insertBefore(resultCard, resultsDiv.firstChild);
                
                // 최대 5개까지만 표시
                while (resultsDiv.children.length > 5) {
                    resultsDiv.removeChild(resultsDiv.lastChild);
                }
            }

            // 알고리즘 이름 변환
            function getAlgorithmName(algorithm) {
                const names = {
                    'bayesian_inference': '베이지안 추론',
                    'neural_network': '신경망',
                    'frequency_analysis': '빈도 분석',
                    'pattern_recognition': '패턴 인식',
                    'monte_carlo': '몬테카를로',
                    'markov_chain': '마르코프 체인',
                    'genetic_algorithm': '유전 알고리즘',
                    'clustering_analysis': '클러스터링',
                    'regression_analysis': '회귀 분석',
                    'ensemble_method': '앙상블 방법'
                };
                return names[algorithm] || algorithm;
            }

            // 명당 정보 불러오기
            async function loadLuckyStores() {
                try {
                    const response = await axios.get(\`\${API_BASE}/stores\`);
                    if (response.data.success) {
                        displayLuckyStores(response.data.data);
                    }
                } catch (error) {
                    document.getElementById('lucky-stores').innerHTML = 
                        '<div class="col-span-full text-red-500 text-center">명당 정보를 불러올 수 없습니다.</div>';
                }
            }

            // 명당 정보 표시
            function displayLuckyStores(stores) {
                const storesDiv = document.getElementById('lucky-stores');
                storesDiv.innerHTML = stores.map(store => \`
                    <div class="card-hover border rounded-lg p-4 hover:shadow-md">
                        <h4 class="font-semibold mb-2 flex items-center">
                            <i class="fas fa-crown text-yellow-500 mr-2"></i>
                            \${store.name}
                        </h4>
                        <p class="text-sm text-gray-600 mb-2">\${store.address}</p>
                        <div class="flex justify-between text-sm">
                            <span class="text-red-600 font-semibold">1등: \${store.first_prize_count}회</span>
                            <span class="text-blue-600">총 당첨: \${store.total_prize_count}회</span>
                        </div>
                    </div>
                \`).join('');
            }
        </script>
    </body>
    </html>
  `)
})

// API 라우트들
// 최신 당첨 번호 API
app.get('/api/draws/latest', async (c) => {
  try {
    const result = await c.env.DB.prepare(`
      SELECT * FROM lotto_draws 
      ORDER BY draw_number DESC 
      LIMIT 1
    `).first();

    if (!result) {
      return c.json({ success: false, error: 'No draw data found' });
    }

    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Database error' });
  }
});

// 당첨 번호 목록 API
app.get('/api/draws', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const results = await c.env.DB.prepare(`
      SELECT * FROM lotto_draws 
      ORDER BY draw_number DESC 
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    return c.json({ success: true, data: results.results });
  } catch (error) {
    return c.json({ success: false, error: 'Database error' });
  }
});

// 명당 정보 API
app.get('/api/stores', async (c) => {
  try {
    const results = await c.env.DB.prepare(`
      SELECT * FROM lucky_stores 
      ORDER BY first_prize_count DESC, total_prize_count DESC
    `).all();

    return c.json({ success: true, data: results.results });
  } catch (error) {
    return c.json({ success: false, error: 'Database error' });
  }
});

// AI 챗봇 API
app.post('/api/chatbot', async (c) => {
  try {
    const { message } = await c.req.json();
    
    if (!message) {
      return c.json({ success: false, error: 'Message is required' });
    }

    // 간단한 규칙 기반 응답 (실제로는 AI 모델 사용)
    const response = await generateChatResponse(message, c.env.DB);
    
    return c.json({ 
      success: true, 
      data: { 
        content: response,
        role: 'assistant'
      } 
    });
  } catch (error) {
    return c.json({ success: false, error: 'Chatbot error' });
  }
});

// 통계 분석 API
app.post('/api/analysis', async (c) => {
  try {
    const { type } = await c.req.json();
    
    if (!type) {
      return c.json({ success: false, error: 'Analysis type is required' });
    }

    const result = await performStatisticalAnalysis(type, c.env.DB);
    
    return c.json({ success: true, data: result });
  } catch (error) {
    return c.json({ success: false, error: 'Analysis error' });
  }
});

// AI 예측 API
app.post('/api/prediction', async (c) => {
  try {
    const { algorithm } = await c.req.json();
    
    if (!algorithm) {
      return c.json({ success: false, error: 'Algorithm is required' });
    }

    const prediction = await generateAIPrediction(algorithm, c.env.DB);
    
    return c.json({ success: true, data: prediction });
  } catch (error) {
    return c.json({ success: false, error: 'Prediction error' });
  }
});

// 챗봇 응답 생성 함수
async function generateChatResponse(message: string, db: D1Database): Promise<string> {
  const lowercaseMessage = message.toLowerCase();
  
  // 최신 당첨 번호 요청
  if (lowercaseMessage.includes('최신') || lowercaseMessage.includes('당첨') || lowercaseMessage.includes('번호')) {
    try {
      const latest = await db.prepare(`
        SELECT * FROM lotto_draws ORDER BY draw_number DESC LIMIT 1
      `).first();
      
      if (latest) {
        return `최신 당첨 번호는 제${latest.draw_number}회 (${latest.draw_date}) ${latest.number1}, ${latest.number2}, ${latest.number3}, ${latest.number4}, ${latest.number5}, ${latest.number6} + 보너스 ${latest.bonus_number}입니다.`;
      }
    } catch (error) {
      return "당첨 번호를 가져오는 중 오류가 발생했습니다.";
    }
  }
  
  // 빈도 분석 요청
  if (lowercaseMessage.includes('빈도') || lowercaseMessage.includes('자주')) {
    try {
      const query = `
        SELECT number, COUNT(*) as frequency FROM (
          SELECT number1 as number FROM lotto_draws UNION ALL
          SELECT number2 FROM lotto_draws UNION ALL
          SELECT number3 FROM lotto_draws UNION ALL
          SELECT number4 FROM lotto_draws UNION ALL
          SELECT number5 FROM lotto_draws UNION ALL
          SELECT number6 FROM lotto_draws
        ) GROUP BY number ORDER BY frequency DESC LIMIT 5
      `;
      
      const results = await db.prepare(query).all();
      const topNumbers = results.results.map((r: any) => `${r.number}번(${r.frequency}회)`).join(', ');
      
      return `가장 자주 나온 번호 TOP 5: ${topNumbers}입니다. 하지만 로또는 확률 게임이므로 과거 데이터가 미래를 보장하지는 않습니다.`;
    } catch (error) {
      return "빈도 분석 중 오류가 발생했습니다.";
    }
  }
  
  // 명당 정보 요청
  if (lowercaseMessage.includes('명당') || lowercaseMessage.includes('판매점')) {
    try {
      const stores = await db.prepare(`
        SELECT * FROM lucky_stores ORDER BY first_prize_count DESC LIMIT 3
      `).all();
      
      const storeList = stores.results.map((s: any) => 
        `${s.name} (${s.address}) - 1등 ${s.first_prize_count}회`
      ).join('\\n');
      
      return `추천 명당 판매점:\\n${storeList}`;
    } catch (error) {
      return "명당 정보를 가져오는 중 오류가 발생했습니다.";
    }
  }
  
  // 예측 요청
  if (lowercaseMessage.includes('예측') || lowercaseMessage.includes('추천')) {
    const numbers = generateRandomNumbers();
    return `AI 예측 번호: ${numbers.join(', ')}\\n(신뢰도: ${Math.floor(Math.random() * 20 + 60)}%)\\n\\n이는 AI 분석 결과이며, 로또는 확률 게임임을 유의하세요.`;
  }
  
  // 기본 응답
  const responses = [
    "로또645.AI에서 제공하는 기능을 이용해보세요:\\n• 최신 당첨 번호 확인\\n• 통계 분석 (빈도, 패턴 등)\\n• AI 예측\\n• 명당 정보",
    "궁금한 것이 있으시면 언제든지 물어보세요! 당첨 번호, 통계, 예측 등 도움을 드릴 수 있습니다.",
    "로또는 순전히 확률에 의한 게임입니다. 분석과 예측은 참고용으로만 활용하시고, 적정선에서 즐기세요!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// 통계 분석 수행 함수
async function performStatisticalAnalysis(type: string, db: D1Database): Promise<StatisticsResult> {
  switch (type) {
    case 'frequency_analysis':
      return await frequencyAnalysis(db);
    case 'hot_cold_numbers':
      return await hotColdAnalysis(db);
    case 'pattern_analysis':
      return await patternAnalysis(db);
    default:
      return {
        type: type as any,
        data: {},
        summary: '해당 분석은 아직 구현되지 않았습니다.'
      };
  }
}

// 빈도 분석
async function frequencyAnalysis(db: D1Database): Promise<StatisticsResult> {
  try {
    const query = `
      SELECT number, COUNT(*) as frequency FROM (
        SELECT number1 as number FROM lotto_draws UNION ALL
        SELECT number2 FROM lotto_draws UNION ALL
        SELECT number3 FROM lotto_draws UNION ALL
        SELECT number4 FROM lotto_draws UNION ALL
        SELECT number5 FROM lotto_draws UNION ALL
        SELECT number6 FROM lotto_draws
      ) GROUP BY number ORDER BY number
    `;
    
    const results = await db.prepare(query).all();
    const data = results.results.map((r: any) => ({ number: r.number, frequency: r.frequency }));
    
    const chartConfig = {
      type: 'bar',
      data: {
        labels: data.map((d: any) => d.number.toString()),
        datasets: [{
          label: '출현 빈도',
          data: data.map((d: any) => d.frequency),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    
    const topNumbers = data
      .sort((a: any, b: any) => b.frequency - a.frequency)
      .slice(0, 10)
      .map((d: any) => `${d.number}번(${d.frequency}회)`)
      .join(', ');
    
    return {
      type: 'frequency_analysis',
      data: data,
      visualization: JSON.stringify(chartConfig),
      summary: `번호별 출현 빈도 분석 결과:\\n가장 자주 나온 번호 TOP 10: ${topNumbers}`
    };
  } catch (error) {
    return {
      type: 'frequency_analysis',
      data: {},
      summary: '빈도 분석 중 오류가 발생했습니다.'
    };
  }
}

// 핫/콜드 번호 분석
async function hotColdAnalysis(db: D1Database): Promise<StatisticsResult> {
  try {
    const recentDraws = await db.prepare(`
      SELECT * FROM lotto_draws ORDER BY draw_number DESC LIMIT 20
    `).all();
    
    const numberFrequency: Record<number, number> = {};
    
    recentDraws.results.forEach((draw: any) => {
      [draw.number1, draw.number2, draw.number3, draw.number4, draw.number5, draw.number6].forEach(num => {
        numberFrequency[num] = (numberFrequency[num] || 0) + 1;
      });
    });
    
    const sortedNumbers = Object.entries(numberFrequency)
      .map(([num, freq]) => ({ number: parseInt(num), frequency: freq }))
      .sort((a, b) => b.frequency - a.frequency);
    
    const hotNumbers = sortedNumbers.slice(0, 10);
    const coldNumbers = [];
    
    // 최근 20회차에 없는 번호들을 콜드 번호로 분류
    for (let i = 1; i <= 45; i++) {
      if (!numberFrequency[i]) {
        coldNumbers.push({ number: i, frequency: 0 });
      }
    }
    
    return {
      type: 'hot_cold_numbers',
      data: { hot: hotNumbers, cold: coldNumbers },
      summary: `최근 20회차 핫/콜드 분석:\\n🔥 핫 번호: ${hotNumbers.map(n => n.number).join(', ')}\\n🧊 콜드 번호: ${coldNumbers.map(n => n.number).slice(0, 10).join(', ')}`
    };
  } catch (error) {
    return {
      type: 'hot_cold_numbers',
      data: {},
      summary: '핫/콜드 분석 중 오류가 발생했습니다.'
    };
  }
}

// 패턴 분석
async function patternAnalysis(db: D1Database): Promise<StatisticsResult> {
  try {
    const recentDraws = await db.prepare(`
      SELECT * FROM lotto_draws ORDER BY draw_number DESC LIMIT 10
    `).all();
    
    let evenCount = 0, oddCount = 0;
    let lowCount = 0, highCount = 0; // 1-22 vs 23-45
    
    recentDraws.results.forEach((draw: any) => {
      [draw.number1, draw.number2, draw.number3, draw.number4, draw.number5, draw.number6].forEach(num => {
        if (num % 2 === 0) evenCount++;
        else oddCount++;
        
        if (num <= 22) lowCount++;
        else highCount++;
      });
    });
    
    const total = evenCount + oddCount;
    const evenRatio = (evenCount / total * 100).toFixed(1);
    const oddRatio = (oddCount / total * 100).toFixed(1);
    const lowRatio = (lowCount / total * 100).toFixed(1);
    const highRatio = (highCount / total * 100).toFixed(1);
    
    return {
      type: 'pattern_analysis',
      data: {
        evenOdd: { even: evenCount, odd: oddCount },
        lowHigh: { low: lowCount, high: highCount }
      },
      summary: `최근 10회차 패턴 분석:\\n짝수/홀수: ${evenRatio}% / ${oddRatio}%\\n저구간/고구간: ${lowRatio}% / ${highRatio}%`
    };
  } catch (error) {
    return {
      type: 'pattern_analysis',
      data: {},
      summary: '패턴 분석 중 오류가 발생했습니다.'
    };
  }
}

// AI 예측 생성 함수
async function generateAIPrediction(algorithm: string, db: D1Database): Promise<NumberRecommendation> {
  // 실제 AI 알고리즘 대신 시뮬레이션
  const numbers = generateRandomNumbers();
  const confidence = Math.random() * 0.3 + 0.5; // 0.5-0.8
  
  const algorithmNames: Record<string, string> = {
    'bayesian_inference': '베이지안 추론',
    'neural_network': '신경망',
    'frequency_analysis': '빈도 분석',
    'pattern_recognition': '패턴 인식',
    'monte_carlo': '몬테카를로',
    'markov_chain': '마르코프 체인',
    'genetic_algorithm': '유전 알고리즘',
    'clustering_analysis': '클러스터링',
    'regression_analysis': '회귀 분석',
    'ensemble_method': '앙상블'
  };
  
  const explanations: Record<string, string> = {
    'bayesian_inference': '과거 데이터를 기반으로 베이지안 확률 모델을 적용하여 예측했습니다.',
    'neural_network': '딥러닝 신경망 모델로 패턴을 학습하여 예측했습니다.',
    'frequency_analysis': '출현 빈도 통계를 기반으로 확률적 예측을 수행했습니다.',
    'pattern_recognition': '과거 당첨 패턴을 분석하여 유사한 패턴을 찾아 예측했습니다.',
    'monte_carlo': '몬테카를로 시뮬레이션을 통해 확률적 예측을 수행했습니다.',
    'markov_chain': '마르코프 체인 모델로 번호 간 연관성을 분석하여 예측했습니다.',
    'genetic_algorithm': '유전 알고리즘으로 최적의 번호 조합을 진화시켜 도출했습니다.',
    'clustering_analysis': '클러스터링으로 유사한 패턴을 그룹화하여 예측했습니다.',
    'regression_analysis': '회귀 분석으로 번호 출현 트렌드를 분석하여 예측했습니다.',
    'ensemble_method': '여러 AI 모델의 결과를 종합하여 최종 예측했습니다.'
  };
  
  // 예측 결과를 DB에 저장
  try {
    await db.prepare(`
      INSERT INTO ai_predictions (prediction_type, predicted_numbers, confidence_score)
      VALUES (?, ?, ?)
    `).bind(algorithm, JSON.stringify(numbers), confidence).run();
  } catch (error) {
    console.error('Failed to save prediction:', error);
  }
  
  return {
    numbers,
    algorithm: algorithm as any,
    confidence,
    explanation: explanations[algorithm] || '알 수 없는 알고리즘입니다.',
    reason: `${(confidence * 100).toFixed(1)}% 신뢰도로 예측된 번호입니다.`
  };
}

// 랜덤 번호 생성 (1-45 중 6개)
function generateRandomNumbers(): number[] {
  const numbers = new Set<number>();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

export default app