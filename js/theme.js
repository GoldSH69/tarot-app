/**
 * 테마 관리 모듈
 */

const THEMES = ['default', 'mystic', 'dark'];
let currentThemeIndex = 0;

function initTheme() {
  const saved = localStorage.getItem('tarot-theme');
  if (saved && THEMES.includes(saved)) {
    currentThemeIndex = THEMES.indexOf(saved);
  }
  applyTheme(THEMES[currentThemeIndex]);
}

function cycleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
  const theme = THEMES[currentThemeIndex];
  applyTheme(theme);
  localStorage.setItem('tarot-theme', theme);
  showToast(`테마 변경: ${getThemeName(theme)}`, 'info');
}

function applyTheme(theme) {
  const link = document.getElementById('theme-link');
  if (link) {
    link.href = `css/themes/${theme}.css`;
  }
}

function getThemeName(theme) {
  const names = { default: '클린 화이트', mystic: '미스틱', dark: '다크' };
  return names[theme] || theme;
}

// 페이지 로드 시 테마 적용
document.addEventListener('DOMContentLoaded', initTheme);
