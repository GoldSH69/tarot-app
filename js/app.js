// ========================================
// app.js - 메인 앱 로직
// ========================================

const WORKER_URL = 'https://tarot-api.ashywindy.workers.dev';
// ↑ 실제 Worker URL로 교체

// ========================================
// 페이지 네비게이션
// ========================================
let currentPage = 'home';

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const pageEl = document.getElementById(`page-${page}`);
  const navBtn = document.querySelector(`.nav-btn[data-page="${page}"]`);

  if (pageEl) pageEl.classList.add('active');
  if (navBtn) navBtn.classList.add('active');

  currentPage = page;

  // 페이지별 초기화
  switch (page) {
    case 'home': initHome(); break;
    case 'study': initStudy(); break;
    case 'reading': initReading(); break;
    case 'journal': initJournal(); break;
  }

  window.scrollTo(0, 0);
}

// ========================================
// 홈 페이지
// ========================================
function initHome() {
  updateStudyProgressHome();
  updateJournalCountHome();
}

function updateStudyProgressHome() {
  const studied = JSON.parse(localStorage.getItem('tarot-studied') || '[]');
  const total = 78;
  const el = document.getElementById('study-progress-home');
  if (el) {
    const pct = Math.round((studied.length / total) * 100);
    el.innerHTML = `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div><span>${studied.length}/${total} (${pct}%)</span>`;
  }
}

function updateJournalCountHome() {
  const journal = JSON.parse(localStorage.getItem('tarot-journal') || '[]');
  const el = document.getElementById('journal-count-home');
  if (el) {
    el.textContent = `${journal.length}건의 기록`;
  }
}

// ========================================
// 오늘의 카드
// ========================================
function drawDailyCard() {
  const allCards = getAllCards();
  const today = new Date().toDateString();
  const saved = localStorage.getItem('tarot-daily');

  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.date === today) {
      showDailyCard(parsed.card, parsed.reversed);
      return;
    }
  }

  const card = allCards[Math.floor(Math.random() * allCards.length)];
  const reversed = Math.random() > 0.5;

  localStorage.setItem('tarot-daily', JSON.stringify({
    date: today,
    card: card,
    reversed: reversed
  }));

  showDailyCard(card, reversed);
}

function showDailyCard(card, reversed) {
  const container = document.getElementById('daily-card-result');
  const direction = reversed ? '역방향' : '정방향';
  const meaning = reversed ? card.reversed : card.upright;
  const imageUrl = getCardImageUrl(card);

  container.innerHTML = `
    <div class="daily-card-display">
      <div class="daily-card-image ${reversed ? 'reversed' : ''}">
        <img src="${imageUrl}" alt="${card.name}" onerror="this.outerHTML=createCardPlaceholder(findCardById('${card.id}'))">
      </div>
      <div class="daily-card-info">
        <h3>${card.name} <span class="card-name-en">${card.nameEn}</span></h3>
        <span class="badge badge-${reversed ? 'reversed' : 'upright'}">${direction}</span>
        <div class="card-keywords">
          ${meaning.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
        </div>
        <p class="card-meaning">${meaning.meaning}</p>
        <button class="btn-ai-analysis" onclick="openAIAnalysis('daily', [{card: window._dailyCardData.card, reversed: window._dailyCardData.reversed, position: '오늘의 메시지'}], '오늘 하루에 대한 조언')">
          🤖 AI 분석
        </button>
      </div>
    </div>
  `;

  // AI 분석용 데이터 저장
  window._dailyCardData = { card, reversed };
}

// ========================================
// 의뢰 제출
// ========================================
function submitRequest(event) {
  event.preventDefault();

  const name = document.getElementById('req-name').value.trim();
  const email = document.getElementById('req-email').value.trim();
  const type = document.getElementById('req-type').value;
  const question = document.getElementById('req-question').value.trim();

  if (!name || !email || !question) {
    showToast('모든 항목을 입력해주세요', 'error');
    return;
  }

  const request = {
    id: 'req-' + Date.now(),
    name,
    email,
    type,
    question,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // localStorage에 의뢰 저장
  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
  requests.unshift(request);
  localStorage.setItem('tarot-requests', JSON.stringify(requests));

  showToast('의뢰가 제출되었습니다! 관리자가 확인 후 분석해드립니다.', 'success');
  document.getElementById('request-form').reset();
}

// ========================================
// AI 분석 모달 (일반 화면용)
// ========================================
let aiAnalysisData = {};

function openAIAnalysis(spreadType, cards, question) {
  aiAnalysisData = { spreadType, cards, question };

  // 모달 표시
  document.getElementById('ai-analysis-modal').style.display = 'flex';

  // Step 1: 비밀번호 입력으로 시작
  showAIStep('password');

  // 비밀번호 입력란 포커스
  setTimeout(() => {
    const pwInput = document.getElementById('ai-password');
    if (pwInput) pwInput.focus();
  }, 100);
}

function closeAIModal() {
  document.getElementById('ai-analysis-modal').style.display = 'none';
  document.getElementById('ai-password').value = '';
  showAIStep('password');
}

function showAIStep(step) {
  ['password', 'prompt', 'result', 'loading'].forEach(s => {
    const el = document.getElementById(`ai-step-${s}`);
    if (el) el.style.display = (s === step) ? 'block' : 'none';
  });
}

async function verifyAIPassword() {
  const password = document.getElementById('ai-password').value;
  if (!password) {
    showToast('비밀번호를 입력하세요', 'error');
    return;
  }

  try {
    showAIStep('loading');

    const res = await fetch(`${WORKER_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (data.success) {
      aiAnalysisData.password = password;

      // 프롬프트 생성
      const prompt = generateAIPrompt(aiAnalysisData);
      document.getElementById('ai-prompt-text').value = prompt;

      showAIStep('prompt');
    } else {
      showAIStep('password');
      showToast('비밀번호가 틀립니다', 'error');
    }
  } catch (err) {
    showAIStep('password');
    showToast('서버 연결 실패: ' + err.message, 'error');
  }
}

function generateAIPrompt(data) {
  const { spreadType, cards, question } = data;

  let spreadName = '';
  switch (spreadType) {
    case 'daily': spreadName = '오늘의 카드 (원카드)'; break;
    case 'onecard': spreadName = '원카드 리딩'; break;
    case 'threecard-time': spreadName = '쓰리카드 (과거/현재/미래)'; break;
    case 'threecard-situation': spreadName = '쓰리카드 (상황/원인/조언)'; break;
    case 'threecard-mind': spreadName = '쓰리카드 (의식/무의식/조언)'; break;
    case 'spirit': spreadName = '영타로 (3장)'; break;
    default: spreadName = spreadType; break;
  }

  let cardInfo = cards.map((c, i) => {
    const card = c.card;
    const dir = c.reversed ? '역방향' : '정방향';
    const meaning = c.reversed ? card.reversed : card.upright;
    return `${i + 1}. [${c.position || '카드 ' + (i + 1)}] ${card.name} (${card.nameEn}) - ${dir}
   키워드: ${meaning.keywords.join(', ')}
   기본 의미: ${meaning.meaning}`;
  }).join('\n\n');

  let prompt = `당신은 20년 경력의 전문 타로 리더입니다.
아래 타로 리딩 결과를 전문적으로 분석해주세요.

===== 리딩 정보 =====
• 스프레드: ${spreadName}
• 질문/주제: ${question || '일반 운세'}

===== 뽑은 카드 =====
${cardInfo}

===== 분석 요청 =====
1. 각 카드의 위치별 상세 해석
2. 카드들 간의 관계와 흐름 분석
3. 질문에 대한 종합적인 답변
4. 구체적인 조언과 행동 지침
5. 주의할 점이나 숨겨진 메시지

전문적이면서도 따뜻한 어조로, 한국어로 답변해주세요.
마크다운 형식으로 작성해주세요.`;

  return prompt;
}

function copyAIPrompt() {
  const text = document.getElementById('ai-prompt-text').value;
  navigator.clipboard.writeText(text).then(() => {
    showToast('프롬프트가 클립보드에 복사되었습니다', 'success');
  }).catch(() => {
    // fallback
    const ta = document.getElementById('ai-prompt-text');
    ta.select();
    document.execCommand('copy');
    showToast('프롬프트가 복사되었습니다', 'success');
  });
}

async function executeAIAnalysis() {
  const prompt = document.getElementById('ai-prompt-text').value;
  const password = aiAnalysisData.password;

  if (!prompt || !password) {
    showToast('프롬프트 또는 인증 정보가 없습니다', 'error');
    return;
  }

  showAIStep('loading');

  try {
    const res = await fetch(`${WORKER_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, prompt })
    });

    const data = await res.json();

    if (data.success) {
      const resultHtml = formatMarkdown(data.result);
      document.getElementById('ai-result-content').innerHTML = resultHtml;
      aiAnalysisData.lastResult = data.result;
      showAIStep('result');
    } else {
      showAIStep('prompt');
      showToast('AI 분석 실패: ' + (data.message || '알 수 없는 오류'), 'error');
    }
  } catch (err) {
    showAIStep('prompt');
    showToast('서버 오류: ' + err.message, 'error');
  }
}

function copyAIResult() {
  const text = aiAnalysisData.lastResult || '';
  navigator.clipboard.writeText(text).then(() => {
    showToast('분석 결과가 복사되었습니다', 'success');
  }).catch(() => {
    showToast('복사에 실패했습니다', 'error');
  });
}

function goBackToPrompt() {
  showAIStep('prompt');
}

// 마크다운 → HTML 변환
function formatMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/### (.*)/g, '<h4>\$1</h4>')
    .replace(/## (.*)/g, '<h3>\$1</h3>')
    .replace(/# (.*)/g, '<h2>\$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>\$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>\$1</em>')
    .replace(/`(.*?)`/g, '<code>\$1</code>')
    .replace(/^- (.*)/gm, '<li>\$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>\$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.*)$/, '<p>\$1</p>');
}

// ========================================
// 토스트 알림
// ========================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }[type] || 'ℹ️';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ========================================
// 로딩 오버레이
// ========================================
function showLoading() {
  document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}

// ========================================
// 유틸리티
// ========================================
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function getSpreadName(type) {
  const names = {
    'onecard': '원카드',
    'threecard-time': '쓰리카드 (과거/현재/미래)',
    'threecard-situation': '쓰리카드 (상황/원인/조언)',
    'threecard-mind': '쓰리카드 (의식/무의식/조언)',
    'spirit': '영타로'
  };
  return names[type] || type;
}

function getPositionLabels(type) {
  const labels = {
    'onecard': ['메시지'],
    'threecard-time': ['과거', '현재', '미래'],
    'threecard-situation': ['상황', '원인', '조언'],
    'threecard-mind': ['의식', '무의식', '조언'],
    'spirit': ['첫 번째 메시지', '두 번째 메시지', '세 번째 메시지']
  };
  return labels[type] || ['카드'];
}

// ========================================
// 초기화
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initHome();
});
