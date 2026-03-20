// ========================================
// spirit-tarot.js - 영타로 모듈
// ========================================

let spiritState = {
  phase: 'intro',     // intro, meditate, shuffle, select, result
  deck: [],
  selected: [],
  timer: null,
  meditationTime: 15
};

function startSpiritTarot() {
  const container = document.getElementById('reading-container');
  spiritState = {
    phase: 'intro',
    deck: [],
    selected: [],
    timer: null,
    meditationTime: 15
  };

  container.innerHTML = `
    <div class="spirit-tarot-section">
      <h2>👁️ 영타로 리딩</h2>

      <!-- 가이드 설명 -->
      <div class="spirit-guide" id="spirit-guide">
        <div class="spirit-guide-box">
          <h3>🌟 영타로란?</h3>
          <div class="spirit-guide-content">
            <p>영타로(Spirit Tarot)는 <strong>직관과 영감</strong>을 활용하는 특별한 리딩 방법입니다.</p>

            <h4>📋 진행 방법</h4>
            <ol>
              <li><strong>명상 (15초)</strong> - 마음을 가라앉히고 질문에 집중합니다</li>
              <li><strong>셔플</strong> - 카드가 자동으로 섞이는 것을 바라봅니다</li>
              <li><strong>카드 선택</strong> - "느낌이 올 때" 화면을 터치합니다</li>
              <li><strong>총 3장</strong>을 직감으로 선택합니다</li>
            </ol>

            <h4>💡 핵심 포인트</h4>
            <ul>
              <li>머리로 고르지 말고, <strong>끌리는 느낌</strong>에 따르세요</li>
              <li>셔플 중 카드가 <strong>튀어나오면 (점프카드)</strong> 자동으로 선택됩니다</li>
              <li>점프카드는 영적 메시지가 강한 카드입니다</li>
              <li>편안한 마음으로 카드와 교감한다고 생각하세요</li>
            </ul>

            <h4>🎯 이런 질문에 적합해요</h4>
            <p>"내가 알아야 할 것은?", "영적으로 전하고 싶은 메시지는?", "숨겨진 진실은?"</p>
          </div>
        </div>

        <div class="form-group" style="margin-top: 16px;">
          <textarea id="spirit-question" rows="2" placeholder="질문을 마음에 품어보세요 (선택사항)"></textarea>
        </div>

        <button class="btn-primary btn-lg btn-full" onclick="startMeditation()">🧘 명상 시작하기</button>
      </div>

      <!-- 명상 단계 -->
      <div id="spirit-meditate" style="display:none;">
        <div class="meditation-box">
          <div class="meditation-circle" id="meditation-circle">
            <span class="meditation-timer" id="meditation-timer">${spiritState.meditationTime}</span>
          </div>
          <p class="meditation-text">눈을 감고 깊게 호흡하세요...</p>
          <p class="meditation-sub">질문을 마음속으로 떠올리세요</p>
        </div>
      </div>

      <!-- 셔플 & 카드 선택 -->
      <div id="spirit-shuffle" style="display:none;">
        <div class="shuffle-area">
          <p class="shuffle-instruction" id="shuffle-instruction">카드가 섞이고 있습니다...</p>
          <p class="shuffle-sub" id="shuffle-sub">느낌이 올 때 아래 카드를 탭하세요</p>
          <div class="shuffle-deck" id="shuffle-deck">
            <div class="shuffle-card-stack" onclick="spiritSelectCard()">
              <div class="shuffle-card sc-1">🂠</div>
              <div class="shuffle-card sc-
