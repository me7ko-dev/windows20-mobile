import { registerApp } from '../core/plugin-registry.js'
import { createWebApp } from '../core/web-app.js'

/**
 * Desktop programs, as they exist on a phone: their official web versions.
 * Each one becomes its own home-screen icon, registered through the same
 * plugin slot as the built-in apps.
 */
export const WEB_APPS = [
  {
    id: 'chrome',
    title: 'Chrome',
    icon: '🌐',
    url: 'https://www.google.com',
    description:
      'Google Chrome не може да се инсталира като .exe тук — това отваря Google в браузъра на телефона.'
  },
  {
    id: 'claude',
    title: 'Claude',
    icon: '🤖',
    url: 'https://claude.ai',
    description: 'Claude в уеб — чат, проекти и артефакти, директно от акаунта ти.'
  },
  {
    id: 'claude-code',
    title: 'Claude Code',
    icon: '⌨️',
    url: 'https://claude.ai/code',
    description:
      'Claude Code в браузъра: сесии върху твоите repo-та, без да е нужен локален терминал.'
  },
  {
    id: 'gemini',
    title: 'Gemini',
    icon: '✨',
    url: 'https://gemini.google.com',
    description: 'Google Gemini — уеб версията на асистента.'
  },
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    icon: '💬',
    url: 'https://chatgpt.com',
    description: 'ChatGPT в уеб.'
  },
  {
    id: 'github',
    title: 'GitHub',
    icon: '🐙',
    url: 'https://github.com',
    description: 'Кодът ти, issues и pull request-и.'
  },
  {
    id: 'vscode',
    title: 'VS Code',
    icon: '🧩',
    url: 'https://vscode.dev',
    description: 'VS Code for the Web — редактор, който работи изцяло в браузъра.'
  },
  {
    id: 'youtube',
    title: 'YouTube',
    icon: '▶️',
    url: 'https://m.youtube.com',
    description: 'Мобилната версия на YouTube.'
  }
]

for (const def of WEB_APPS) {
  registerApp(createWebApp(def))
}
