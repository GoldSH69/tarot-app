/**
 * 카드 리딩 모듈
 */

// ★ 전역 변수 (gemini.js에서 접근)
var currentSpreadType = '';
var currentQuestion = '';
var selectedReadingCards = [];
var requiredCardCount = 1;
var deckCards = [];

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
  document.getElementById('selected-spread-name').textContent = '🃏 ' + getSpreadName(spreadType);
}

// ============================================
// 카드 뽑기
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
  var deck = document.getElementById('card-deck');
  var allCards = shuffleArray(getAllCards());
  deckCards = allCards;
  var displayCount = Math.min(allCards.length, 40);
  deck.innerHTML = '';
  for (var i = 0; i < displayCount; i++) {
    var div = document.createElement('div');
    div.className = 'deck-card';
    div.dataset.index = i;
    (function(index) {
      div.addEventListener('click', function() { selectDeckCard(index); });
    })(i);
    deck.appendChild(div);
  }
}

function selectDeckCard(index) {
  if (selectedReadingCards.length >= requiredCardCount) return;
  var deckCardEl = document.querySelector('.deck-card[data-index="' + index + '"]');
  if (!deckCardEl || deckCardEl.classList.contains('selected')) return;
  deckCardEl.classList.add('selected');

  var card = deckCards[index];
  var isReversed = Math.random() < 0.3;

  // ★ 핵심 수정: 원본 카드 데이터를 보존하면서 reversed 상태 추가
  selectedReadingCards.push({
    id: card.id,
    number: card.number,
    name: card.name,
    nameEn: card.nameEn,
    category: card.category,
    image: card.image,
    uprightData: card.upright,     // ★ 이름 변경: upright → uprightData
    reversedData: card.reversed,   // ★ 이름 변경: reversed → reversedData
    symbols: card.symbols,
    element: card.element,
    isReversed: isReversed,        // ★ boolean은 isReversed로
    isJumpCard: false
  });

  renderSelectedCards();
  updateDrawInstruction();

  if (selectedReadingCards.length >= requiredCardCount) {
    setTimeout(function() { showReadingResult(); }, 800);
  }
}

function renderSelectedCards() {
  var area = document.getElementById('selected-cards-area');
  var labels = getPositionLabels(currentSpreadType);
  var html = '';

  for (var i = 0; i < selectedReadingCards.length; i++) {
    var card = selectedReadingCards[i];
    var imgClass = card.isReversed ? 'reversed' : '';
    var direction = card.isReversed ? '역방향' : '정방향';
    var label = card.isJumpCard ? '🌟 점프카드' : (labels[i] || '카드 ' + (i + 1));

    html += '<div class="selected-card-slot">';
    html += '  <div class="card-position-label">' + label + '</div>';
    html += '  <img src="' + getCardImageUrl(card) + '" alt="' + card.name + '" class="' + imgClass + '"';
    html += '       onerror="this.src=\'' + createCardPlaceholder(card) + '\'">';
    html += '  <div class="card-name-label">' + card.name + '</div>';
    html += '  <div class="card-direction">' + direction + '</div>';
    html += '</div>';
  }

  area.innerHTML = html;
}

function updateDrawInstruction() {
  var text = document.getElementById('draw-instruction-text');
  var count = document.getElementById('draw-count');
  var remaining = requiredCardCount - selectedReadingCards.length;
  if (remaining > 0) {
    text.textContent = '마음을 집중하고, 끌리는 카드를 선택하세요';
    count.textContent = '남은 선택: ' + remaining + '장';
  } else {
    text.textContent = '✨ 모든 카드를 선택하셨습니다!';
    count.textContent = '';
  }
}

// ============================================
// ★ 리딩 결과 표시 (핵심 수정)
// ============================================
function showReadingResult() {
  document.getElementById('card-draw-area').classList.add('hidden');
  document.getElementById('spirit-tarot-area').classList.add('hidden');
  document.getElementById('reading-result').classList.remove('hidden');

  var resultCards = document.getElementById('result-cards');
  var resultGuide = document.getElementById('result-guide');
  var labels = getPositionLabels(currentSpreadType);

  // ===== 카드 이미지 표시 =====
  var cardsHtml = '';
  for (var i = 0; i < selectedReadingCards.length; i++) {
    var card = selectedReadingCards[i];
    var imgClass = card.isReversed ? 'reversed' : '';
    var direction = card.isReversed ? '역방향' : '정방향';
    var label = card.isJumpCard ? '🌟 점프카드' : (labels[i] || '카드 ' + (i + 1));

    cardsHtml += '<div class="result-card-item">';
    cardsHtml += '  <div class="position-label">' + label + '</div>';
    cardsHtml += '  <img src="' + getCardImageUrl(card) + '" alt="' + card.name + '" class="' + imgClass + '"';
    cardsHtml += '       onerror="this.src=\'' + createCardPlaceholder(card) + '\'">';
    cardsHtml += '  <div class="result-card-name">' + card.name + '</div>';
    cardsHtml += '  <div class="result-card-direction">' + direction + '</div>';
    cardsHtml += '</div>';
  }
  resultCards.innerHTML = cardsHtml;

  // ===== 리딩 가이드 =====
  var guideHtml = '<h4>📖 리딩 가이드</h4>';

  // 질문 표시
  if (currentQuestion) {
    guideHtml += '<p><strong>질문:</strong> ' + currentQuestion + '</p>';
    guideHtml += '<hr style="border:none;border-top:1px solid var(--border-color);margin:0.75rem 0;">';
  }

  // ★ 각 카드별 상세 해석
  for (var j = 0; j < selectedReadingCards.length; j++) {
    var c = selectedReadingCards[j];
    var posLabel = c.isJumpCard ? '🌟 점프카드' : (labels[j] || '카드 ' + (j + 1));

    // ★ 핵심: uprightData / reversedData에서 의미 가져오기
    var meaning = null;
    var directionText = '';

    if (c.isReversed) {
      meaning = c.reversedData;
      directionText = '역방향 🔄';
    } else {
      meaning = c.uprightData;
      directionText = '정방향 ☀️';
    }

    // meaning이 없으면 원본 카드에서 다시 찾기
    if (!meaning || !meaning.keywords) {
      var originalCard = findCardById(c.id);
      if (originalCard) {
        meaning = c.isReversed ? originalCard.reversed : originalCard.upright;
      }
    }

    // 그래도 없으면 기본값
    if (!meaning || !meaning.keywords) {
      meaning = {
        keywords: ['해석 준비 중'],
        meaning: '이 카드의 의미를 직관적으로 느껴보세요.'
      };
    }

    guideHtml += '<div style="margin-bottom: 1.25rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 3px solid var(--primary-color);">';
    guideHtml += '  <h4 style="color: var(--primary-color); font-size: 0.95rem; margin-bottom: 0.5rem;">';
    guideHtml += '    [' + posLabel + '] ' + c.name + ' — ' + directionText;
    guideHtml += '  </h4>';

    // 키워드 배지
    guideHtml += '  <div class="keywords" style="margin: 0.3rem 0 0.5rem;">';
    for (var k = 0; k < meaning.keywords.length; k++) {
      var kwClass = c.isReversed ? 'reversed' : 'upright';
      guideHtml += '<span class="keyword ' + kwClass + '">' + meaning.keywords[k] + '</span>';
    }
    guideHtml += '  </div>';

    // 의미 설명
    guideHtml += '  <p style="font-size: 0.9rem; line-height: 1.7;">' + meaning.meaning + '</p>';

    // 상징 (있으면)
    if (c.symbols) {
      guideHtml += '  <p style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">🔮 상징: ' + c.symbols + '</p>';
    }

    guideHtml += '</div>';
  }

  // ===== 종합 조언 =====
  guideHtml += '<hr style="border:none;border-top:1px solid var(--border-color);margin:1rem 0;">';
  guideHtml += '<div style="padding: 1rem; background: linear-gradient(135deg, rgba(108,92,231,0.05), rgba(162,155,254,0.05)); border-radius: 8px;">';
  guideHtml += '  <h4 style="color: var(--primary-color);">💡 종합 조언</h4>';

  // 스프레드별 맞춤 종합 조언
  if (currentSpreadType === 'one-card') {
    guideHtml += '  <p style="font-size:0.9rem; line-height:1.7;">';
    guideHtml += '    이 한 장의 카드가 지금 당신에게 가장 필요한 메시지를 담고 있습니다. ';
    guideHtml += '    카드의 키워드를 마음에 새기고, 오늘 하루 이 에너지를 의식하며 보내보세요. ';
    guideHtml += '    더 깊은 통찰을 원하시면 아래 AI 전문가 분석을 이용해 보세요.';
    guideHtml += '  </p>';

  } else if (currentSpreadType.startsWith('three-')) {
    var threeLabels = getPositionLabels(currentSpreadType);
    guideHtml += '  <p style="font-size:0.9rem; line-height:1.7;">';
    guideHtml += '    세 장의 카드가 <strong>' + threeLabels.join(' → ') + '</strong>의 흐름을 보여주고 있습니다.<br><br>';

    // 카드 흐름 요약
    for (var t = 0; t < selectedReadingCards.length && t < 3; t++) {
      var tc = selectedReadingCards[t];
      var tMeaning = tc.isReversed ? tc.reversedData : tc.uprightData;
      if (!tMeaning || !tMeaning.keywords) {
        var tOriginal = findCardById(tc.id);
        if (tOriginal) tMeaning = tc.isReversed ? tOriginal.reversed : tOriginal.upright;
      }
      var tKeyword = (tMeaning && tMeaning.keywords && tMeaning.keywords[0]) ? tMeaning.keywords[0] : tc.name;
      guideHtml += '    <strong>' + threeLabels[t] + ':</strong> ' + tc.name + ' → ' + tKeyword + '<br>';
    }

    guideHtml += '    <br>카드의 흐름을 하나의 이야기로 연결하여 생각해 보세요. ';
    guideHtml += '    정방향 카드는 순조로운 에너지를, 역방향 카드는 주의가 필요한 부분을 알려줍니다.';
    guideHtml += '  </p>';

  } else if (currentSpreadType === 'spirit-tarot') {
    guideHtml += '  <p style="font-size:0.9rem; line-height:1.7;">';
    guideHtml += '    영타로를 통해 직관적으로 선택한 카드들입니다. ';
    guideHtml += '    이 카드들은 당신의 무의식이 선택한 메시지이므로, ';
    guideHtml += '    논리보다는 <strong>느낌과 직관</strong>으로 해석해 보세요.<br><br>';

    // 점프카드 안내
    var hasJump = false;
    for (var s = 0; s < selectedReadingCards.length; s++) {
      if (selectedReadingCards[s].isJumpCard) hasJump = true;
    }
    if (hasJump) {
      guideHtml += '    🌟 <strong>점프카드</strong>가 나왔습니다! 이 카드는 우주가 특별히 전하고 싶은 메시지입니다. ';
      guideHtml += '    다른 카드보다 더 주의 깊게 살펴보세요.<br><br>';
    }

    guideHtml += '    카드를 보며 처음 떠오른 느낌이나 이미지를 일지에 기록해 두면 ';
    guideHtml += '    나중에 깊은 통찰을 얻을 수 있습니다.';
    guideHtml += '  </p>';
  }

  guideHtml += '</div>';

  resultGuide.innerHTML = guideHtml;
}

// ============================================
// 일지에 저장
// ============================================
function saveToJournal() {
  var memoText = prompt('이 리딩에 대한 나의 해석이나 메모를 입력하세요 (선택사항):', '');

  var cardsToSave = [];
  for (var i = 0; i < selectedReadingCards.length; i++) {
    var c = selectedReadingCards[i];
    cardsToSave.push({
      id: c.id,
      name: c.name,
      nameEn: c.nameEn,
      isReversed: c.isReversed,
      isJumpCard: c.isJumpCard || false
    });
  }

  var entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    spreadType: currentSpreadType,
    spreadName: getSpreadName(currentSpreadType),
    question: currentQuestion || '',
    cards: cardsToSave,
    memo: memoText || ''
  };

  var journal = JSON.parse(localStorage.getItem('tarot-journal') || '[]');
  journal.unshift(entry);
  localStorage.setItem('tarot-journal', JSON.stringify(journal));
  showToast('리딩 일지에 저장되었습니다! 📝', 'success');
}
