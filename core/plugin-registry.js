/**
 * The plugin slot: every app (built-in now, more later) registers itself
 * here. The shell (home screen + app view) never references an app by
 * name — it only ever reads from this registry. Same pattern as the
 * desktop shell's core/PluginRegistry.ts.
 */
const apps = new Map()

export function registerApp(def) {
  apps.set(def.id, def)
}

export function getApp(id) {
  return apps.get(id)
}

export function getApps() {
  return Array.from(apps.values())
}
