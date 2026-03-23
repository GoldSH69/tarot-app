/**
 * GitHub Gist 동기화 모듈 (관리자 전용)
 * - GIST_ID는 Cloudflare Worker 환경변수에서 관리
 * - 프론트엔드에서는 ID 입력 불필요
 */

async function saveToGist() {
  if (!adminPassword) {
    showToast('먼저 로그인하세요', 'error');
    return;
  }

  const journal = JSON.parse(localStorage.getItem('tarot-journal') || '[]');
  const studied = JSON.parse(localStorage.getItem('tarot-studied') || '[]');
  const bookmarks = JSON.parse(localStorage.getItem('tarot-bookmarks') || '[]');
  const memos = JSON.parse(localStorage.getItem('tarot-memos') || '{}');
  const requests = JSON.parse(localStorage.getItem('tarot-requests') || '[]');

  const data = {
    journal,
    studied,
    bookmarks,
    memos,
    requests,
    exportDate: new Date().toISOString()
  };

  showLoading('Gist에 저장 중...');

  try {
    const response = await fetch(`${WORKER_URL}/api/gist/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: adminPassword,
        data
      })
    });

    const result = await response.json();
    hideLoading();

    if (result.success) {
      const syncResult = document.getElementById('sync-result');
      if (syncResult) {
        syncResult.classList.remove('hidden');
        syncResult.innerHTML = `
          <div style="padding:1rem; background:var(--card-bg); border-radius:8px; margin-top:1rem;">
            <p>✅ 저장 완료!</p>
            <p><strong>Gist ID:</strong> ${result.gistId}</p>
            <p><a href="${result.url}" target="_blank">Gist 보기 →</a></p>
            ${result.isNew ? `
              <div style="margin-top:0.5rem; padding:0.5rem; background:#fff3cd; border-radius:4px; color:#856404;">
                ⚠️ 새 Gist가 생성되었습니다!<br>
                Cloudflare 환경변수에 아래 값을 등록하세요:<br>
                <code style="background:#f8f9fa; padding:2px 6px; border-radius:3px; font-weight:bold;">
                  GIST_ID = ${result.gistId}
                </code>
              </div>
            ` : ''}
            <p style="font-size:0.8rem; color:var(--text-light); margin-top:0.5rem;">
              일지: ${data.journal.length}건 | 학습: ${data.studied.length}장 | 
              북마크: ${data.bookmarks.length}장 | 의뢰: ${data.requests.length}건
            </p>
          </div>
        `;
      }
      showToast('Gist에 저장되었습니다!', 'success');
    } else {
      showToast(`저장 실패: ${result.error}`, 'error');
    }
  } catch (err) {
    hideLoading();
    showToast(`오류: ${err.message}`, 'error');
  }
}

async function loadFromGist() {
  if (!adminPassword) {
    showToast('먼저 로그인하세요', 'error');
    return;
  }

  showLoading('Gist에서 불러오는 중...');

  try {
    const response = await fetch(`${WORKER_URL}/api/gist/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: adminPassword
      })
    });

    const result = await response.json();
    hideLoading();

    if (result.success) {
      const data = result.data;

      if (data.journal) localStorage.setItem('tarot-journal', JSON.stringify(data.journal));
      if (data.studied) localStorage.setItem('tarot-studied', JSON.stringify(data.studied));
      if (data.bookmarks) localStorage.setItem('tarot-bookmarks', JSON.stringify(data.bookmarks));
      if (data.memos) localStorage.setItem('tarot-memos', JSON.stringify(data.memos));
      if (data.requests) localStorage.setItem('tarot-requests', JSON.stringify(data.requests));

      const syncResult = document.getElementById('sync-result');
      if (syncResult) {
        syncResult.classList.remove('hidden');
        syncResult.innerHTML = `
          <div style="padding:1rem; background:var(--card-bg); border-radius:8px; margin-top:1rem;">
            <p>✅ 불러오기 완료!</p>
            <p>일지: ${data.journal?.length || 0}건</p>
            <p>학습: ${data.studied?.length || 0}장</p>
            <p>북마크: ${data.bookmarks?.length || 0}장</p>
            <p>메모: ${Object.keys(data.memos || {}).length}개</p>
            <p>의뢰: ${data.requests?.length || 0}건</p>
            <p style="font-size:0.8rem; color:var(--text-light);">
              내보낸 날짜: ${data.exportDate ? formatDate(data.exportDate) : '알 수 없음'}
            </p>
          </div>
        `;
      }

      showToast('Gist에서 데이터를 불러왔습니다!', 'success');
    } else {
      showToast(`불러오기 실패: ${result.error}`, 'error');
    }
  } catch (err) {
    hideLoading();
    showToast(`오류: ${err.message}`, 'error');
  }
}