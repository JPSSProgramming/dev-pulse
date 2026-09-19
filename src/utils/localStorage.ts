const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(key);
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  const raw = getStorageItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};
