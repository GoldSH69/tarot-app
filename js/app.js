/**
 * 메인 앱 로직
 * 페이지 네비게이션, 토스트, 공통 유틸리티
 */

// ============================================
// ★★★ API 서버 URL ★★★
// ============================================
const WORKER_URL = 'https://tarot-server-gcql.onrender.com';

// ============================================
// 최근 리딩 결과 저장 (의뢰 페이지 연동)
// ============================================
let lastReadingResult = null;

function setLastReadingResult(spreadType, cards, question) {
  lastReadingResult = {
    spreadType,
    cards,
    question,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('tarot-last-reading', JSON.stringify(lastReadingResult));
}

function getLastReadingResult() {
  if (lastReadingResult) return lastReadingResult;
  const saved = localStorage.getItem('tarot-last-reading');
  if (saved) {
    lastReadingResult = JSON.parse(saved);
    return lastReadingResult;
  }
  return null;
}

// ============================================
// 페이지 네비게이션
// ============================================
let currentPage = 'home';

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.add('active');
    currentPage = page;
  }
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  if (page === 'reading') backToSpreadSelection();
  if (page === 'study') initStudyPage();
  if (page === 'journal') renderJournalList();
  if (page === 'request') initRequestPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// ★ 의뢰 페이지 초기화 (C안: 카드 유무 분기)
// ============================================
function initRequestPage() {
  const reading = getLastReadingResult();
  const noCardsDiv = document.getElementById('request-no-cards');
  const withCardsDiv = document.getElementById('request-with-cards');

  if (!reading || !reading.cards || reading.cards.length === 0) {
    // 카드 없음 → 서비스 안내
    noCardsDiv.classList.remove('hidden');
    withCardsDiv.classList.add('hidden');
  } else {
    // 카드 있음 → 의뢰 폼
    noCardsDiv.classList.add('hidden');
    withCardsDiv.classList.remove('hidden');
    renderRequestCardPreview(reading);
    updateRequestPrice(reading);
    // 질문 자동 채우기
    const questionField = document.getElementById('request-question');
    if (questionField && reading.question && !questionField.value) {
      questionField.value = reading.question;
    }
  }
}

function renderRequestCardPreview(reading) {
  const container = document.getElementById('request-card-preview');
  if (!container) return;

  const labels = getPositionLabels(reading.spreadType);
  const spreadName = getSpreadName(reading.spreadType);

  let html = `<div class="request-preview-header">
    <span class="request-spread-badge">${spreadName}</span>
    <span class="request-preview-date">${formatDate(reading.timestamp)}</span>
  </div>`;
  html += '<div class="request-preview-cards">';

  reading.cards.forEach((card, i) => {
    const direction = card.isReversed ? '역방향' : '정방향';
    const dirClass = card.isReversed ? 'reversed' : 'upright';
    html += `
      <div class="request-preview-card">
        <span class="request-card-position">${labels[i] || `카드 ${i + 1}`}</span>
        <span class="request-card-name">${card.name}</span>
        <span class="request-card-dir ${dirClass}">${direction}</span>
      </div>`;
  });

  html += '</div>';
  container.innerHTML = html;
}

function updateRequestPrice(reading) {
  const priceDisplay = document.getElementById('request-price-display');
  if (!priceDisplay) return;

  const prices = {
    'one-card': { label: '원카드', price: '5,000원' },
    'three-past-present-future': { label: '쓰리카드', price: '8,000원' },
    'three-situation-obstacle-advice': { label: '쓰리카드', price: '8,000원' },
    'three-mind-action-result': { label: '쓰리카드', price: '8,000원' },
    'spirit-tarot': { label: '영타로(쓰리카드)', price: '8,000원' },
    'celtic-cross': { label: '켈틱크로스', price: '15,000원' }
  };

  const info = prices[reading.spreadType] || { label: '기본', price: '5,000원' };
  priceDisplay.innerHTML = `💰 ${info.label} 분석: <strong>${info.price}</strong>`;
}

// ============================================
// 이벤트 바인딩
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });
  document.querySelectorAll('.study-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.study-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCardGrid(btn.dataset.category);
    });
  });
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.admin-tab-content').forEach(c => {
        c.classList.remove('hidden');
        c.classList.add('active');
      });
      const target = document.getElementById(`admin-tab-${btn.dataset.adminTab}`);
      if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
      }
    });
  });
});

// ============================================
// 토스트 알림
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3000);
}

// ============================================
// 로딩 오버레이
// ============================================
function showLoading(message = '처리 중...') {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loading-overlay';
  overlay.innerHTML = `<div class="loading-spinner"></div><p>${message}</p>`;
  document.body.appendChild(overlay);
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) overlay.remove();
}

// ============================================
// 오늘의 카드
// ============================================
function drawDailyCard() {
  const today = new Date().toDateString();
  const saved = localStorage.getItem('tarot-daily-card');
  if (saved) {
    const data = JSON.parse(saved);
    if (data.date === today) {
      displayDailyCard(data.cardId, data.reversed);
      return;
    }
  }
  const allCards = getAllCards();
  const randomIndex = Math.floor(Math.random() * allCards.length);
  const card = allCards[randomIndex];
  const reversed = Math.random() < 0.3;
  localStorage.setItem('tarot-daily-card', JSON.stringify({ date: today, cardId: card.id, reversed }));
  displayDailyCard(card.id, reversed);
}

function displayDailyCard(cardId, reversed) {
  const card = findCardById(cardId);
  if (!card) return;
  const direction = reversed ? '역방향' : '정방향';
  const meaning = reversed ? card.reversed : card.upright;
  const imgClass = reversed ? 'reversed' : '';
  const container = document.getElementById('daily-card-result');
  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="result-card-item" style="margin: 1rem auto;">
      <img src="${getCardImageUrl(card)}" alt="${card.name}" class="${imgClass}"
           onerror="this.src='${createCardPlaceholder(card)}'">
      <div class="result-card-name">${card.name}</div>
      <div class="result-card-direction">${direction}</div>
    </div>
    <div class="result-guide" style="margin-top: 1rem;">
      <h4>✨ 오늘의 메시지</h4>
      <div class="keywords" style="margin-bottom: 0.5rem;">
        ${meaning.keywords.map(k => `<span class="keyword ${reversed ? 'reversed' : 'upright'}">${k}</span>`).join('')}
      </div>
      <p>${meaning.meaning}</p>
    </div>
  `;
}

// ============================================
// 이메일 의뢰 (★ 카드 정보 포함)
// ============================================
function submitRequest(event) {
  event.preventDefault();
  const email = document.getElementById('request-email').value;
  const question = document.getElementById('request-question').value;
  const depositor = document.getElementById('request-depositor')?.value || '';
  const reading = getLastReadingResult();

  if (!reading || !reading.cards || reading.cards.length === 0) {
    showToast('카드를 먼저 뽑아주세요.', 'error');
    return;
  }

  const spreadName = getSpreadName(reading.spreadType);
  const labels = getPositionLabels(reading.spreadType);
  const cardInfo = reading.cards.map((card, i) => {
    const dir = card.isReversed ? '역방향' : '정방향';
    return `${labels[i] || `카드 ${i + 1}`}: ${card.name} (${dir})`;
  }).join('\n');

  // 로컬 저장
  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
  const newRequest = {
    id: Date.now(),
    email,
    question,
    depositor,
    spread: spreadName,
    spreadType: reading.spreadType,
    cards: reading.cards,
    date: new Date().toISOString(),
    status: 'pending'
  };
  requests.unshift(newRequest);
  localStorage.setItem('tarot-requests', JSON.stringify(requests));

  // mailto 링크
  const subject = encodeURIComponent(`[타로 리딩 의뢰] ${spreadName} 분석 요청`);
  const body = encodeURIComponent(
    `안녕하세요, 타로 리딩을 의뢰드립니다.\n\n` +
    `이메일: ${email}\n` +
    `입금자명: ${depositor}\n` +
    `스프레드: ${spreadName}\n\n` +
    `=== 선택된 카드 ===\n${cardInfo}\n\n` +
    `=== 질문 ===\n${question}\n\n` +
    `날짜: ${new Date().toLocaleString('ko-KR')}`
  );
  window.open(`mailto:?subject=${subject}&body=${body}`);

  showToast('의뢰가 접수되었습니다!', 'success');
  document.getElementById('request-form').reset();
}

// ============================================
// 유틸리티
// ============================================
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function getSpreadName(type) {
  const names = {
    'one-card': '원카드',
    'three-past-present-future': '쓰리카드: 과거-현재-미래',
    'three-situation-obstacle-advice': '쓰리카드: 상황-장애물-조언',
    'three-mind-action-result': '쓰리카드: 마음-행동-결과',
    'spirit-tarot': '영타로',
    'celtic-cross': '켈틱크로스'
  };
  return names[type] || type;
}

function getPositionLabels(spreadType) {
  const labels = {
    'one-card': ['현재 상황/답변'],
    'three-past-present-future': ['과거', '현재', '미래'],
    'three-situation-obstacle-advice': ['상황', '장애물', '조언'],
    'three-mind-action-result': ['마음', '행동', '결과'],
    'spirit-tarot': ['첫 번째 메시지', '두 번째 메시지', '세 번째 메시지'],
    'celtic-cross': [
      '① 현재 상황',
      '② 도전/장애',
      '③ 의식/목표',
      '④ 무의식/기반',
      '⑤ 과거',
      '⑥ 가까운 미래',
      '⑦ 자신의 태도',
      '⑧ 주변 환경',
      '⑨ 희망과 두려움',
      '⑩ 최종 결과'
    ]
  };
  return labels[spreadType] || ['카드'];
}

// ============================================
// SHA-256 해시 (브라우저용)
// ============================================
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}