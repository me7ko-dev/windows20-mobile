const STORAGE_KEY = 'w20.theme'

function resolve(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function apply(theme) {
  document.documentElement.setAttribute('data-theme', resolve(theme))
}

export function getTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'dark'
  } catch {
    return 'dark'
  }
}

export function setTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // storage unavailable (private mode) — theme just won't persist
  }
  apply(theme)
}

export function initTheme() {
  apply(getTheme())
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getTheme() === 'system') apply('system')
  })
}
