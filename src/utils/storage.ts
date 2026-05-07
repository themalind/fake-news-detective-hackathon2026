const PREFIX = 'fnd:';

const key = (k: string) => `${PREFIX}${k}`;

export const storage = {
  get<T>(k: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key(k));
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(k: string, value: T): void {
    try {
      localStorage.setItem(key(k), JSON.stringify(value));
    } catch {
      // Quota full eller privat läge — ignorera tyst, state finns kvar i minnet.
    }
  },

  remove(k: string): void {
    try {
      localStorage.removeItem(key(k));
    } catch {
      // ignorera
    }
  },
};
