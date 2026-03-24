/**
 * Gemini AI 분석 모듈
 * - 관리자 세션 있음 → AI 분석 모달 (제한 없음)
 * - 일반 사용자 → 무료 1회/일 AI 분석 또는 의뢰 안내
 */

let aiModalPassword = '';
let aiModalVerified = false;

// ============================================
// ★ AI 분석 버튼 클릭 핸들러 (3단 분기)
// ============================================
function handleAIAnalysisClick() {
  var savedPw = sessionStorage.getItem('tarot-admin-pw');

  if (savedPw) {
    // ★ 관리자: AI 분석 모달 (제한 없음)
    aiModalPassword = savedPw;
    aiModalVerified = true;
    openAIAnalysisModal();
  } else {
    // ★ 일반 사용자: 무료 분석 시도
    handleFreeAIAnalysis();
  }
}

// ============================================
// ★ 무료 AI 분석 (1회/일)
// ============================================
function handleFreeAIAnalysis() {
  var usage = getFreeAIUsage();

  if (usage.count >= 1) {
    // 이미 사용함 → 의뢰 안내
    showFreeAILimitModal();
  } else {
    // 무료 분석 실행
    executeFreeAIAnalysis();
  }
}

// 오늘 사용 횟수 확인
function getFreeAIUsage() {
  var today = new Date().toDateString();
  var saved = localStorage.getItem('tarot-ai-usage');
  if (saved) {
    var data = JSON.parse(saved);
    if (data.date === today) {
      return { date: today, count: data.count || 0 };
    }
  }
  return { date: today, count: 0 };
}

// 사용 횟수 저장
function saveFreeAIUsage() {
  var today = new Date().toDateString();
  var usage = getFreeAIUsage();
  localStorage.setItem('tarot-ai-usage', JSON.stringify({
    date: today,
    count: usage.count + 1
  }));
}

// ============================================
// ★ 무료 분석 실행
// ============================================
async function executeFreeAIAnalysis() {
  var prompt = buildFreePrompt();

  if (!prompt) {
    showToast('분석할 카드 정보가 없습니다.', 'error');
    return;
  }

  // UI 업데이트: 버튼 → 로딩 상태
  var section = document.getElementById('ai-analysis-section');
  section.innerHTML =
    '<div class="ai-free-loading">' +
    '  <div class="loading-spinner"></div>' +
    '  <p>🔮 AI가 카드를 분석하고 있습니다...</p>' +
    '  <p style="font-size:0.8rem; color:var(--text-light);">약 5~10초 소요됩니다</p>' +
    '</div>';

  try {
    var response = await fetch(WORKER_URL + '/api/ai/analyze-free', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });

    var data = await response.json();

    if (data.success) {
      // 성공 → 사용 횟수 저장
      saveFreeAIUsage();

      // 결과 인라인 표시
      section.innerHTML =
        '<div class="ai-free-result">' +
        '  <div class="ai-free-result-header">' +
        '    <h4>🔮 AI 분석 결과</h4>' +
        '    <span class="ai-free-badge">무료 분석</span>' +
        '  </div>' +
        '  <div class="ai-free-result-body">' + formatMarkdown(data.analysis) + '</div>' +
        '  <div class="ai-free-result-footer">' +
        '    <p class="ai-disclaimer">' +
        '      본 분석은 AI가 타로 전통 해석을 바탕으로 생성한 참고용 결과입니다.<br>' +
        '      의료·법률·재정 등 전문 분야의 조언을 대체하지 않습니다.' +
        '    </p>' +
        '    <div class="ai-free-actions">' +
        '      <button class="btn btn-secondary btn-sm" onclick="copyFreeAIResult()">📋 결과 복사</button>' +
        '      <button class="btn btn-primary btn-sm" onclick="goToRequestFromFree()">💎 더 깊은 전문 분석 받기</button>' +
        '    </div>' +
        '  </div>' +
        '</div>';

      showToast('AI 분석이 완료되었습니다! ✨', 'success');
    } else {
      // 실패 → 원래 버튼 복원
      restoreAISection('분석 실패: ' + (data.error || '알 수 없는 오류'));
      showToast('AI 분석에 실패했습니다.', 'error');
    }
  } catch (err) {
    restoreAISection('서버 연결 실패');
    showToast('서버 연결에 실패했습니다: ' + err.message, 'error');
  }
}

// ============================================
// 무료 분석용 프롬프트 생성 (간결 버전)
// ============================================
function buildFreePrompt() {
  var cards = selectedReadingCards || [];
  var spreadType = currentSpreadType || 'one-card';
  var question = currentQuestion || '';

  if (cards.length === 0) return null;

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

  return '당신은 따뜻하고 통찰력 있는 전문 타로 리더입니다.\n\n' +
    '=== 질문 ===\n' +
    (question || '오늘의 운세/메시지를 알고 싶습니다.') + '\n\n' +
    '=== 스프레드 ===\n' +
    getSpreadName(spreadType) + '\n\n' +
    '=== 카드 ===\n' +
    cardDetails + '\n' +
    '=== 키워드 참고 ===\n' +
    cardKeywords + '\n' +
    '=== 분석 요청 ===\n' +
    '1. 각 카드의 위치별 의미를 간결하게 해석해 주세요.\n' +
    '2. 전체적인 흐름과 메시지를 설명해 주세요.\n' +
    '3. 질문에 대한 핵심 조언을 제공해 주세요.\n' +
    '4. 따뜻한 마무리 메시지를 포함해 주세요.\n\n' +
    '한국어로 작성하고, 마크다운 형식(##, **, - 등)을 사용해 주세요.';
}

// ============================================
// AI 섹션 복원 (에러 시)
// ============================================
function restoreAISection(errorMsg) {
  var section = document.getElementById('ai-analysis-section');
  var usage = getFreeAIUsage();
  var remaining = Math.max(0, 1 - usage.count);

  section.innerHTML =
    '<button class="btn btn-primary btn-lg" onclick="handleAIAnalysisClick()">' +
    '  🔮 AI 전문가 분석 받기' +
    '</button>' +
    '<p style="font-size:0.8rem; color:var(--text-light); margin-top:0.5rem;">' +
    '  AI가 타로 전통 해석을 바탕으로 분석합니다 (오늘 ' + remaining + '회 남음)' +
    '</p>' +
    (errorMsg ? '<p class="error-text" style="margin-top:0.5rem;">⚠️ ' + errorMsg + '</p>' : '');
}

// ============================================
// ★ 무료 분석 횟수 초과 시 안내 모달
// ============================================
function showFreeAILimitModal() {
  var section = document.getElementById('ai-analysis-section');
  section.innerHTML =
    '<div class="ai-limit-notice">' +
    '  <div class="ai-limit-icon">🌙</div>' +
    '  <h4>오늘의 무료 AI 분석을 이미 사용했습니다</h4>' +
    '  <p>무료 AI 분석은 하루 1회 제공됩니다.<br>내일 다시 이용하실 수 있습니다.</p>' +
    '  <div class="ai-limit-divider"></div>' +
    '  <p style="font-size:0.85rem;">더 깊고 전문적인 분석이 필요하신가요?</p>' +
    '  <button class="btn btn-primary" onclick="goToRequestFromFree()">' +
    '    💎 전문 상담 의뢰하기' +
    '  </button>' +
    '  <button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="restoreAISection(\'\')">' +
    '    닫기' +
    '  </button>' +
    '</div>';
}

// ============================================
// 무료 결과 복사
// ============================================
function copyFreeAIResult() {
  var body = document.querySelector('.ai-free-result-body');
  if (!body) return;
  var text = body.innerText;
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
// 무료 분석 결과에서 의뢰 페이지로 이동
// ============================================
function goToRequestFromFree() {
  goToRequestWithQuestion();
}

// ============================================
// 일반 사용자 → 의뢰 페이지로 이동
// ============================================
function goToRequestWithQuestion() {
  var question = currentQuestion || '';

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

  navigateTo('request');

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
      if (currentSpreadType === 'one-card') {
        spreadSelect.value = 'one-card';
      } else if (currentSpreadType.startsWith('three-')) {
        spreadSelect.value = 'three-card';
      } else if (currentSpreadType === 'celtic-cross') {
        spreadSelect.value = 'celtic-cross';
      } else {
        spreadSelect.value = '';
      }
    }
  }, 300);

  showToast('전문 상담을 의뢰해 보세요! ✨', 'info');
}

// ============================================
// AI 분석 모달 열기 (관리자 전용)
// ============================================
function openAIAnalysisModal() {
  var modal = document.getElementById('ai-analysis-modal');
  modal.classList.remove('hidden');

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

  // 켈틱크로스 전용 분석 지시
  var analysisInstructions = '';
  if (spreadType === 'celtic-cross') {
    analysisInstructions =
      '=== 분석 요청 (켈틱크로스 10장) ===\n' +
      '1. 중심부 분석 (카드 ①②): 현재 상황과 핵심 도전을 해석해 주세요.\n' +
      '2. 수직축 분석 (카드 ③④): 의식적 목표와 무의식적 기반의 관계를 설명해 주세요.\n' +
      '3. 시간축 분석 (카드 ⑤⑥): 과거의 영향과 다가올 에너지의 흐름을 해석해 주세요.\n' +
      '4. 기둥 분석 (카드 ⑦⑧⑨⑩): 자신의 태도, 환경, 희망/두려움, 최종 결과를 심층 해석해 주세요.\n' +
      '5. 전체 흐름: 10장의 카드가 하나의 이야기로 어떻게 연결되는지 설명해 주세요.\n' +
      '6. 핵심 조언: 최종 결과(⑩)를 긍정적으로 이끌기 위한 구체적 행동 가이드를 제공해 주세요.\n' +
      '7. 긍정적이고 건설적인 마무리 메시지를 포함해 주세요.\n';
  } else {
    analysisInstructions =
      '=== 분석 요청 ===\n' +
      '1. 각 카드의 위치별 의미를 해석해 주세요.\n' +
      '2. 카드들 간의 관계와 전체적인 흐름을 설명해 주세요.\n' +
      '3. 질문에 대한 구체적인 조언을 제공해 주세요.\n' +
      '4. 긍정적이고 건설적인 마무리 메시지를 포함해 주세요.\n';
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
    analysisInstructions + '\n' +
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
// STEP 3: AI 분석 실행 (관리자)
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
// 결과 복사 (관리자 모달)
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