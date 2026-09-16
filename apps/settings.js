import { registerApp } from '../core/plugin-registry.js'
import { getTheme, setTheme } from '../core/theme.js'

const OPTIONS = [
  { value: 'dark', label: 'Тъмна' },
  { value: 'light', label: 'Светла' },
  { value: 'system', label: 'Системна' }
]

function mount(container) {
  const wrap = document.createElement('div')
  wrap.className = 'w20m-settings'
  wrap.innerHTML = `
    <h2>Тема на интерфейса</h2>
    <div class="w20m-theme-options"></div>
    <p class="w20m-hint">
      Работи изцяло на телефона — без интернет, без облак. Тук по-късно ще се появят
      настройки и за бъдещите модули (AI, известия и др.).
    </p>
  `
  const optionsEl = wrap.querySelector('.w20m-theme-options')

  function render() {
    const current = getTheme()
    optionsEl.innerHTML = ''
    for (const opt of OPTIONS) {
      const btn = document.createElement('button')
      btn.className = 'w20m-theme-option' + (opt.value === current ? ' is-selected' : '')
      btn.textContent = opt.label
      btn.addEventListener('click', () => {
        setTheme(opt.value)
        render()
      })
      optionsEl.appendChild(btn)
    }
  }

  render()
  container.appendChild(wrap)
}

registerApp({ id: 'settings', title: 'Настройки', icon: '⚙️', mount })
