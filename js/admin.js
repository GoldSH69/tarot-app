/**
 * 관리자 모듈
 */

// ============================================
// 관리자 로그인
// ============================================
async function adminLogin() {
  const passwordInput = document.getElementById('admin-password');
  const errorText = document.getElementById('admin-login-error');
  const password = passwordInput.value;

  if (!password) {
    errorText.textContent = '비밀번호를 입력하세요';
    errorText.classList.remove('hidden');
    return;
  }

  showLoading('인증 중...');

  try {
    const response = await fetch(`${WORKER_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await response.json();
    hideLoading();

    if (data.success) {
      adminPassword = password;

      document.getElementById('admin-login').classList.remove('active');
      document.getElementById('admin-login').classList.add('hidden');
      document.getElementById('admin-dashboard').classList.remove('hidden');
      document.getElementById('admin-dashboard').classList.add('active');

      initAdminDashboard();
      showToast('관리자 인증 성공!', 'success');
    } else {
      errorText.textContent = data.error || '인증 실패';
      errorText.classList.remove('hidden');
      passwordInput.value = '';
      passwordInput.focus();
    }
  } catch (err) {
    hideLoading();
    errorText.textContent = `서버 연결 실패: ${err.message}`;
    errorText.classList.remove('hidden');
  }
}

// ============================================
// 관리자 대시보드 초기화
// ============================================
function initAdminDashboard() {
  initAICardSelector();
  loadSavedGistId();
  loadRequestList();
}

// ============================================
// AI 카드 선택기 초기화
// ============================================
function initAICardSelector() {
  const selector = document.getElementById('ai-card-selector');
  if (!selector) return;

  const allCards = getAllCards();

  selector.innerHTML = allCards.map(card => `
    <div class="ai-card-option" data-card-id="${card.id}" data-reversed="false"
         onclick="toggleAICardSelection(this)">
      ${card.name}
    </div>
  `).join('');
}

function toggleAICardSelection(el) {
  if (el.classList.contains('selected')) {
    // 이미 선택됨 → 토글: 역방향/해제
    if (el.dataset.reversed === 'false') {
      el.dataset.reversed = 'true';
      el.textContent = el.textContent.replace(' ☀️', '') + ' 🔄';
    } else {
      el.classList.remove('selected');
      el.dataset.reversed = 'false';
      const card = findCardById(el.dataset.cardId);
      el.textContent = card.name;
    }
  } else {
    el.classList.add('selected');
    el.dataset.reversed = 'false';
    el.textContent = el.textContent + ' ☀️';
  }

  renderAISelectedCards();
}

function renderAISelectedCards() {
  const container = document.getElementById('ai-selected-cards');
  const selectedEls = document.querySelectorAll('.ai-card-option.selected');

  container.innerHTML = Array.from(selectedEls).map(el => {
    const card = findCardById(el.dataset.cardId);
    const dir = el.dataset.reversed === 'true' ? '역방향 🔄' : '정방향 ☀️';
    return `<span class="ai-selected-tag">${card.name} (${dir})</span>`;
  }).join('');
}

// ============================================
// 저장된 Gist ID 불러오기
// ============================================
function loadSavedGistId() {
  const saved = localStorage.getItem('tarot-gist-id');
  if (saved) {
    const input = document.getElementById('gist-id');
    if (input) input.value = saved;
  }
}

// ============================================
// 의뢰 목록 불러오기
// ============================================
function loadRequestList() {
  const container = document.getElementById('request-list');
  if (!container) return;

  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');

  if (requests.length === 0) {
    container.innerHTML = '<p class="empty-message">접수된 의뢰가 없습니다.</p>';
    return;
  }

  container.innerHTML = requests.map(req => `
    <div class="journal-entry">
      <div class="journal-date">${formatDate(req.date)}</div>
      <span class="journal-spread">${req.status === 'pending' ? '⏳ 대기' : '✅ 완료'}</span>
      <div class="journal-question">📧 ${req.email}</div>
      <div style="margin: 0.5rem 0; font-size: 0.9rem;">${req.question}</div>
      ${req.spread ? `<div class="journal-card-badge">${req.spread}</div>` : ''}
      <div class="journal-actions">
                <button class="btn btn-secondary btn-sm" onclick="markRequestDone(${req.id})">✅ 완료</button>
                <button class="btn btn-secondary btn-sm" onclick="deleteRequest(${req.id})">🗑️ 삭제</button>
      </div>
    </div>
  `).join('');
}

function analyzeRequest(requestId) {
  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
  const req = requests.find(r => r.id === requestId);
  if (!req) return;

  // AI 분석 탭으로 이동하고 질문 채우기
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-admin-tab="analyze"]').classList.add('active');
  document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('admin-tab-analyze').classList.add('active');

  document.getElementById('ai-question').value = req.question;
  document.getElementById('ai-context').value = `의뢰인 이메일: ${req.email}\n선호 스프레드: ${req.spread || '없음'}`;

  showToast('의뢰 내용이 AI 분석 탭에 입력되었습니다. 카드를 선택하고 분석하세요.', 'info');
}

function markRequestDone(requestId) {
  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
  const req = requests.find(r => r.id === requestId);
  if (req) {
    req.status = 'done';
    localStorage.setItem('tarot-requests', JSON.stringify(requests));
    loadRequestList();
    showToast('의뢰가 완료 처리되었습니다', 'success');
  }
}

function deleteRequest(requestId) {
  if (!confirm('이 의뢰를 삭제하시겠습니까?')) return;

  let requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
  requests = requests.filter(r => r.id !== requestId);
  localStorage.setItem('tarot-requests', JSON.stringify(requests));
  loadRequestList();
  showToast('의뢰가 삭제되었습니다', 'info');
}
