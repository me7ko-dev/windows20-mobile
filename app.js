import { initTheme } from './core/theme.js'
import { mountShell } from './core/shell.js'
import './apps/notes.js'
import './apps/settings.js'
import './apps/web-apps.js'

initTheme()
mountShell(document.getElementById('app'))

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      // offline support just won't be available this session
    })
  })
}
