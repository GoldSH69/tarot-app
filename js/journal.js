/**
 * 리딩 일지 모듈
 */

function getJournalEntries() {
  return JSON.parse(localStorage.getItem('tarot-journal') || '[]');
}

function renderJournalList() {
  const container = document.getElementById('journal-list');
  if (!container) return;

  const entries = getJournalEntries();

  if (entries.length === 0) {
    container.innerHTML = `
      <p class="empty-message">
        아직 저장된 리딩 일지가 없습니다.<br>
        카드 리딩 후 일지에 저장해 보세요! 📝
      </p>
    `;
    return;
  }

  container.innerHTML = entries.map(entry => {
    const cards = entry.cards.map(c => {
      const dir = (c.isReversed || c.reversed) ? '역' : '정';
      return `<span class="journal-card-badge">${c.name} (${dir})</span>`;
    }).join('');

    return `
      <div class="journal-entry" data-id="${entry.id}">
        <div class="journal-date">${formatDate(entry.date)}</div>
        <span class="journal-spread">${entry.spreadName || getSpreadName(entry.spreadType)}</span>
        ${entry.question ? `<div class="journal-question">❓ ${entry.question}</div>` : ''}
        <div class="journal-cards">${cards}</div>
        ${entry.memo ? `<div class="journal-memo">📝 ${entry.memo}</div>` : ''}
        <div class="journal-actions">
          <button class="btn btn-secondary btn-sm" onclick="editJournalMemo(${entry.id})">✏️ 메모 수정</button>
          <button class="btn btn-secondary btn-sm" onclick="deleteJournalEntry(${entry.id})">🗑️ 삭제</button>
        </div>
      </div>
    `;
  }).join('');
}

function editJournalMemo(entryId) {
  const entries = getJournalEntries();
  const entry = entries.find(e => e.id === entryId);
  if (!entry) return;

  const newMemo = prompt('메모를 수정하세요:', entry.memo || '');
  if (newMemo !== null) {
    entry.memo = newMemo;
    localStorage.setItem('tarot-journal', JSON.stringify(entries));
    renderJournalList();
    showToast('메모가 수정되었습니다', 'success');
  }
}

function deleteJournalEntry(entryId) {
  if (!confirm('이 리딩 일지를 삭제하시겠습니까?')) return;

  let entries = getJournalEntries();
  entries = entries.filter(e => e.id !== entryId);
  localStorage.setItem('tarot-journal', JSON.stringify(entries));
  renderJournalList();
  showToast('일지가 삭제되었습니다', 'info');
}

function exportJournal() {
  const entries = getJournalEntries();
  if (entries.length === 0) {
    showToast('내보낼 일지가 없습니다', 'info');
    return;
  }

  // JSON 형식
  const json = JSON.stringify(entries, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `tarot-journal-${new Date().toISOString().split('T')[0]}.json`;
  a.click();

  URL.revokeObjectURL(url);
  showToast('일지가 내보내기 되었습니다', 'success');
}
