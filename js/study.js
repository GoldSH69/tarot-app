/**
 * 카드 학습 모듈
 */

let currentStudyCategory = 'major';

function initStudyPage() {
  updateStudyProgress();
  renderCardGrid(currentStudyCategory);
}

// ============================================
// 학습 진도 관리
// ============================================
function getStudiedCards() {
  return JSON.parse(localStorage.getItem('tarot-studied') || '[]');
}

function toggleStudied(cardId) {
  let studied = getStudiedCards();
  if (studied.includes(cardId)) {
    studied = studied.filter(id => id !== cardId);
  } else {
    studied.push(cardId);
  }
  localStorage.setItem('tarot-studied', JSON.stringify(studied));
  updateStudyProgress();
  renderCardGrid(currentStudyCategory);
}

function updateStudyProgress() {
  const studied = getStudiedCards();
  const total = 78;
  const count = studied.length;
  const percent = Math.round((count / total) * 100);

  const text = document.getElementById('study-progress-text');
  const bar = document.getElementById('study-progress-bar');

  if (text) text.textContent = `학습 진도: ${count} / ${total}`;
  if (bar) bar.style.width = `${percent}%`;
}

// ============================================
// 북마크 관리
// ============================================
function getBookmarks() {
  return JSON.parse(localStorage.getItem('tarot-bookmarks') || '[]');
}

function toggleBookmark(cardId) {
  let bookmarks = getBookmarks();
  if (bookmarks.includes(cardId)) {
    bookmarks = bookmarks.filter(id => id !== cardId);
    showToast('북마크가 해제되었습니다', 'info');
  } else {
    bookmarks.push(cardId);
    showToast('북마크에 추가되었습니다 ⭐', 'success');
  }
  localStorage.setItem('tarot-bookmarks', JSON.stringify(bookmarks));
}

// ============================================
// 메모 관리
// ============================================
function getCardMemo(cardId) {
  const memos = JSON.parse(localStorage.getItem('tarot-memos') || '{}');
  return memos[cardId] || '';
}

function saveCardMemo(cardId, text) {
  const memos = JSON.parse(localStorage.getItem('tarot-memos') || '{}');
  if (text.trim()) {
    memos[cardId] = text.trim();
  } else {
    delete memos[cardId];
  }
  localStorage.setItem('tarot-memos', JSON.stringify(memos));
  showToast('메모가 저장되었습니다', 'success');
}

// ============================================
// 카드 그리드 렌더링
// ============================================
function renderCardGrid(category) {
  currentStudyCategory = category;
  const grid = document.getElementById('card-grid');
  if (!grid) return;

  let cards = getCardsByCategory(category);

  // 검색 필터
  const searchInput = document.getElementById('card-search');
  if (searchInput && searchInput.value.trim()) {
    const query = searchInput.value.trim().toLowerCase();
    cards = cards.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.nameEn.toLowerCase().includes(query)
    );
  }

  // 북마크 필터
  const showBookmarked = document.getElementById('show-bookmarked');
  if (showBookmarked && showBookmarked.checked) {
    const bookmarks = getBookmarks();
    cards = cards.filter(c => bookmarks.includes(c.id));
  }

  const studied = getStudiedCards();

  grid.innerHTML = cards.map(card => `
    <div class="card-thumb ${studied.includes(card.id) ? 'studied' : ''}"
         onclick="openCardDetail('${card.id}')">
      <img src="${getCardImageUrl(card)}" alt="${card.name}" class="card-thumb-img"
           onerror="this.src='${createCardPlaceholder(card)}'">
      <div class="card-thumb-name">${card.name}</div>
      <div class="card-thumb-name-en">${card.nameEn}</div>
    </div>
  `).join('');

  if (cards.length === 0) {
    grid.innerHTML = '<p class="empty-message">표시할 카드가 없습니다.</p>';
  }
}

function filterCards() {
  renderCardGrid(currentStudyCategory);
}

// ============================================
// 카드 상세 모달
// ============================================
function openCardDetail(cardId) {
  const card = findCardById(cardId);
  if (!card) return;

  const modal = document.getElementById('card-detail-modal');
  const body = document.getElementById('card-detail-body');

  const studied = getStudiedCards().includes(cardId);
  const bookmarked = getBookmarks().includes(cardId);
  const memo = getCardMemo(cardId);

  const categoryName = {
    major: '메이저 아르카나',
    wands: '완드',
    cups: '컵',
    swords: '소드',
    pentacles: '펜타클'
  }[card.category] || '';

  body.innerHTML = `
    <div class="card-detail-header">
      <img src="${getCardImageUrl(card)}" alt="${card.name}" class="card-detail-img"
           onerror="this.src='${createCardPlaceholder(card)}'">
      <div class="card-detail-info">
        <h3>${card.name}</h3>
        <div class="card-name-en">${card.nameEn}</div>
        <div class="card-detail-badges">
          <span class="badge ${card.category === 'major' ? 'major' : 'minor'}">${categoryName}</span>
          ${card.element ? `<span class="badge">${card.element}</span>` : ''}
          ${card.planet ? `<span class="badge">${card.planet}</span>` : ''}
          ${card.suit ? `<span class="badge">${card.suit} 수트</span>` : ''}
        </div>
      </div>
    </div>

    <div class="meaning-section">
      <h4>☀️ 정방향</h4>
      <div class="keywords">
        ${card.upright.keywords.map(k => `<span class="keyword upright">${k}</span>`).join('')}
      </div>
      <p>${card.upright.meaning}</p>
    </div>

    <div class="meaning-section">
      <h4>🔄 역방향</h4>
      <div class="keywords">
        ${card.reversed.keywords.map(k => `<span class="keyword reversed">${k}</span>`).join('')}
      </div>
      <p>${card.reversed.meaning}</p>
    </div>

    ${card.symbols ? `
    <div class="meaning-section">
      <h4>🔮 상징</h4>
      <p>${card.symbols}</p>
    </div>
    ` : ''}

    <div class="card-detail-actions">
      <button class="btn ${studied ? 'btn-primary' : 'btn-secondary'}" onclick="toggleStudied('${cardId}'); openCardDetail('${cardId}');">
        ${studied ? '✅ 학습 완료' : '📖 학습 완료 표시'}
      </button>
      <button class="btn ${bookmarked ? 'btn-primary' : 'btn-secondary'}" onclick="toggleBookmark('${cardId}'); openCardDetail('${cardId}');">
        ${bookmarked ? '⭐ 북마크됨' : '☆ 북마크'}
      </button>
    </div>

    <div class="card-memo">
      <h4>📝 나의 메모</h4>
      <textarea id="memo-input-${cardId}" placeholder="이 카드에 대한 나의 생각을 적어보세요...">${memo}</textarea>
      <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem"
              onclick="saveCardMemo('${cardId}', document.getElementById('memo-input-${cardId}').value)">
        💾 메모 저장
      </button>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeCardDetail() {
  const modal = document.getElementById('card-detail-modal');
  if (modal) modal.classList.add('hidden');
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCardDetail();
});
