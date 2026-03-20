/**
 * 관리자 모듈
 */

let adminPassword = '';

// ============================================
// 페이지 로드 시 세션 복원
// ============================================
(function restoreAdminSession() {
  const saved = sessionStorage.getItem('tarot-admin-pw');
  if (saved) {
    adminPassword = saved;
    // DOM 로드 후 자동 로그인 처리
    document.addEventListener('DOMContentLoaded', function() {
      const loginSection = document.getElementById('admin-login');
      const dashboard = document.getElementById('admin-dashboard');
      if (loginSection && dashboard) {
        loginSection.classList.remove('active');
        loginSection.classList.add('hidden');
        dashboard.classList.remove('hidden');
        dashboard.classList.add('active');
        initAdminDashboard();
      }
    });
  }
})();

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
      // 세션에 저장 (탭이 열려있는 동안 유지)
      sessionStorage.setItem('tarot-admin-pw', password);

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
// 관리자 로그아웃
// ============================================
function adminLogout() {
  adminPassword = '';
  sessionStorage.removeItem('tarot-admin-pw');
  document.getElementById('admin-dashboard').classList.remove('active');
  document.getElementById('admin-dashboard').classList.add('hidden');
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-login').classList.add('active');
  document.getElementById('admin-password').value = '';
  showToast('로그아웃 되었습니다', 'info');
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
// 의뢰 목록 불러오기
// ============================================
function loadRequestList() {
  const container = document.getElementById('request-list');
  if (!container) return;

  let requests = [];
  try {
    const raw = localStorage.getItem('tarot-requests');
    if (raw) requests = JSON.parse(raw);
  } catch (e) {
    requests = [];
  }

  if (!requests || requests.length === 0) {
    container.innerHTML = '<p class="empty-message">접수된 의뢰가 없습니다.<br>일반 페이지에서 의뢰를 접수하면 여기에 표시됩니다.</p>';
    return;
  }

  let html = '';
  for (let i = 0; i < requests.length; i++) {
    const req = requests[i];
    const statusText = req.status === 'done' ? '✅ 완료' : '⏳ 대기';
    const dateStr = req.date ? formatDate(req.date) : '날짜 없음';

    html += '<div class="journal-entry">';
    html += '  <div class="journal-date">' + dateStr + '</div>';
    html += '  <span class="journal-spread">' + statusText + '</span>';
    html += '  <div style="margin:0.5rem 0;"><strong>📧 이메일:</strong> ' + (req.email || '없음') + '</div>';
    html += '  <div style="margin:0.5rem 0;"><strong>❓ 질문:</strong> ' + (req.question || '없음') + '</div>';
    html += '  <div style="margin:0.5rem 0;"><strong>🃏 스프레드:</strong> ' + (req.spread || '전문가 추천') + '</div>';

    // 프롬프트 영역
    html += '  <div id="prompt-area-' + req.id + '" class="hidden" style="margin:0.75rem 0;">';
    html += '    <textarea id="prompt-text-' + req.id + '" class="prompt-textarea" rows="12"></textarea>';
    html += '    <div style="display:flex; gap:0.5rem; margin-top:0.5rem; flex-wrap:wrap;">';
    html += '      <button class="btn btn-secondary btn-sm" onclick="copyRequestPrompt(' + req.id + ')">📋 프롬프트 복사</button>';
    html += '      <button class="btn btn-primary btn-sm" onclick="executeRequestAI(' + req.id + ')">🤖 AI 분석 실행</button>';
    html += '    </div>';
    html += '    <div id="ai-result-' + req.id + '" class="hidden" style="margin-top:0.75rem;"></div>';
    html += '  </div>';

    html += '  <div class="journal-actions">';
    html += '    <button class="btn btn-primary btn-sm" onclick="generateRequestPrompt(' + req.id + ')">📝 프롬프트 생성</button>';
    if (req.status !== 'done') {
      html += '    <button class="btn btn-secondary btn-sm" onclick="markRequestDone(' + req.id + ')">✅ 완료</button>';
    }
    html += '    <button class="btn btn-secondary btn-sm" onclick="deleteRequest(' + req.id + ')">🗑️ 삭제</button>';
    html += '  </div>';
    html += '</div>';
  }

  container.innerHTML = html;
}

// ============================================
// 의뢰 상태 변경 / 삭제
// ============================================
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

  if (!currentPw) {
    showToast('현재 비밀번호를 입력하세요', 'error');
    return;
  }

  if (currentPw !== adminPassword) {
    showToast('현재 비밀번호가 틀렸습니다', 'error');
    return;
  }

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

// ============================================
// 의뢰용 프롬프트 생성
// ============================================
function generateRequestPrompt(requestId) {
  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
  const req = requests.find(function(r) { return r.id === requestId; });
  if (!req) {
    showToast('의뢰를 찾을 수 없습니다', 'error');
    return;
  }

  // 스프레드에 따라 카드 수 결정
  let spreadGuide = '';
  let cardCount = 3;
  const spread = req.spread || '전문가 추천';

  if (spread === 'one-card' || spread === '원카드') {
    spreadGuide = '원카드 (1장) 스프레드';
    cardCount = 1;
  } else if (spread === 'three-card' || spread === '쓰리카드') {
    spreadGuide = '쓰리카드 (3장) 스프레드 — 과거/현재/미래';
    cardCount = 3;
  } else if (spread === 'celtic-cross' || spread === '켈틱 크로스') {
    spreadGuide = '켈틱 크로스 (10장) 스프레드';
    cardCount = 10;
  } else {
    spreadGuide = '쓰리카드 (3장) 스프레드 — 상황/장애물/조언 (전문가 추천)';
    cardCount = 3;
  }

  // 랜덤 카드 뽑기
  const allCards = getAllCards();
  const shuffled = shuffleArray(allCards);
  const drawnCards = [];

  for (let i = 0; i < cardCount && i < shuffled.length; i++) {
    const card = shuffled[i];
    const reversed = Math.random() < 0.3;
    drawnCards.push({
      name: card.name,
      nameEn: card.nameEn,
      reversed: reversed,
      keywords: reversed ? card.reversed.keywords : card.upright.keywords,
      meaning: reversed ? card.reversed.meaning : card.upright.meaning
    });
  }

  // 포지션 라벨
  let positionLabels = [];
  if (cardCount === 1) {
    positionLabels = ['핵심 메시지'];
  } else if (cardCount === 3) {
    if (spread === 'three-card' || spread === '쓰리카드') {
      positionLabels = ['과거', '현재', '미래'];
    } else {
      positionLabels = ['상황', '장애물', '조언'];
    }
  } else if (cardCount === 10) {
    positionLabels = ['현재 상황', '도전/장애물', '의식적 목표', '무의식적 기반',
                      '과거', '가까운 미래', '자기 자신', '주변 환경',
                      '희망과 두려움', '최종 결과'];
  }

  // 카드 상세 텍스트
  let cardDetails = '';
  let cardKeywords = '';
  for (let i = 0; i < drawnCards.length; i++) {
    const c = drawnCards[i];
    const dir = c.reversed ? '역방향' : '정방향';
    const label = positionLabels[i] || ('카드 ' + (i + 1));
    cardDetails += '[' + label + '] ' + c.name + ' (' + c.nameEn + ') — ' + dir + '\n';
    cardKeywords += '  ' + c.name + '(' + dir + '): ' + c.keywords.join(', ') + '\n';
  }

  // 프롬프트 생성
  const prompt = '당신은 20년 이상의 경력을 가진 전문 타로 리더입니다.\n' +
    '따뜻하고 통찰력 있는 해석을 제공해 주세요.\n\n' +
    '=== 의뢰인 정보 ===\n' +
    '이메일: ' + (req.email || '미제공') + '\n' +
    '의뢰 날짜: ' + (req.date ? formatDate(req.date) : '미제공') + '\n\n' +
    '=== 질문 ===\n' +
    (req.question || '구체적인 질문 없음 — 전반적인 운세와 조언을 부탁드립니다.') + '\n\n' +
    '=== 스프레드 ===\n' +
    spreadGuide + '\n\n' +
    '=== 선택된 카드 ===\n' +
    cardDetails + '\n' +
    '=== 카드 키워드 참고 ===\n' +
    cardKeywords + '\n' +
    '=== 분석 요청 ===\n' +
    '1. 각 카드의 위치별 의미를 상세히 해석해 주세요.\n' +
    '2. 카드들 간의 관계와 전체적인 흐름을 설명해 주세요.\n' +
    '3. 의뢰인의 질문에 대한 구체적이고 실용적인 조언을 제공해 주세요.\n' +
    '4. 주의할 점이나 참고사항도 포함해 주세요.\n' +
    '5. 긍정적이고 건설적인 마무리 메시지를 포함해 주세요.\n\n' +
    '한국어로 작성하고, 마크다운 형식(##, **, - 등)을 사용해 주세요.\n' +
    '"AI"나 "인공지능"이라는 단어는 절대 사용하지 마세요.\n' +
    '전문 타로 리더의 관점에서 자연스럽고 따뜻하게 해석해 주세요.\n' +
    '의뢰인에게 보내는 편지 형식으로 작성하면 좋겠습니다.';

  // 프롬프트 표시
  const promptArea = document.getElementById('prompt-area-' + requestId);
  const promptText = document.getElementById('prompt-text-' + requestId);

  if (promptArea && promptText) {
    promptText.value = prompt;
    promptArea.classList.remove('hidden');

    // 뽑힌 카드 정보를 의뢰에 저장
    const allRequests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
    const targetReq = allRequests.find(function(r) { return r.id === requestId; });
    if (targetReq) {
      targetReq.drawnCards = drawnCards;
      targetReq.positionLabels = positionLabels;
      localStorage.setItem('tarot-requests', JSON.stringify(allRequests));
    }

    showToast('프롬프트가 생성되었습니다! 수정 후 복사하거나 AI 분석을 실행하세요.', 'success');
  }
}

// ============================================
// 의뢰 프롬프트 복사
// ============================================
function copyRequestPrompt(requestId) {
  const promptText = document.getElementById('prompt-text-' + requestId);
  if (!promptText) return;

  promptText.select();
  navigator.clipboard.writeText(promptText.value).then(function() {
    showToast('프롬프트가 복사되었습니다! 📋', 'success');
  }).catch(function() {
    document.execCommand('copy');
    showToast('프롬프트가 복사되었습니다! 📋', 'success');
  });
}

// ============================================
// 의뢰 AI 분석 실행
// ============================================
async function executeRequestAI(requestId) {
  const promptText = document.getElementById('prompt-text-' + requestId);
  const resultArea = document.getElementById('ai-result-' + requestId);

  if (!promptText || !promptText.value.trim()) {
    showToast('프롬프트가 비어있습니다', 'error');
    return;
  }

  if (!adminPassword) {
    showToast('관리자 인증이 필요합니다', 'error');
    return;
  }

  showLoading('AI가 분석 중입니다... 🔮\n잠시만 기다려주세요 (최대 30초)');

  try {
    const response = await fetch(WORKER_URL + '/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: adminPassword,
        prompt: promptText.value
      })
    });

    const data = await response.json();
    hideLoading();

    if (data.success) {
      resultArea.classList.remove('hidden');
      resultArea.innerHTML = '' +
        '<div class="ai-result-content">' +
        '  <h4 style="color:var(--primary-color); margin-bottom:0.5rem;">🤖 AI 분석 결과</h4>' +
        '  <div id="ai-result-text-' + requestId + '">' + formatMarkdown(data.analysis) + '</div>' +
        '</div>' +
        '<div style="display:flex; gap:0.5rem; margin-top:0.75rem; flex-wrap:wrap;">' +
        '  <button class="btn btn-secondary btn-sm" onclick="copyRequestResult(' + requestId + ')">📋 결과 복사</button>' +
        '  <button class="btn btn-secondary btn-sm" onclick="copyResultAsEmail(' + requestId + ')">📧 이메일용 복사</button>' +
        '</div>';

      // 의뢰 상태에 분석 완료 표시
      const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
      const req = requests.find(function(r) { return r.id === requestId; });
      if (req) {
        req.aiResult = data.analysis;
        req.aiDate = new Date().toISOString();
        localStorage.setItem('tarot-requests', JSON.stringify(requests));
      }

      showToast('AI 분석이 완료되었습니다!', 'success');
    } else {
      showToast('분석 실패: ' + (data.error || '알 수 없는 오류'), 'error');
    }
  } catch (err) {
    hideLoading();
    showToast('오류: ' + err.message, 'error');
  }
}

// ============================================
// AI 결과 복사
// ============================================
function copyRequestResult(requestId) {
  const resultEl = document.getElementById('ai-result-text-' + requestId);
  if (!resultEl) return;

  const text = resultEl.innerText;
  navigator.clipboard.writeText(text).then(function() {
    showToast('분석 결과가 복사되었습니다!', 'success');
  }).catch(function() {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('분석 결과가 복사되었습니다!', 'success');
  });
}

// ============================================
// 이메일용 복사
// ============================================
function copyResultAsEmail(requestId) {
  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');
  const req = requests.find(function(r) { return r.id === requestId; });
  const resultEl = document.getElementById('ai-result-text-' + requestId);

  if (!req || !resultEl) {
    showToast('데이터를 찾을 수 없습니다', 'error');
    return;
  }

  const analysisText = resultEl.innerText;

  const emailBody = '안녕하세요,\n\n' +
    '요청하신 타로 리딩 분석 결과를 보내드립니다.\n\n' +
    '═══════════════════════════════\n' +
    '📮 질문: ' + (req.question || '전반적인 운세') + '\n' +
    '🃏 스프레드: ' + (req.spread || '전문가 추천') + '\n' +
    '═══════════════════════════════\n\n' +
    analysisText + '\n\n' +
    '═══════════════════════════════\n' +
    '본 리딩은 참고용이며, 중요한 의사결정의 근거로 사용해서는 안 됩니다.\n' +
    '감사합니다. 🔮';

  navigator.clipboard.writeText(emailBody).then(function() {
    showToast('이메일용 내용이 복사되었습니다! 📧', 'success');
  }).catch(function() {
    var textarea = document.createElement('textarea');
    textarea.value = emailBody;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('이메일용 내용이 복사되었습니다! 📧', 'success');
  });
}
