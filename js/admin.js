/**
 * 관리자 모듈
 */

let adminPassword = '';

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
  loadSavedGistId();
  loadRequestList();
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
// 의뢰 목록 불러오기 (수정: 정상 작동하도록)
// ============================================
function loadRequestList() {
  const container = document.getElementById('request-list');
  if (!container) return;

  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');

  if (requests.length === 0) {
    container.innerHTML = '<p class="empty-message">접수된 의뢰가 없습니다.</p>';
    return;
  }

  container.innerHTML = requests.map(req => {
    const statusText = req.status === 'done' ? '✅ 완료' : '⏳ 대기';
    const statusClass = req.status === 'done' ? 'done' : 'pending';
    return `
      <div class="journal-entry">
        <div class="journal-date">${formatDate(req.date)}</div>
        <span class="journal-spread">${statusText}</span>
        <div style="margin: 0.5rem 0;">
          <strong>📧 이메일:</strong> ${req.email || '없음'}
        </div>
        <div style="margin: 0.5rem 0;">
          <strong>❓ 질문:</strong> ${req.question || '없음'}
        </div>
        <div style="margin: 0.5rem 0;">
          <strong>🃏 스프레드:</strong> ${req.spread || '전문가 추천'}
        </div>
        <div class="journal-actions">
          ${req.status !== 'done' ? `<button class="btn btn-primary btn-sm" onclick="markRequestDone(${req.id})">✅ 완료 처리</button>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="deleteRequest(${req.id})">🗑️ 삭제</button>
        </div>
      </div>
    `;
  }).join('');
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

// ============================================
// 비밀번호 변경 (해시 생성)
// ============================================
async function generateNewHash() {
  const currentPw = document.getElementById('current-password').value;
  const newPw = document.getElementById('new-password').value;
  const confirmPw = document.getElementById('new-password-confirm').value;

  // 현재 비밀번호 확인
  if (!currentPw) {
    showToast('현재 비밀번호를 입력하세요', 'error');
    return;
  }

  if (currentPw !== adminPassword) {
    showToast('현재 비밀번호가 틀렸습니다', 'error');
    return;
  }

  // 새 비밀번호 확인
  if (!newPw) {
    showToast('새 비밀번호를 입력하세요', 'error');
    return;
  }

  if (newPw.length < 4) {
    showToast('새 비밀번호는 4자 이상이어야 합니다', 'error');
    return;
  }

  if (newPw !== confirmPw) {
    showToast('새 비밀번호가 일치하지 않습니다', 'error');
    return;
  }

  // SHA-256 해시 생성
  const hash = await sha256(newPw);

  const resultDiv = document.getElementById('hash-result');
  const hashValue = document.getElementById('new-hash-value');

  hashValue.textContent = hash;
  resultDiv.classList.remove('hidden');

  showToast('해시가 생성되었습니다. Cloudflare에서 ADMIN_HASH를 업데이트하세요.', 'success');
}

function copyNewHash() {
  const hash = document.getElementById('new-hash-value').textContent;
  navigator.clipboard.writeText(hash).then(() => {
    showToast('해시가 복사되었습니다!', 'success');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = hash;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('해시가 복사되었습니다!', 'success');
  });
}

// ============================================
// 전체 데이터 관리
// ============================================
function exportAllData() {
  const data = {
    journal: JSON.parse(localStorage.getItem('tarot-journal') || '[]'),
    studied: JSON.parse(localStorage.getItem('tarot-studied') || '[]'),
    bookmarks: JSON.parse(localStorage.getItem('tarot-bookmarks') || '[]'),
    memos: JSON.parse(localStorage.getItem('tarot-memos') || '{}'),
    requests: JSON.parse(localStorage.getItem('tarot-requests') || '[]'),
    dailyCard: localStorage.getItem('tarot-daily-card'),
    gistId: localStorage.getItem('tarot-gist-id'),
    exportDate: new Date().toISOString()
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tarot-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('전체 데이터가 내보내기 되었습니다', 'success');
}

function clearAllData() {
  if (!confirm('⚠️ 모든 로컬 데이터를 삭제하시겠습니까?\n\n학습 진도, 일지, 북마크, 메모 등 모든 데이터가 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.')) return;
  if (!confirm('정말로 삭제하시겠습니까? 마지막 확인입니다.')) return;

  const keysToRemove = [
    'tarot-journal', 'tarot-studied', 'tarot-bookmarks',
    'tarot-memos', 'tarot-requests', 'tarot-daily-card',
    'tarot-gist-id', 'tarot-theme'
  ];
  keysToRemove.forEach(key => localStorage.removeItem(key));
  showToast('모든 데이터가 초기화되었습니다', 'info');
}
