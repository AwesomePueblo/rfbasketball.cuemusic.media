const STORAGE_KEY = 'rfb-theme';

const THEMES = [
  {
    id: 'forest',
    name: 'Forest',
    primary: '#22c55e',
    primaryLight: '#4ade80',
    primaryDark: '#166534',
    accent: '#facc15',
    bgBase: '#050914',
    bgOrb2: '#7c3aed',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    primary: '#38bdf8',
    primaryLight: '#7dd3fc',
    primaryDark: '#0369a1',
    accent: '#34d399',
    bgBase: '#020b18',
    bgOrb2: '#2563eb',
  },
  {
    id: 'flame',
    name: 'Flame',
    primary: '#f97316',
    primaryLight: '#fb923c',
    primaryDark: '#c2410c',
    accent: '#facc15',
    bgBase: '#0f0500',
    bgOrb2: '#dc2626',
  },
  {
    id: 'royal',
    name: 'Royal',
    primary: '#a855f7',
    primaryLight: '#c084fc',
    primaryDark: '#7e22ce',
    accent: '#ec4899',
    bgBase: '#09050f',
    bgOrb2: '#6d28d9',
  },
  {
    id: 'gold',
    name: 'Gold',
    primary: '#eab308',
    primaryLight: '#facc15',
    primaryDark: '#a16207',
    accent: '#f97316',
    bgBase: '#0c0a00',
    bgOrb2: '#b45309',
  },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-light', theme.primaryLight);
  root.style.setProperty('--primary-dark', theme.primaryDark);
  root.style.setProperty('--accent', theme.accent);
  root.style.setProperty('--bg-base', theme.bgBase);
  root.style.setProperty('--bg-orb-2', theme.bgOrb2);
  root.style.setProperty('--border-accent', `rgba(${hexToRgb(theme.primary)}, 0.35)`);
  root.style.setProperty('--shadow-glow', `0 0 40px rgba(${hexToRgb(theme.primary)}, 0.25)`);

  const primaryRgb = hexToRgb(theme.primary);
  const accentRgb = hexToRgb(theme.accent);
  document.body.style.background = `
    radial-gradient(circle at 20% 0%, rgba(${primaryRgb}, 0.12), transparent 40%),
    radial-gradient(circle at 80% 100%, rgba(${accentRgb}, 0.08), transparent 50%),
    ${theme.bgBase}
  `;

  document.querySelectorAll('.theme-bar-swatch').forEach(el => {
    el.classList.toggle('active', el.dataset.themeId === theme.id);
  });
}

function buildThemeBar() {
  const bar = document.getElementById('theme-bar');
  if (!bar) return;

  const savedId = localStorage.getItem(STORAGE_KEY) || 'forest';

  bar.innerHTML = `
    <span class="theme-bar-label">Theme</span>
    ${THEMES.map(t => `
      <button
        class="theme-bar-swatch${t.id === savedId ? ' active' : ''}"
        data-theme-id="${t.id}"
        title="${t.name}"
        aria-label="${t.name} theme"
        style="background:${t.primary};"
      ></button>`).join('')}
  `;

  bar.querySelectorAll('.theme-bar-swatch').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = THEMES.find(t => t.id === btn.dataset.themeId);
      if (!theme) return;
      applyTheme(theme);
      localStorage.setItem(STORAGE_KEY, theme.id);
    });
  });
}

function init() {
  const savedId = localStorage.getItem(STORAGE_KEY) || 'forest';
  const theme = THEMES.find(t => t.id === savedId) || THEMES[0];
  applyTheme(theme);
  buildThemeBar();
}

init();
