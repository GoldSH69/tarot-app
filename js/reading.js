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
  document.getElementById('reading-result').classList.remove('hidden');
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

  // ★ 켈틱크로스 추가
  if (spreadType === 'one-card') {
    requiredCardCount = 1;
  } else if (spreadType.startsWith('three-')) {
    requiredCardCount = 3;
  } else if (spreadType === 'spirit-tarot') {
    requiredCardCount = 3;
  } else if (spreadType === 'celtic-cross') {
    requiredCardCount = 10;
  }

  document.getElementById('spread-selection').classList.add('hidden');
  document.getElementById('three-card-options').classList.add('hidden');

  if (spreadType === 'spirit-tarot') {
    startSpiritTarot();
    return;
  }

  document.getElementById('question-input-section').classList.remove('hidden');
  document.getElementById('selected-spread-name').textContent = '🃏 ' + getSpreadName(spreadType);

  // ★ 켈틱크로스 안내 문구 추가
  var guideArea = document.getElementById('celtic-guide-in-question');
  if (guideArea) {
    if (spreadType === 'celtic-cross') {
      guideArea.classList.remove('hidden');
    } else {
      guideArea.classList.add('hidden');
    }
  }
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

  selectedReadingCards.push({
    id: card.id,
    number: card.number,
    name: card.name,
    nameEn: card.nameEn,
    category: card.category,
    image: card.image,
    uprightData: card.upright,
    reversedData: card.reversed,
    symbols: card.symbols,
    element: card.element,
    isReversed: isReversed,
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
    // ★ 켈틱크로스: 현재 선택 중인 포지션 표시
    if (currentSpreadType === 'celtic-cross') {
      var labels = getPositionLabels('celtic-cross');
      var currentPos = labels[selectedReadingCards.length] || '';
      text.textContent = '마음을 집중하고, 끌리는 카드를 선택하세요';
      count.textContent = '다음: ' + currentPos + ' (남은 ' + remaining + '장)';
    } else {
      text.textContent = '마음을 집중하고, 끌리는 카드를 선택하세요';
      count.textContent = '남은 선택: ' + remaining + '장';
    }
  } else {
    text.textContent = '✨ 모든 카드를 선택하셨습니다!';
    count.textContent = '';
  }
}

// ============================================
// ★ 리딩 결과 표시 (켈틱크로스 포함)
// ============================================
function showReadingResult() {
  document.getElementById('card-draw-area').classList.add('hidden');
  document.getElementById('spirit-tarot-area').classList.add('hidden');
  document.getElementById('reading-result').classList.remove('hidden');

  setLastReadingResult(currentSpreadType, selectedReadingCards, document.getElementById('reading-question')?.value || '');

  var resultCards = document.getElementById('result-cards');
  var resultGuide = document.getElementById('result-guide');
  var labels = getPositionLabels(currentSpreadType);

  // ===== 카드 이미지 표시 =====
  var cardsHtml = '';

  if (currentSpreadType === 'celtic-cross') {
    // ★★ 켈틱크로스 전용 레이아웃 ★★
    cardsHtml = buildCelticCrossLayout(labels);
  } else {
    // 기존 레이아웃 (원카드/쓰리카드/영타로)
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
  }

  resultCards.innerHTML = cardsHtml;

  // ===== 리딩 가이드 =====
  var guideHtml = '<h4>📖 리딩 가이드</h4>';

  if (currentQuestion) {
    guideHtml += '<p><strong>질문:</strong> ' + currentQuestion + '</p>';
    guideHtml += '<hr style="border:none;border-top:1px solid var(--border-color);margin:0.75rem 0;">';
  }

  // ★ 각 카드별 상세 해석
  for (var j = 0; j < selectedReadingCards.length; j++) {
    var c = selectedReadingCards[j];
    var posLabel = c.isJumpCard ? '🌟 점프카드' : (labels[j] || '카드 ' + (j + 1));

    var meaning = null;
    var directionText = '';

    if (c.isReversed) {
      meaning = c.reversedData;
      directionText = '역방향 🔄';
    } else {
      meaning = c.uprightData;
      directionText = '정방향 ☀️';
    }

    if (!meaning || !meaning.keywords) {
      var originalCard = findCardById(c.id);
      if (originalCard) {
        meaning = c.isReversed ? originalCard.reversed : originalCard.upright;
      }
    }

    if (!meaning || !meaning.keywords) {
      meaning = {
        keywords: ['해석 준비 중'],
        meaning: '이 카드의 의미를 직관적으로 느껴보세요.'
      };
    }

    // ★ 켈틱크로스: 포지션별 해석 힌트 추가
    var positionHint = '';
    if (currentSpreadType === 'celtic-cross') {
      positionHint = getCelticPositionHint(j);
    }

    guideHtml += '<div style="margin-bottom: 1.25rem; padding: 1rem; background: var(--card-bg); border-radius: 8px; border-left: 3px solid var(--primary-color);">';
    guideHtml += '  <h4 style="color: var(--primary-color); font-size: 0.95rem; margin-bottom: 0.5rem;">';
    guideHtml += '    [' + posLabel + '] ' + c.name + ' — ' + directionText;
    guideHtml += '  </h4>';

    // 포지션 힌트
    if (positionHint) {
      guideHtml += '  <p style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 0.5rem; font-style: italic;">💡 ' + positionHint + '</p>';
    }

    // 키워드 배지
    guideHtml += '  <div class="keywords" style="margin: 0.3rem 0 0.5rem;">';
    for (var k = 0; k < meaning.keywords.length; k++) {
      var kwClass = c.isReversed ? 'reversed' : 'upright';
      guideHtml += '<span class="keyword ' + kwClass + '">' + meaning.keywords[k] + '</span>';
    }
    guideHtml += '  </div>';

    // 의미 설명
    guideHtml += '  <p style="font-size: 0.9rem; line-height: 1.7;">' + meaning.meaning + '</p>';

    // 상징
    if (c.symbols) {
      guideHtml += '  <p style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">🔮 상징: ' + c.symbols + '</p>';
    }

    guideHtml += '</div>';

  }

  // ===== 종합 조언 =====
  guideHtml += '<hr style="border:none;border-top:1px solid var(--border-color);margin:1rem 0;">';
  guideHtml += '<div style="padding: 1rem; background: linear-gradient(135deg, rgba(108,92,231,0.05), rgba(162,155,254,0.05)); border-radius: 8px;">';
  guideHtml += '  <h4 style="color: var(--primary-color);">💡 종합 조언</h4>';

  if (currentSpreadType === 'one-card') {
    guideHtml += buildOneCardAdvice();
  } else if (currentSpreadType.startsWith('three-')) {
    guideHtml += buildThreeCardAdvice(labels);
  } else if (currentSpreadType === 'spirit-tarot') {
    guideHtml += buildSpiritAdvice();
  } else if (currentSpreadType === 'celtic-cross') {
    guideHtml += buildCelticCrossAdvice(labels);
  }

  guideHtml += '</div>';

  resultGuide.innerHTML = guideHtml;

  // ★★★ [추가] AI 섹션을 관리자/일반에 맞게 렌더 ★★★
  renderAIAnalysisSection();
}

// ============================================
// ★★ 켈틱크로스 전용 레이아웃 빌더 ★★
// ============================================
function buildCelticCrossLayout(labels) {
  var html = '<div class="celtic-cross-layout">';

  // --- 십자 영역 ---
  html += '<div class="celtic-cross-section">';

  // 카드 3: 의식/목표 (위)
  html += buildCelticCard(2, labels[2], 'celtic-pos-top');

  // 중간 줄: 5-과거, 1/2-중앙, 6-미래
  html += '<div class="celtic-cross-middle">';
  html += buildCelticCard(4, labels[4], 'celtic-pos-left');

  // 중앙 (1번 위에 2번 겹침)
  html += '<div class="celtic-center-stack">';
  html += buildCelticCard(0, labels[0], 'celtic-pos-center');
  html += buildCelticCard(1, labels[1], 'celtic-pos-crossing');
  html += '</div>';

  html += buildCelticCard(5, labels[5], 'celtic-pos-right');
  html += '</div>';

  // 카드 4: 무의식/기반 (아래)
  html += buildCelticCard(3, labels[3], 'celtic-pos-bottom');

  html += '</div>'; // celtic-cross-section 끝

  // --- 기둥 영역 (7~10, 아래→위) ---
  html += '<div class="celtic-pillar-section">';
  html += buildCelticCard(9, labels[9], 'celtic-pos-pillar celtic-pillar-4');
  html += buildCelticCard(8, labels[8], 'celtic-pos-pillar celtic-pillar-3');
  html += buildCelticCard(7, labels[7], 'celtic-pos-pillar celtic-pillar-2');
  html += buildCelticCard(6, labels[6], 'celtic-pos-pillar celtic-pillar-1');
  html += '</div>';

  html += '</div>'; // celtic-cross-layout 끝
  return html;
}

function buildCelticCard(index, label, posClass) {
  var card = selectedReadingCards[index];
  if (!card) return '';

  var imgClass = card.isReversed ? 'reversed' : '';
  var direction = card.isReversed ? '역방향' : '정방향';
  var isCrossing = (posClass === 'celtic-pos-crossing');

  // 2번 카드(도전)는 가로로 표시
  var extraImgClass = isCrossing ? ' celtic-crossing-img' : '';
  if (isCrossing && card.isReversed) {
    // 역방향 + 가로 겹침: 역방향 해제하고 가로만 적용 (시각적 혼란 방지)
    imgClass = '';
    extraImgClass = ' celtic-crossing-img celtic-crossing-reversed';
  }

  var html = '<div class="celtic-card-item ' + posClass + '">';
  html += '  <div class="celtic-card-label">' + label + '</div>';
  html += '  <img src="' + getCardImageUrl(card) + '" alt="' + card.name + '" class="celtic-card-img ' + imgClass + extraImgClass + '"';
  html += '       onerror="this.src=\'' + createCardPlaceholder(card) + '\'">';
  html += '  <div class="celtic-card-name">' + card.name + '</div>';
  html += '  <div class="celtic-card-direction">' + direction + '</div>';
  html += '</div>';
  return html;
}

// ============================================
// ★ 켈틱크로스 포지션별 해석 힌트
// ============================================
function getCelticPositionHint(index) {
  var hints = [
    '이 카드는 질문의 핵심, 현재 당신이 처한 상황을 나타냅니다.',
    '이 카드는 현재 당신이 직면한 도전이나 극복해야 할 장애물을 보여줍니다.',
    '이 카드는 당신이 의식적으로 바라는 목표나 이상을 상징합니다.',
    '이 카드는 무의식 깊은 곳에 있는 감정이나 숨겨진 근본 원인을 드러냅니다.',
    '이 카드는 현재 상황에 영향을 미치는 과거의 사건이나 에너지를 나타냅니다.',
    '이 카드는 가까운 미래에 다가올 에너지나 가능성을 보여줍니다.',
    '이 카드는 질문에 대한 당신의 내면적 태도나 자아상을 반영합니다.',
    '이 카드는 주변 사람들의 영향이나 외부 환경을 나타냅니다.',
    '이 카드는 당신의 내면에 있는 희망과 동시에 두려움을 보여줍니다.',
    '이 카드는 현재 흐름이 이어질 경우 도달하게 될 최종 결과를 나타냅니다.'
  ];
  return hints[index] || '';
}

// ============================================
// 종합 조언 빌더들
// ============================================
function buildOneCardAdvice() {
  return '  <p style="font-size:0.9rem; line-height:1.7;">' +
    '    이 한 장의 카드가 지금 당신에게 가장 필요한 메시지를 담고 있습니다. ' +
    '    카드의 키워드를 마음에 새기고, 오늘 하루 이 에너지를 의식하며 보내보세요. ' +
    '    더 깊은 통찰을 원하시면 아래 AI 전문가 분석을 이용해 보세요.' +
    '  </p>';
}

function buildThreeCardAdvice(threeLabels) {
  var html = '  <p style="font-size:0.9rem; line-height:1.7;">';
  html += '    세 장의 카드가 <strong>' + threeLabels.join(' → ') + '</strong>의 흐름을 보여주고 있습니다.<br><br>';

  for (var t = 0; t < selectedReadingCards.length && t < 3; t++) {
    var tc = selectedReadingCards[t];
    var tMeaning = tc.isReversed ? tc.reversedData : tc.uprightData;
    if (!tMeaning || !tMeaning.keywords) {
      var tOriginal = findCardById(tc.id);
      if (tOriginal) tMeaning = tc.isReversed ? tOriginal.reversed : tOriginal.upright;
    }
    var tKeyword = (tMeaning && tMeaning.keywords && tMeaning.keywords[0]) ? tMeaning.keywords[0] : tc.name;
    html += '    <strong>' + threeLabels[t] + ':</strong> ' + tc.name + ' → ' + tKeyword + '<br>';
  }

  html += '    <br>카드의 흐름을 하나의 이야기로 연결하여 생각해 보세요. ';
  html += '    정방향 카드는 순조로운 에너지를, 역방향 카드는 주의가 필요한 부분을 알려줍니다.';
  html += '  </p>';
  return html;
}

function buildSpiritAdvice() {
  var html = '  <p style="font-size:0.9rem; line-height:1.7;">';
  html += '    영타로를 통해 직관적으로 선택한 카드들입니다. ';
  html += '    이 카드들은 당신의 무의식이 선택한 메시지이므로, ';
  html += '    논리보다는 <strong>느낌과 직관</strong>으로 해석해 보세요.<br><br>';

  var hasJump = false;
  for (var s = 0; s < selectedReadingCards.length; s++) {
    if (selectedReadingCards[s].isJumpCard) hasJump = true;
  }
  if (hasJump) {
    html += '    🌟 <strong>점프카드</strong>가 나왔습니다! 이 카드는 우주가 특별히 전하고 싶은 메시지입니다. ';
    html += '    다른 카드보다 더 주의 깊게 살펴보세요.<br><br>';
  }

  html += '    카드를 보며 처음 떠오른 느낌이나 이미지를 일지에 기록해 두면 ';
  html += '    나중에 깊은 통찰을 얻을 수 있습니다.';
  html += '  </p>';
  return html;
}

// ★★ 켈틱크로스 종합 조언 ★★
function buildCelticCrossAdvice(labels) {
  var html = '  <p style="font-size:0.9rem; line-height:1.7;">';
  html += '    10장의 카드가 당신의 상황을 다각도로 보여주고 있습니다.<br><br>';

  // 중심부 요약 (1, 2번)
  var c1 = selectedReadingCards[0];
  var c2 = selectedReadingCards[1];
  var c10 = selectedReadingCards[9];

  var m1 = getFirstKeyword(c1);
  var m2 = getFirstKeyword(c2);
  var m10 = getFirstKeyword(c10);

  html += '    <strong>🔹 중심 에너지:</strong> ' + c1.name + '(' + m1 + ')이 현재 상황의 핵심이며, ';
  html += c2.name + '(' + m2 + ')이 도전으로 작용하고 있습니다.<br><br>';

  // 시간축 요약 (5→6)
  var c5 = selectedReadingCards[4];
  var c6 = selectedReadingCards[5];
  var m5 = getFirstKeyword(c5);
  var m6 = getFirstKeyword(c6);
  html += '    <strong>🔹 시간의 흐름:</strong> 과거의 ' + c5.name + '(' + m5 + ') 에너지에서 ';
  html += '가까운 미래의 ' + c6.name + '(' + m6 + ') 에너지로 이동하고 있습니다.<br><br>';

  // 최종 결과
  html += '    <strong>🔹 최종 결과:</strong> ' + c10.name + '(' + m10 + ')이 현재 흐름의 귀결을 보여줍니다.';

  if (c10.isReversed) {
    html += ' 역방향이므로, 흐름을 바꾸기 위한 의식적인 노력이 필요합니다.';
  } else {
    html += ' 정방향이므로, 현재 방향을 유지하며 신뢰를 가져보세요.';
  }

  html += '<br><br>';
  html += '    켈틱크로스는 가장 포괄적인 스프레드입니다. 10장의 카드를 하나의 이야기로 연결하여 ';
  html += '    전체적인 그림을 조망해 보세요. 더 깊은 해석을 원하시면 아래 AI 전문가 분석을 추천합니다.';
  html += '  </p>';
  return html;
}

// 첫 번째 키워드 가져오기 헬퍼
function getFirstKeyword(card) {
  var meaning = card.isReversed ? card.reversedData : card.uprightData;
  if (!meaning || !meaning.keywords) {
    var orig = findCardById(card.id);
    if (orig) meaning = card.isReversed ? orig.reversed : orig.upright;
  }
  return (meaning && meaning.keywords && meaning.keywords[0]) ? meaning.keywords[0] : '직관';
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