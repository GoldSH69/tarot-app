/**
 * Gemini AI 분석 모듈 (관리자 전용)
 */

let adminPassword = '';

async function runAIAnalysis() {
  if (!adminPassword) {
    showToast('먼저 로그인하세요', 'error');
    return;
  }

  const question = document.getElementById('ai-question').value;
  const spreadType = document.getElementById('ai-spread-type').value;
  const context = document.getElementById('ai-context').value;

  // 선택된 카드 확인
  const selectedEls = document.querySelectorAll('.ai-card-option.selected');
  if (selectedEls.length === 0) {
    showToast('카드를 선택해주세요', 'error');
    return;
  }

  const cards = Array.from(selectedEls).map(el => {
    const cardId = el.dataset.cardId;
    const card = findCardById(cardId);
    const reversed = el.dataset.reversed === 'true';
    return {
      id: card.id,
      name: card.name,
      nameEn: card.nameEn,
      reversed
    };
  });

  showLoading('AI가 분석 중입니다... 🔮');

  try {
    const response = await fetch(`${WORKER_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password: adminPassword,
        question,
        cards,
        spreadType,
        additionalContext: context
      })
    });

    const data = await response.json();
    hideLoading();

    if (data.success) {
      const resultDiv = document.getElementById('ai-result');
      const contentDiv = document.getElementById('ai-result-content');

      resultDiv.classList.remove('hidden');
      contentDiv.innerHTML = formatMarkdown(data.analysis);

      showToast('AI 분석이 완료되었습니다!', 'success');
    } else {
      showToast(`분석 실패: ${data.error}`, 'error');
    }
  } catch (err) {
    hideLoading();
    showToast(`오류: ${err.message}`, 'error');
  }
}

function copyAIResult() {
  const content = document.getElementById('ai-result-content');
  if (!content) return;

  const text = content.innerText;
  navigator.clipboard.writeText(text).then(() => {
    showToast('결과가 복사되었습니다', 'success');
  }).catch(() => {
    // fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('결과가 복사되었습니다', 'success');
  });
}

// ============================================
// 간단한 마크다운 → HTML 변환
// ============================================
function formatMarkdown(text) {
  if (!text) return '';

  let html = text
    // 헤더
    .replace(/^### (.+)$/gm, '<h3>\$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>\$1</h2>')
    // 굵게
    .replace(/\*\*(.+?)\*\*/g, '<strong>\$1</strong>')
    // 기울임
    .replace(/\*(.+?)\*/g, '<em>\$1</em>')
    // 목록
    .replace(/^- (.+)$/gm, '<li>\$1</li>')
    // 구분선
    .replace(/^---$/gm, '<hr>')
    // 줄바꿈 → 문단
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // li 태그 그룹화
  html = html.replace(/(<li>.*?<\/li>)+/gs, (match) => `<ul>${match}</ul>`);

  return `<div class="markdown-content"><p>${html}</p></div>`;
}
