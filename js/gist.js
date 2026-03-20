/**
 * GitHub Gist 동기화 모듈 (관리자 전용)
 */

async function saveToGist() {
  if (!adminPassword) {
    showToast('먼저 로그인하세요', 'error');
    return;
  }

  const gistId = document.getElementById('gist-id').value.trim();
  const journal = JSON.parse(localStorage.getItem('tarot-journal') || '[]');
  const studied = JSON.parse(localStorage.getItem('tarot-studied') || '[]');
  const bookmarks = JSON.parse(localStorage.getItem('tarot-bookmarks') || '[]');
  const memos = JSON.parse(localStorage.getItem('tarot-memos') || '{}');

  const data = {
    journal,
    studied,
    bookmarks,
    memos,
    exportDate: new Date().toISOString()
  };

  showLoading('Gist에 저장 중...');

  try {
    const response = await fetch(`${WORKER_URL}/api/gist/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: adminPassword,
        data,
        gistId: gistId || null
      })
    });

    const result = await response.json();
    hideLoading();

    if (result.success) {
      document.getElementById('gist-id').value = result.gistId;

      const syncResult = document.getElementById('sync-result');
      syncResult.classList.remove('hidden');
      syncResult.innerHTML = `
        <div style="padding:1rem; background:var(--card-bg); border-radius:8px; margin-top:1rem;">
          <p>✅ 저장 완료!</p>
          <p><strong>Gist ID:</strong> ${result.gistId}</p>
          <p><a href="${result.url}" target="_blank">Gist 보기 →</a></p>
          <p style="font-size:0.8rem; color:var(--text-light);">다음에 불러오기를 위해 Gist ID를 기억해두세요.</p>
        </div>
      `;

      // Gist ID 로컬 저장
      localStorage.setItem('tarot-gist-id', result.gistId);
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

  const gistId = document.getElementById('gist-id').value.trim();
  if (!gistId) {
    showToast('Gist ID를 입력하세요', 'error');
    return;
  }

  showLoading('Gist에서 불러오는 중...');

  try {
    const response = await fetch(`${WORKER_URL}/api/gist/load`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: adminPassword,
        gistId
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

      localStorage.setItem('tarot-gist-id', gistId);

      const syncResult = document.getElementById('sync-result');
      syncResult.classList.remove('hidden');
      syncResult.innerHTML = `
        <div style="padding:1rem; background:var(--card-bg); border-radius:8px; margin-top:1rem;">
          <p>✅ 불러오기 완료!</p>
          <p>일지: ${data.journal?.length || 0}건</p>
          <p>학습: ${data.studied?.length || 0}장</p>
          <p>북마크: ${data.bookmarks?.length || 0}장</p>
          <p style="font-size:0.8rem;">내보낸 날짜: ${data.exportDate ? formatDate(data.exportDate) : '알 수 없음'}</p>
        </div>
      `;

      showToast('Gist에서 데이터를 불러왔습니다!', 'success');
    } else {
      showToast(`불러오기 실패: ${result.error}`, 'error');
    }
  } catch (err) {
    hideLoading();
    showToast(`오류: ${err.message}`, 'error');
  }
}
