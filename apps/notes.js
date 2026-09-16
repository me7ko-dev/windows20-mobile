import { registerApp } from '../core/plugin-registry.js'

const STORAGE_KEY = 'w20.notes'

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // storage unavailable — notes just won't persist this session
  }
}

function formatDate(ms) {
  return new Date(ms).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function mount(container) {
  let notes = loadNotes()
  let view = { mode: 'list' } // { mode: 'list' } | { mode: 'edit', id: string | null }

  const root = document.createElement('div')
  root.className = 'w20m-notes'
  container.appendChild(root)

  function render() {
    root.innerHTML = ''
    if (view.mode === 'list') renderList()
    else renderEditor()
  }

  function renderList() {
    const toolbar = document.createElement('div')
    toolbar.className = 'w20m-notes-toolbar'
    const addBtn = document.createElement('button')
    addBtn.textContent = '+ Нова бележка'
    addBtn.addEventListener('click', () => {
      view = { mode: 'edit', id: null }
      render()
    })
    toolbar.appendChild(addBtn)
    root.appendChild(toolbar)

    if (notes.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'w20m-notes-empty'
      empty.textContent = 'Няма бележки още.'
      root.appendChild(empty)
      return
    }

    const list = document.createElement('div')
    list.className = 'w20m-notes-list'
    for (const note of [...notes].sort((a, b) => b.updatedAt - a.updatedAt)) {
      const row = document.createElement('button')
      row.className = 'w20m-notes-row'
      row.innerHTML = `
        <span class="w20m-notes-row-title">${escapeHtml(note.title || 'Без заглавие')}</span>
        <span class="w20m-notes-row-date">${formatDate(note.updatedAt)}</span>
      `
      row.addEventListener('click', () => {
        view = { mode: 'edit', id: note.id }
        render()
      })
      list.appendChild(row)
    }
    root.appendChild(list)
  }

  function renderEditor() {
    const note = notes.find((n) => n.id === view.id) || { id: null, title: '', body: '' }

    const toolbar = document.createElement('div')
    toolbar.className = 'w20m-notes-toolbar'

    const backBtn = document.createElement('button')
    backBtn.textContent = '‹ Списък'
    backBtn.addEventListener('click', () => {
      view = { mode: 'list' }
      render()
    })
    toolbar.appendChild(backBtn)

    if (note.id) {
      const delBtn = document.createElement('button')
      delBtn.className = 'w20m-notes-delete'
      delBtn.textContent = 'Изтрий'
      delBtn.addEventListener('click', () => {
        notes = notes.filter((n) => n.id !== note.id)
        saveNotes(notes)
        view = { mode: 'list' }
        render()
      })
      toolbar.appendChild(delBtn)
    }
    root.appendChild(toolbar)

    const titleInput = document.createElement('input')
    titleInput.className = 'w20m-notes-title-input'
    titleInput.placeholder = 'Заглавие'
    titleInput.value = note.title
    root.appendChild(titleInput)

    const bodyInput = document.createElement('textarea')
    bodyInput.className = 'w20m-notes-body-input'
    bodyInput.placeholder = 'Текст…'
    bodyInput.value = note.body
    root.appendChild(bodyInput)

    function persist() {
      const title = titleInput.value
      const body = bodyInput.value
      if (note.id) {
        const existing = notes.find((n) => n.id === note.id)
        existing.title = title
        existing.body = body
        existing.updatedAt = Date.now()
      } else if (title.trim() || body.trim()) {
        note.id = `note-${Date.now()}`
        note.title = title
        note.body = body
        note.updatedAt = Date.now()
        notes.push(note)
        view = { mode: 'edit', id: note.id }
      }
      saveNotes(notes)
    }

    titleInput.addEventListener('input', persist)
    bodyInput.addEventListener('input', persist)
  }

  render()

  return () => {
    // no timers/listeners outside `root` to release; container is cleared by the shell
  }
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

registerApp({ id: 'notes', title: 'Бележки', icon: '📝', mount })
