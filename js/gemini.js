/**
 * Gemini AI 분석 모듈
 * - 관리자 세션 있음 → AI 분석 모달
 * - 일반 사용자 → 의뢰 페이지로 이동
 */

let aiModalPassword = '';
let aiModalVerified = false;

// ============================================
// ★ AI 분석 버튼 클릭 핸들러 (분기 처리)
// ============================================
function handleAIAnalysisClick() {
  // 관리자 세션 확인 (admin.js에서 로그인 시 저장됨)
  var savedPw = sessionStorage.getItem('tarot-admin-pw');

  if (savedPw) {
    // ★ 관리자: AI 분석 모달 열기
    aiModalPassword = savedPw;
    aiModalVerified = true;
    openAIAnalysisModal();
  } else {
    // ★ 일반 사용자: 의뢰 페이지로 이동 + 질문 자동 채움
    goToRequestWithQuestion();
  }
}

// ============================================
// 일반 사용자 → 의뢰 페이지로 이동
// ============================================
function goToRequestWithQuestion() {
  // 현재 리딩 정보를 의뢰 폼에 채우기
  var question = currentQuestion || '';
  var spreadName = getSpreadName(currentSpreadType) || '';

  // 카드 정보 텍스트
  var cardInfo = '';
  if (selectedReadingCards && selectedReadingCards.length > 0) {
    var labels = getPositionLabels(currentSpreadType);
    for (var i = 0; i < selectedReadingCards.length; i++) {
      var card = selectedReadingCards[i];
      var direction = card.isReversed ? '역방향' : '정방향';
      var label = card.isJumpCard ? '점프카드' : (labels[i] || '카드 ' + (i + 1));
      cardInfo += label + ': ' + card.name + '(' + direction + ')';
      if (i < selectedReadingCards.length - 1) cardInfo += ', ';
    }
  }

  // 의뢰 페이지로 이동
  navigateTo('request');

  // 약간의 지연 후 폼에 데이터 채우기
  setTimeout(function() {
    var questionInput = document.getElementById('request-question');
    var spreadSelect = document.getElementById('request-spread');

    if (questionInput && question) {
      var autoText = question;
      if (cardInfo) {
        autoText += '\n\n[리딩 카드] ' + cardInfo;
      }
      questionInput.value = autoText;
    }

    if (spreadSelect && currentSpreadType) {
      // 스프레드 타입 매칭 시도
      if (currentSpreadType === 'one-card') {
        spreadSelect.value = '원카드';
      } else if (currentSpreadType.startsWith('three-')) {
        spreadSelect.value = '쓰리카드';
      } else {
        spreadSelect.value = '전문가 추천';
      }
    }
  }, 300);

  showToast('전문가 분석을 의뢰해 보세요! ✨', 'info');
}

// ============================================
// AI 분석 모달 열기 (관리자 전용)
// ============================================
function openAIAnalysisModal() {
  var modal = document.getElementById('ai-analysis-modal');
  modal.classList.remove('hidden');

  // 관리자 세션이 있으면 바로 프롬프트로
  if (aiModalVerified && aiModalPassword) {
    showAIPromptStep();
  } else {
    showAIPasswordStep();
  }
}

function closeAIAnalysisModal() {
  document.getElementById('ai-analysis-modal').classList.add('hidden');
}

// ============================================
// STEP 1: 비밀번호 입력 (세션 없을 때만)
// ============================================
function showAIPasswordStep() {
  document.getElementById('ai-step-password').classList.remove('hidden');
  document.getElementById('ai-step-prompt').classList.add('hidden');
  document.getElementById('ai-step-result').classList.add('hidden');
  document.getElementById('ai-password-error').classList.add('hidden');
  document.getElementById('ai-modal-password').value = '';
  document.getElementById('ai-modal-password').focus();
}

async function verifyAIPassword() {
  var password = document.getElementById('ai-modal-password').value;
  var errorEl = document.getElementById('ai-password-error');

  if (!password) {
    errorEl.textContent = '비밀번호를 입력하세요';
    errorEl.classList.remove('hidden');
    return;
  }

  showLoading('인증 확인 중...');

  try {
    var response = await fetch(WORKER_URL + '/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    });

    var data = await response.json();
    hideLoading();

    if (data.success) {
      aiModalPassword = password;
      aiModalVerified = true;
      showAIPromptStep();
    } else {
      errorEl.textContent = '비밀번호가 틀렸습니다';
      errorEl.classList.remove('hidden');
    }
  } catch (err) {
    hideLoading();
    errorEl.textContent = '서버 연결 실패: ' + err.message;
    errorEl.classList.remove('hidden');
  }
}

// ============================================
// STEP 2: 프롬프트 미리보기 & 수정
// ============================================
function showAIPromptStep() {
  document.getElementById('ai-step-password').classList.add('hidden');
  document.getElementById('ai-step-prompt').classList.remove('hidden');
  document.getElementById('ai-step-result').classList.add('hidden');

  var prompt = buildPromptFromCurrentReading();
  document.getElementById('ai-prompt-preview').value = prompt;
}

function buildPromptFromCurrentReading() {
  var cards = selectedReadingCards || [];
  var spreadType = currentSpreadType || 'one-card';
  var question = currentQuestion || '';

  var positionLabels = getPositionLabels(spreadType);

  var cardDetails = '';
  var cardKeywords = '';

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var isRev = card.isReversed;
    var direction = isRev ? '역방향' : '정방향';
    var label = card.isJumpCard ? '🌟 점프카드' : (positionLabels[i] || '카드 ' + (i + 1));

    cardDetails += '[' + label + '] ' + card.name + ' (' + (card.nameEn || '') + ') — ' + direction + '\n';

    var meaning = isRev ? card.reversedData : card.uprightData;
    if (!meaning || !meaning.keywords) {
      var orig = findCardById(card.id);
      if (orig) meaning = isRev ? orig.reversed : orig.upright;
    }
    var kw = (meaning && meaning.keywords) ? meaning.keywords.join(', ') : '';
    cardKeywords += '  ' + card.name + '(' + direction + '): ' + kw + '\n';
  }

  return '당신은 20년 이상의 경력을 가진 전문 타로 리더입니다.\n' +
    '따뜻하고 통찰력 있는 해석을 제공해 주세요.\n\n' +
    '=== 질문 ===\n' +
    (question || '오늘의 운세/메시지를 알고 싶습니다.') + '\n\n' +
    '=== 스프레드 유형 ===\n' +
    getSpreadName(spreadType) + '\n\n' +
    '=== 선택된 카드 ===\n' +
    cardDetails + '\n' +
    '=== 카드 키워드 참고 ===\n' +
    cardKeywords + '\n' +
    '=== 분석 요청 ===\n' +
    '1. 각 카드의 위치별 의미를 해석해 주세요.\n' +
    '2. 카드들 간의 관계와 전체적인 흐름을 설명해 주세요.\n' +
    '3. 질문에 대한 구체적인 조언을 제공해 주세요.\n' +
    '4. 긍정적이고 건설적인 마무리 메시지를 포함해 주세요.\n\n' +
    '한국어로 작성하고, 마크다운 형식(##, **, - 등)을 사용해 주세요.\n' +
    '"AI"나 "인공지능"이라는 단어는 절대 사용하지 마세요.\n' +
    '전문 타로 리더의 관점에서 자연스럽게 해석해 주세요.';
}

// ============================================
// 프롬프트 복사
// ============================================
function copyAIPrompt() {
  var textarea = document.getElementById('ai-prompt-preview');
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(function() {
    showToast('프롬프트가 복사되었습니다', 'success');
  }).catch(function() {
    document.execCommand('copy');
    showToast('프롬프트가 복사되었습니다', 'success');
  });
}

// ============================================
// STEP 3: AI 분석 실행
// ============================================
async function executeAIAnalysis() {
  var prompt = document.getElementById('ai-prompt-preview').value;

  if (!prompt.trim()) {
    showToast('프롬프트가 비어있습니다', 'error');
    return;
  }

  showLoading('AI가 분석 중입니다... 🔮\n잠시만 기다려주세요');

  try {
    var response = await fetch(WORKER_URL + '/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: aiModalPassword,
        prompt: prompt
      })
    });

    var data = await response.json();
    hideLoading();

    if (data.success) {
      document.getElementById('ai-step-prompt').classList.add('hidden');
      document.getElementById('ai-step-result').classList.remove('hidden');
      document.getElementById('ai-modal-result').innerHTML = formatMarkdown(data.analysis);
      showToast('AI 분석이 완료되었습니다!', 'success');
    } else {
      showToast('분석 실패: ' + data.error, 'error');
    }
  } catch (err) {
    hideLoading();
    showToast('오류: ' + err.message, 'error');
  }
}

// ============================================
// 결과 복사
// ============================================
function copyAIModalResult() {
  var content = document.getElementById('ai-modal-result');
  var text = content.innerText;
  navigator.clipboard.writeText(text).then(function() {
    showToast('분석 결과가 복사되었습니다', 'success');
  }).catch(function() {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('분석 결과가 복사되었습니다', 'success');
  });
}

// ============================================
// 마크다운 → HTML 변환
// ============================================
function formatMarkdown(text) {
  if (!text) return '';
  var html = text
    .replace(/^### (.+)$/gm, '<h3>\$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>\$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>\$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>\$1</em>')
    .replace(/^- (.+)$/gm, '<li>\$1</li>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  html = html.replace(/(<li>.*?<\/li>)+/gs, function(match) { return '<ul>' + match + '</ul>'; });
  return '<div class="markdown-content"><p>' + html + '</p></div>';
}
