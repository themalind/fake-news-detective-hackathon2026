// Enkel localStorage-wrapper för spelets statistik och annan data.
// Alla nycklar prefixas så vi inte krockar med annat på samma origin.
const PREFIX = 'fnd:'

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key)
}

export function clearAll() {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(PREFIX)) localStorage.removeItem(key)
  }
}
