import { getApps } from './plugin-registry.js'

function formatClock(date) {
  return date.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })
}

export function mountShell(root) {
  root.innerHTML = `
    <div class="w20m-shell">
      <div class="w20m-home" data-role="home">
        <div class="w20m-status">
          <span data-role="clock"></span>
        </div>
        <div class="w20m-grid" data-role="grid"></div>
      </div>
      <div class="w20m-app-view" data-role="app-view" hidden>
        <div class="w20m-topbar">
          <button class="w20m-back" data-role="back" aria-label="Назад">&#8249; Начало</button>
          <span class="w20m-app-title" data-role="app-title"></span>
        </div>
        <div class="w20m-app-content" data-role="app-content"></div>
      </div>
    </div>
  `

  const grid = root.querySelector('[data-role="grid"]')
  const clockEl = root.querySelector('[data-role="clock"]')
  const homeEl = root.querySelector('[data-role="home"]')
  const appView = root.querySelector('[data-role="app-view"]')
  const appTitle = root.querySelector('[data-role="app-title"]')
  const appContent = root.querySelector('[data-role="app-content"]')
  const backBtn = root.querySelector('[data-role="back"]')

  let activeCleanup = null

  function renderGrid() {
    grid.innerHTML = ''
    for (const app of getApps()) {
      const btn = document.createElement('button')
      btn.className = 'w20m-app-icon'
      btn.innerHTML = `<span class="w20m-app-icon-glyph">${app.icon}</span><span>${app.title}</span>`
      btn.addEventListener('click', () => openApp(app.id))
      grid.appendChild(btn)
    }
  }

  function openApp(id) {
    const app = getApps().find((a) => a.id === id)
    if (!app) return
    appTitle.textContent = app.title
    appContent.innerHTML = ''
    homeEl.hidden = true
    appView.hidden = false
    history.pushState({ w20app: id }, '', `#${id}`)
    activeCleanup = app.mount(appContent) || null
  }

  function closeApp() {
    if (typeof activeCleanup === 'function') activeCleanup()
    activeCleanup = null
    appContent.innerHTML = ''
    appView.hidden = true
    homeEl.hidden = false
  }

  backBtn.addEventListener('click', () => {
    if (history.state && history.state.w20app) history.back()
    else closeApp()
  })

  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.w20app) {
      openApp(e.state.w20app)
    } else {
      closeApp()
    }
  })

  function tickClock() {
    clockEl.textContent = formatClock(new Date())
  }
  tickClock()
  setInterval(tickClock, 30_000)

  renderGrid()

  const startId = location.hash.replace('#', '')
  if (startId && getApps().some((a) => a.id === startId)) {
    openApp(startId)
  }
}
