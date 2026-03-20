/**
 * 영타로 (Spirit Tarot) 모듈
 * 명상 → 셔플 → 직관적 선택
 */

let spiritTimerInterval = null;
let spiritDeckCards = [];
let spiritSelectedCards = [];
let spiritJumpCardTriggered = false;

function startSpiritTarot() {
  document.getElementById('spread-selection').classList.add('hidden');
  document.getElementById('three-card-options').classList.add('hidden');
  document.getElementById('spirit-tarot-area').classList.remove('hidden');

  spiritSelectedCards = [];
  spiritJumpCardTriggered = false;
  spiritDeckCards = shuffleArray(getAllCards());

  // 질문 입력 (간단하게)
  currentQuestion = prompt('마음속 질문을 떠올려보세요.\n질문을 입력하세요 (선택사항):', '') || '';

  startMeditationTimer();
}

// ============================================
// 명상 타이머
// ============================================
function startMeditationTimer() {
  const timerEl = document.getElementById('spirit-timer');
  const countEl = document.getElementById('timer-count');
  const shuffleArea = document.getElementById('spirit-shuffle');

  timerEl.classList.remove('hidden');
  shuffleArea.classList.add('hidden');

  let seconds = 15; // 15초 명상
  countEl.textContent = seconds;

  spiritTimerInterval = setInterval(() => {
    seconds--;
    countEl.textContent = seconds;

    if (seconds <= 0) {
      clearInterval(spiritTimerInterval);
      timerEl.classList.add('hidden');
      startSpiritShuffle();
    }
  }, 1000);
}

// ============================================
// 영적 셔플
// ============================================
function startSpiritShuffle() {
  const shuffleArea = document.getElementById('spirit-shuffle');
  shuffleArea.classList.remove('hidden');

  // 점프카드 랜덤 트리거 (20% 확률)
  if (Math.random() < 0.2 && spiritSelectedCards.length === 0) {
    setTimeout(() => {
      spiritJumpCardTriggered = true;
      const jumpNotice = document.getElementById('spirit-jump-card');
      jumpNotice.classList.remove('hidden');

      // 점프카드 자동 선택
      const jumpCard = spiritDeckCards[Math.floor(Math.random() * spiritDeckCards.length)];
      const reversed = Math.random() < 0.3;
      spiritSelectedCards.push({ ...jumpCard, reversed, isJumpCard: true });
      renderSpiritSelectedCards();
    }, Math.random() * 3000 + 2000);
  }

  updateSpiritInstruction();
}

// ============================================
// 카드 선택 (느낌이 올 때 탭)
// ============================================
function spiritDrawCard() {
  const totalNeeded = 3;
  const remaining = totalNeeded - spiritSelectedCards.filter(c => !c.isJumpCard).length;

  if (remaining <= 0) return;

  // 이미 선택된 카드 제외
  const selectedIds = spiritSelectedCards.map(c => c.id);
  const available = spiritDeckCards.filter(c => !selectedIds.includes(c.id));

  if (available.length === 0) return;

  const card = available[Math.floor(Math.random() * available.length)];
  const reversed = Math.random() < 0.3;

  spiritSelectedCards.push({ ...card, reversed, isJumpCard: false });
  renderSpiritSelectedCards();
  updateSpiritInstruction();

  // 덱 다시 섞기 효과
  spiritDeckCards = shuffleArray(spiritDeckCards);

  const normalCards = spiritSelectedCards.filter(c => !c.isJumpCard);
  if (normalCards.length >= totalNeeded) {
    // 모든 카드 선택 완료
    setTimeout(() => {
      selectedReadingCards = [...spiritSelectedCards];
      showReadingResult();
    }, 1000);
  }
}

function updateSpiritInstruction() {
  const normalCards = spiritSelectedCards.filter(c => !c.isJumpCard);
  const remaining = 3 - normalCards.length;

  const btn = document.querySelector('.spirit-draw-btn');
  if (btn) {
    if (remaining > 0) {
      btn.textContent = `✨ 카드를 선택합니다 (${remaining}장 남음) ✨`;
      btn.disabled = false;
    } else {
      btn.textContent = '✨ 리딩 준비 완료 ✨';
      btn.disabled = true;
    }
  }
}

function renderSpiritSelectedCards() {
  const area = document.getElementById('spirit-selected-cards');
  const labels = spiritSelectedCards.map((card, i) => {
    if (card.isJumpCard) return '🌟 점프카드';
    const normalIndex = spiritSelectedCards.slice(0, i + 1).filter(c => !c.isJumpCard).length;
    return `영적 메시지 ${normalIndex}`;
  });

  area.innerHTML = spiritSelectedCards.map((card, i) => {
    const imgClass = card.reversed ? 'reversed' : '';
    const direction = card.reversed ? '역방향' : '정방향';
    return `
      <div class="selected-card-slot">
        <div class="card-position-label">${labels[i]}</div>
        <img src="${getCardImageUrl(card)}" alt="${card.name}" class="${imgClass}"
             onerror="this.src='${createCardPlaceholder(card)}'">
        <div class="card-name-label">${card.name}</div>
        <div class="card-direction">${direction}</div>
      </div>
    `;
  }).join('');
}
