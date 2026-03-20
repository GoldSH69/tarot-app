// ========================================
// reading.js - 리딩 모듈
// ========================================

let readingState = {
  spread: null,
  question: '',
  deck: [],
  selected: [],
  maxCards: 1,
  positionLabels: []
};

function initReading() {
  const container = document.getElementById('reading-container');
  container.innerHTML = `
    <h2>🃏 타로 리딩</h2>
    <p class="section-desc">질문을 마음에 품고, 카드를 선택하세요</p>

    <!-- 스프레드 선택 -->
    <div id="reading-spread-select" class="spread-select">
      <h3>스프레드 선택</h3>
      <div class="spread-options">
        <div class="spread-option" onclick="selectSpread('onecard')">
          <span class="spread-icon">🎴</span>
          <h4>원카드</h4>
          <p>간단한 질문에 한 장의 답</p>
        </div>
        <div class="spread-option" onclick="selectSpread('threecard-time')">
          <span class="spread-icon">🕐</span>
          <h4>쓰리카드 - 시간</h4>
          <p>과거 / 현재 / 미래</p>
        </div>
        <div class="spread-option" onclick="selectSpread('threecard-situation')">
          <span class="spread-icon">🔍</span>
          <h4>쓰리카드 - 상황</h4>
          <p>상황 / 원인 / 조언</p>
        </div>
        <div class="spread-option" onclick="selectSpread('threecard-mind')">
          <span class="spread-icon">🧠</span>
          <h4>쓰리카드 - 마음</h4>
          <p>의식 / 무의식 / 조언</p>
        </div>
        <div class="spread-option spread-option-spirit" onclick="navigate('reading'); startSpiritTarot();">
          <span class="spread-icon">👁️</span>
          <h4>영타로</h4>
          <p>직감으로 3장 선택</p>
        </div>
      </div>
    </div>

    <!-- 질문 입력 -->
    <div id="reading-question" style="display:none;">
      <h3>질문을 입력하세요</h3>
      <div class="form-group">
        <textarea id="reading-question-input" rows="3" placeholder="카드에게 물어보고 싶은 것을 적어주세요"></textarea>
      </div>
      <div class="btn-group">
        <button class="btn-secondary" onclick="backToSpreadSelect()">← 돌아가기</button>
        <button class="btn-primary" onclick="startCardSelection()">카드 선택하기 →</button>
      </div>
    </div>

    <!-- 카드 선택 -->
    <div id="reading-deck" style="display:none;">
      <h3 id="reading-deck-title">카드를 선택하세요</h3>
      <p id="reading-deck-sub" class="section-desc"></p>
      <div class="card-deck" id="reading-card-deck"></div>
      <div class="btn-group">
        <button class="btn-secondary" onclick="backToQuestion()">← 돌아가기</button>
      </div>
    </div>

    <!-- 결과 -->
    <div id="reading-result" style="display:none;"></div>
  `;
}

function selectSpread(type) {
  readingState.spread = type;
  readingState.maxCards = type === 'onecard' ? 1 : 3;
  readingState.positionLabels = getPositionLabels(type);
  readingState.selected = [];

  document.getElementById('reading-spread-select').style.display = 'none';
  document.getElementById('reading-question').style.display = 'block';

  document.getElementById('reading-question-input').focus();
}

function backToSpreadSelect() {
  document.getElementById('reading-question').style.display = 'none';
  document.getElementById('reading-spread-select').style.display = 'block';
}

function backToQuestion() {
  document.getElementById('reading-deck').style.display = 'none';
  document.getElementById('reading-question').style.display = 'block';
}

function startCardSelection() {
  readingState.question = document.getElementById('reading-question-input').value.trim();
  readingState.selected = [];

  // 덱 생성: 78장 셔플
  const allCards = getAllCards();
  readingState.deck = shuffleArray(allCards);

  document.getElementById('reading-question').style.display = 'none';
  document.getElementById('reading-deck').style.display = 'block';

  const sub = document.getElementById('reading-deck-sub');
  sub.textContent = `${readingState.positionLabels[0]} 카드를 선택하세요 (${readingState.selected.length + 1}/${readingState.maxCards})`;

  renderDeck();
}

function renderDeck() {
  const deckEl = document.getElementById('reading-card-deck');
  deckEl.innerHTML = '';

  readingState.deck.forEach((card, idx) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'deck-card';
    cardEl.innerHTML = `<div class="deck-card-back">🂠</div>`;
    cardEl.onclick = () => selectCard(idx);
    deckEl.appendChild(cardEl);
  });
}

function selectCard(idx) {
  const card = readingState.deck[idx];
  const reversed = Math.random() > 0.5;
  const position = readingState.positionLabels[readingState.selected.length];

  readingState.selected.push({ card, reversed, position });

  // 덱에서 제거
  readingState.deck.splice(idx, 1);

  if (readingState.selected.length >= readingState.maxCards) {
    // 리딩 완료
    showReadingResult();
  } else {
    // 다음 카드
    const sub = document.getElementById('reading-deck-sub');
    sub.textContent = `${readingState.positionLabels[readingState.selected.length]} 카드를 선택하세요 (${readingState.selected.length + 1}/${readingState.maxCards})`;
    renderDeck();
    showToast(`${position} 카드 선택 완료!`, 'success');
  }
}

function showReadingResult() {
  document.getElementById('reading-deck').style.display = 'none';
  const resultEl = document.getElementById('reading-result');
  resultEl.style.display = 'block';

  const spreadName = getSpreadName(readingState.spread);

  let cardsHtml = readingState.selected.map((sel, i) => {
    const { card, reversed, position } = sel;
    const direction = reversed ? '역방향' : '정방향';
    const meaning = reversed ? card.reversed : card.upright;
    const imageUrl = getCardImageUrl(card);

    return `
      <div class="result-card">
        <div class="result-card-position">${position}</div>
        <div class="result-card-image ${reversed ? 'reversed' : ''}">
          <img src="${imageUrl}" alt="${card.name}" onerror="this.outerHTML=createCardPlaceholder(findCardById('${card.id}'))">
        </div>
        <div class="result-card-info">
          <h4>${card.name} <span class="card-name-en">${card.nameEn}</span></h4>
          <span class="badge badge-${reversed ? 'reversed' : 'upright'}">${direction}</span>
          <div class="card-keywords">
            ${meaning.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
          </div>
          <p>${meaning.meaning}</p>
        </div>
      </div>
    `;
  }).join('');

  // 간단한 종합 메시지
  let summary = generateSimpleSummary(readingState.selected, readingState.spread);

  resultEl.innerHTML = `
    <div class="reading-result-box">
      <h3>🔮 ${spreadName} 리딩 결과</h3>
      ${readingState.question ? `<p class="result-question">질문: "${readingState.question}"</p>` : ''}

      <div class="result-cards-grid">
        ${cardsHtml}
      </div>

      <div class="result-summary">
        <h4>📝 종합 가이드</h4>
        <p>${summary}</p>
      </div>

      <div class="result-actions">
        <button class="btn-ai-analysis" onclick="openAIAnalysisFromReading()">
          🤖 AI 상세 분석
        </button>
        <button class="btn-secondary" onclick="saveReadingToJournal()">📖 일지에 저장</button>
        <button class="btn-primary" onclick="initReading()">🔄 새 리딩</button>
      </div>
    </div>
  `;
}

function openAIAnalysisFromReading() {
  openAIAnalysis(
    readingState.spread,
    readingState.selected,
    readingState.question
  );
}

function generateSimpleSummary(selected, spread) {
  if (selected.length === 1) {
    const { card, reversed } = selected[0];
    const meaning = reversed ? card.reversed : card.upright;
    return `${card.name} 카드가 ${reversed ? '역방향으로' : '정방향으로'} 나왔습니다. 핵심 키워드는 "${meaning.keywords[0]}"입니다. 이 카드의 메시지를 깊이 생각해보세요.`;
  }

  const keywords = selected.map(s => {
    const m = s.reversed ? s.card.reversed : s.card.upright;
    return m.keywords[0];
  });

  return `카드들의 핵심 흐름: ${keywords.join(' → ')}. 각 카드의 위치와 의미를 연결지어 해석해보세요. 더 깊은 분석이 필요하시면 AI 분석을 이용해보세요.`;
}

function saveReadingToJournal() {
  const entry = {
    id: 'journal-' + Date.now(),
    spread: readingState.spread,
    spreadName: getSpreadName(readingState.spread),
    question: readingState.question,
    cards: readingState.selected.map(s => ({
      cardId: s.card.id,
      cardName: s.card.name,
      cardNameEn: s.card.nameEn,
      reversed: s.reversed,
      position: s.position
    })),
    memo: '',
    createdAt: new Date().toISOString()
  };

  const journal = JSON.parse(localStorage.getItem('tarot-journal') || '[]');
  journal.unshift(entry);
  localStorage.setItem('tarot-journal', JSON.stringify(journal));

  showToast('일지에 저장되었습니다!', 'success');
}
