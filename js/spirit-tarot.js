/**
 * 영타로 (Spirit Tarot) 모듈
 */

var spiritTimerInterval = null;
var spiritDeckCards = [];
var spiritSelectedCards = [];
var spiritJumpCardTriggered = false;

function startSpiritTarot() {
  document.getElementById('spread-selection').classList.add('hidden');
  document.getElementById('three-card-options').classList.add('hidden');
  document.getElementById('spirit-tarot-area').classList.remove('hidden');

  spiritSelectedCards = [];
  spiritJumpCardTriggered = false;
  spiritDeckCards = shuffleArray(getAllCards());

  document.getElementById('spirit-shuffle').classList.add('hidden');
  document.getElementById('spirit-jump-card').classList.add('hidden');
  document.getElementById('spirit-selected-cards').innerHTML = '';

  currentQuestion = prompt('마음속 질문을 떠올려보세요.\n질문을 입력하세요 (선택사항):', '') || '';

  startMeditationTimer();
}

// ============================================
// 명상 타이머
// ============================================
function startMeditationTimer() {
  var timerEl = document.getElementById('spirit-timer');
  var countEl = document.getElementById('timer-count');

  timerEl.classList.remove('hidden');
  document.getElementById('spirit-shuffle').classList.add('hidden');

  var seconds = 15;
  countEl.textContent = seconds;

  if (spiritTimerInterval) clearInterval(spiritTimerInterval);

  spiritTimerInterval = setInterval(function() {
    seconds--;
    countEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(spiritTimerInterval);
      spiritTimerInterval = null;
      timerEl.classList.add('hidden');
      startSpiritShuffle();
    }
  }, 1000);
}

// ============================================
// 영적 셔플
// ============================================
function startSpiritShuffle() {
  document.getElementById('spirit-shuffle').classList.remove('hidden');

  if (Math.random() < 0.2 && spiritSelectedCards.length === 0) {
    setTimeout(function() {
      spiritJumpCardTriggered = true;
      document.getElementById('spirit-jump-card').classList.remove('hidden');

      var jumpCard = spiritDeckCards[Math.floor(Math.random() * spiritDeckCards.length)];
      var isReversed = Math.random() < 0.3;

      spiritSelectedCards.push({
        id: jumpCard.id,
        number: jumpCard.number,
        name: jumpCard.name,
        nameEn: jumpCard.nameEn,
        category: jumpCard.category,
        image: jumpCard.image,
        uprightData: jumpCard.upright,
        reversedData: jumpCard.reversed,
        symbols: jumpCard.symbols,
        element: jumpCard.element,
        isReversed: isReversed,
        isJumpCard: true
      });

      renderSpiritSelectedCards();
      updateSpiritInstruction();
    }, Math.random() * 3000 + 2000);
  }

  updateSpiritInstruction();
}

// ============================================
// 카드 선택
// ============================================
function spiritDrawCard() {
  var normalCards = [];
  for (var n = 0; n < spiritSelectedCards.length; n++) {
    if (!spiritSelectedCards[n].isJumpCard) normalCards.push(spiritSelectedCards[n]);
  }

  if (normalCards.length >= 3) return;

  var selectedIds = [];
  for (var s = 0; s < spiritSelectedCards.length; s++) {
    selectedIds.push(spiritSelectedCards[s].id);
  }

  var available = [];
  for (var a = 0; a < spiritDeckCards.length; a++) {
    if (selectedIds.indexOf(spiritDeckCards[a].id) === -1) {
      available.push(spiritDeckCards[a]);
    }
  }

  if (available.length === 0) return;

  var card = available[Math.floor(Math.random() * available.length)];
  var isReversed = Math.random() < 0.3;

  spiritSelectedCards.push({
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

  renderSpiritSelectedCards();
  updateSpiritInstruction();

  spiritDeckCards = shuffleArray(spiritDeckCards);

  // 다시 카운트
  var newNormalCount = 0;
  for (var nc = 0; nc < spiritSelectedCards.length; nc++) {
    if (!spiritSelectedCards[nc].isJumpCard) newNormalCount++;
  }

  if (newNormalCount >= 3) {
    setTimeout(function() {
      // ★ 전역 변수에 설정
      selectedReadingCards = [];
      for (var x = 0; x < spiritSelectedCards.length; x++) {
        selectedReadingCards.push(spiritSelectedCards[x]);
      }
      showReadingResult();
    }, 1000);
  }
}

function updateSpiritInstruction() {
  var normalCount = 0;
  for (var i = 0; i < spiritSelectedCards.length; i++) {
    if (!spiritSelectedCards[i].isJumpCard) normalCount++;
  }
  var remaining = 3 - normalCount;

  var btn = document.querySelector('.spirit-draw-btn');
  if (btn) {
    if (remaining > 0) {
      btn.textContent = '✨ 카드를 선택합니다 (' + remaining + '장 남음) ✨';
      btn.disabled = false;
    } else {
      btn.textContent = '✨ 리딩 준비 완료 ✨';
      btn.disabled = true;
    }
  }
}

function renderSpiritSelectedCards() {
  var area = document.getElementById('spirit-selected-cards');
  var html = '';

  for (var i = 0; i < spiritSelectedCards.length; i++) {
    var card = spiritSelectedCards[i];

    // 라벨 결정
    var label = '';
    if (card.isJumpCard) {
      label = '🌟 점프카드';
    } else {
      var normalIndex = 0;
      for (var j = 0; j <= i; j++) {
        if (!spiritSelectedCards[j].isJumpCard) normalIndex++;
      }
      label = '영적 메시지 ' + normalIndex;
    }

    var imgClass = card.isReversed ? 'reversed' : '';
    var direction = card.isReversed ? '역방향' : '정방향';

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
