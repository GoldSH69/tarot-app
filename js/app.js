/**
 * 메인 앱 로직
 * 페이지 네비게이션, 토스트, 공통 유틸리티
 */

// ============================================
// ★★★ Cloudflare Worker URL — 여기만 수정! ★★★
// ============================================
const WORKER_URL = 'https://tarot-api.ashywindy.workers.dev';

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
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
        c.classList.remove('active');
        c.classList.add('hidden');
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
// 이메일 의뢰 (수정: localStorage 저장 강화)
// ============================================
function submitRequest(event) {
  event.preventDefault();
  const email = document.getElementById('request-email').value;
  const question = document.getElementById('request-question').value;
  const spread = document.getElementById('request-spread').value;

  // 로컬 저장
  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
  const newRequest = {
    id: Date.now(),
    email,
    question,
    spread: spread || '전문가 추천',
    date: new Date().toISOString(),
    status: 'pending'
  };
  requests.unshift(newRequest);
  localStorage.setItem('tarot-requests', JSON.stringify(requests));

  // mailto 링크
  const subject = encodeURIComponent('[타로 리딩 의뢰] 전문가 분석 요청');
  const body = encodeURIComponent(
    `안녕하세요, 타로 리딩을 의뢰드립니다.\n\n` +
    `이메일: ${email}\n` +
    `질문: ${question}\n` +
    `선호 스프레드: ${spread || '전문가 추천'}\n` +
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
    'spirit-tarot': '영타로'
  };
  return names[type] || type;
}

function getPositionLabels(spreadType) {
  const labels = {
    'one-card': ['현재 상황/답변'],
    'three-past-present-future': ['과거', '현재', '미래'],
    'three-situation-obstacle-advice': ['상황', '장애물', '조언'],
    'three-mind-action-result': ['마음', '행동', '결과'],
    'spirit-tarot': ['첫 번째 메시지', '두 번째 메시지', '세 번째 메시지']
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
