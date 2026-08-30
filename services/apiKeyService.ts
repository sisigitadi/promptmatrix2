const STORAGE_KEY = 'promptmatrix_gemini_api_key';

export const getStoredApiKey = (): string => {
  // 1. Check localStorage first (user-entered in UI)
  try {
    const localKey = localStorage.getItem(STORAGE_KEY);
    if (localKey && localKey.trim() !== '') {
      return localKey.trim();
    }
  } catch (e) {
    console.warn('Unable to access localStorage for API key', e);
  }

  // 2. Check Vite environment variable
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_GEMINI_API_KEY) {
        return import.meta.env.VITE_GEMINI_API_KEY;
      }
      if (import.meta.env.VITE_API_KEY) {
        return import.meta.env.VITE_API_KEY;
      }
    }
  } catch (e) {
    // Ignore error in non-Vite contexts
  }

  return '';
};

export const saveApiKey = (key: string): void => {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error saving API key to localStorage', e);
  }
};

export const removeApiKey = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error removing API key from localStorage', e);
  }
};

export const isApiKeyAvailable = (): boolean => {
  return getStoredApiKey().length > 0;
};
