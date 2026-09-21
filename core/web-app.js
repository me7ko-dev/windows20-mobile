/**
 * Helper for apps that are really web destinations (Chrome, Claude, Gemini…).
 *
 * A PWA cannot run a Windows .exe, and the big providers all send
 * `X-Frame-Options` / `frame-ancestors`, so embedding them in an <iframe>
 * fails silently — the frame just stays blank. Anything marked
 * `embeddable: false` therefore gets a launch card instead of a frame, and
 * embeddable ones get a frame plus the same "open outside" escape hatch.
 */

export function openExternal(url) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

function launchCard({ title, url, description }) {
  const card = document.createElement('div')
  card.className = 'w20m-web-card'

  const host = new URL(url).host

  const desc = document.createElement('p')
  desc.className = 'w20m-web-desc'
  desc.textContent = description
  card.appendChild(desc)

  const openBtn = document.createElement('button')
  openBtn.className = 'w20m-web-open'
  openBtn.textContent = `Отвори ${title}`
  openBtn.addEventListener('click', () => openExternal(url))
  card.appendChild(openBtn)

  const hostEl = document.createElement('p')
  hostEl.className = 'w20m-web-host'
  hostEl.textContent = host
  card.appendChild(hostEl)

  return card
}

export function createWebApp({ id, title, icon, url, description, embeddable = false }) {
  function mount(container) {
    if (!embeddable) {
      container.appendChild(launchCard({ title, url, description }))
      return
    }

    const frame = document.createElement('iframe')
    frame.className = 'w20m-web-frame'
    frame.src = url
    frame.referrerPolicy = 'no-referrer'
    frame.sandbox = 'allow-scripts allow-forms allow-popups allow-same-origin'
    container.appendChild(frame)
    container.appendChild(launchCard({ title, url, description }))
  }

  return { id, title, icon, url, description, embeddable, mount }
}
