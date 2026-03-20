/**
 * 카드 리딩 모듈
 * 원카드, 쓰리카드 스프레드
 */

let currentSpreadType = '';
let currentQuestion = '';
let selectedReadingCards = [];
let requiredCardCount = 1;
let deckCards = [];

// ============================================
// 스프레드 선택
// ============================================
function backToSpreadSelection() {
  document.getElementById('spread-selection').classList.remove('hidden');
  document.getElementById('three-card-options').classList.add('hidden');
  document.getElementById('question-input-section').classList.add('hidden');
  document.getElementById('card-draw-area').classList.add('hidden');
  document.getElementById('spirit-tarot-area').classList.add('hidden');
  document.getElementById('reading-result').classList.add('hidden');

  selectedReadingCards = [];
  currentSpreadType = '';
  currentQuestion = '';
}

function showThreeCardOptions() {
  document.getElementById('spread-selection').classList.add('hidden');
  document.getElementById('three-card-options').classList.remove('hidden');
}

function startReading(spreadType) {
  currentSpreadType = spreadType;

  if (spreadType === 'one-card') {
    requiredCardCount = 1;
  } else if (spreadType.startsWith('three-')) {
    requiredCardCount = 3;
  } else if (spreadType === 'spirit-tarot') {
    requiredCardCount = 3;
  }

  document.getElementById('spread-selection').classList.add('hidden');
  document.getElementById('three-card-options').classList.add('hidden');

  if (spreadType === 'spirit-tarot') {
    startSpiritTarot();
    return;
  }

  document.getElementById('question-input-section').classList.remove('hidden');
  document.getElementById('selected-spread-name').textContent =
    `🃏 ${getSpreadName(spreadType)}`;
}

// ============================================
// 카드 뽑기 시작
// ============================================
function beginCardDraw() {
  currentQuestion = document.getElementById('reading-question').value;

  document.getElementById('question-input-section').classList.add('hidden');
  document.getElementById('card-draw-area').classList.remove('hidden');

  selectedReadingCards = [];
  generateDeck();
  updateDrawInstruction();
}

function generateDeck() {
  const deck = document.getElementById('card-deck');
  const allCards = shuffleArray(getAllCards());
  deckCards = allCards;

  // 뒤집힌 카드들을 덱으로 표시 (많이 표시)
  const displayCount = Math.min(allCards.length, 40);
  deck.innerHTML = '';

  for (let i = 0; i < displayCount; i++) {
    const div = document.createElement('div');
    div.className = 'deck-card';
    div.dataset.index = i;
    div.addEventListener('click', () => selectDeckCard(i));
    deck.appendChild(div);
  }
}

function selectDeckCard(index) {
  if (selectedReadingCards.length >= requiredCardCount) return;

  const deckCardEl = document.querySelector(`.deck-card[data-index="${index}"]`);
  if (!deckCardEl || deckCardEl.classList.contains('selected')) return;

  deckCardEl.classList.add('selected');

  const card = deckCards[index];
  const reversed = Math.random() < 0.3;

  selectedReadingCards.push({
    ...card,
    reversed
  });

  renderSelectedCards();
  updateDrawInstruction();

  if (selectedReadingCards.length >= requiredCardCount) {
    setTimeout(() => showReadingResult(), 800);
  }
}

function renderSelectedCards() {
  const area = document.getElementById('selected-cards-area');
  const labels = getPositionLabels(currentSpreadType);

  area.innerHTML = selectedReadingCards.map((card, i) => {
    const imgClass = card.reversed ? 'reversed' : '';
    const direction = card.reversed ? '역방향' : '정방향';
    return `
      <div class="selected-card-slot">
        <div class="card-position-label">${labels[i] || `카드 ${i + 1}`}</div>
        <img src="${getCardImageUrl(card)}" alt="${card.name}" class="${imgClass}"
             onerror="this.src='${createCardPlaceholder(card)}'">
        <div class="card-name-label">${card.name}</div>
        <div class="card-direction">${direction}</div>
      </div>
    `;
  }).join('');
}

function updateDrawInstruction() {
  const text = document.getElementById('draw-instruction-text');
  const count = document.getElementById('draw-count');
  const remaining = requiredCardCount - selectedReadingCards.length;

  if (remaining > 0) {
    text.textContent = '마음을 집중하고, 끌리는 카드를 선택하세요';
    count.textContent = `남은 선택: ${remaining}장`;
  } else {
    text.textContent = '✨ 모든 카드를 선택하셨습니다!';
    count.textContent = '';
  }
}

// ============================================
// 리딩 결과 표시
// ============================================
function showReadingResult() {
  document.getElementById('card-draw-area').classList.add('hidden');
  document.getElementById('spirit-tarot-area').classList.add('hidden');
  document.getElementById('reading-result').classList.remove('hidden');

  const resultCards = document.getElementById('result-cards');
  const resultGuide = document.getElementById('result-guide');
  const labels = getPositionLabels(currentSpreadType);

  // 카드 표시
  resultCards.innerHTML = selectedReadingCards.map((card, i) => {
    const imgClass = card.reversed ? 'reversed' : '';
    const direction = card.reversed ? '역방향' : '정방향';
    return `
      <div class="result-card-item">
        <div class="position-label">${labels[i] || `카드 ${i + 1}`}</div>
        <img src="${getCardImageUrl(card)}" alt="${card.name}" class="${imgClass}"
             onerror="this.src='${createCardPlaceholder(card)}'">
        <div class="result-card-name">${card.name}</div>
        <div class="result-card-direction">${direction}</div>
      </div>
    `;
  }).join('');

  // 기본 가이드 (AI 분석 없이)
  let guideHtml = `<h4>📖 리딩 가이드</h4>`;

  if (currentQuestion) {
    guideHtml += `<p><strong>질문:</strong> ${currentQuestion}</p><hr style="border:none;border-top:1px solid var(--border-color);margin:0.75rem 0;">`;
  }

  selectedReadingCards.forEach((card, i) => {
    const meaning = card.reversed ? card.reversed : card.upright;
    const direction = card.reversed ? '역방향 🔄' : '정방향 ☀️';
    const posLabel = labels[i] || `카드 ${i + 1}`;

    guideHtml += `
      <div style="margin-bottom: 1rem;">
        <h4 style="color: var(--primary-color); font-size: 0.95rem;">
          [${posLabel}] ${card.name} — ${direction}
        </h4>
        <div class="keywords" style="margin: 0.3rem 0;">
          ${meaning.keywords.map(k => `<span class="keyword ${card.reversed ? 'reversed' : 'upright'}">${k}</span>`).join('')}
        </div>
        <p style="font-size: 0.9rem;">${meaning.meaning}</p>
      </div>
    `;
  });

  // 종합 조언
  guideHtml += `
    <hr style="border:none;border-top:1px solid var(--border-color);margin:1rem 0;">
    <div>
      <h4>💡 종합 조언</h4>
      <p style="font-size:0.9rem;">
        카드의 메시지를 자신의 상황에 비추어 생각해 보세요.
        정방향 카드는 해당 에너지가 잘 흐르고 있음을, 
        역방향 카드는 그 에너지에 주의가 필요함을 의미합니다.
        자신의 직관을 믿고, 카드가 전하는 지혜를 삶에 적용해 보세요.
      </p>
    </div>
  `;

  resultGuide.innerHTML = guideHtml;
}

// ============================================
// 일지에 저장
// ============================================
function saveToJournal() {
  const memoText = prompt('이 리딩에 대한 나의 해석이나 메모를 입력하세요 (선택사항):', '');

  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    spreadType: currentSpreadType,
    spreadName: getSpreadName(currentSpreadType),
    question: currentQuestion || '',
    cards: selectedReadingCards.map(c => ({
      id: c.id,
      name: c.name,
      nameEn: c.nameEn,
      reversed: c.reversed
    })),
    memo: memoText || ''
  };

  const journal = JSON.parse(localStorage.getItem('tarot-journal') || '[]');
  journal.unshift(entry);
  localStorage.setItem('tarot-journal', JSON.stringify(journal));

  showToast('리딩 일지에 저장되었습니다! 📝', 'success');
}
