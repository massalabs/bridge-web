// Persistent storage keys
export const BRIDGE_MODE_STORAGE_KEY = 'massa-bridge-mode';
export const SELECTED_MASSA_TOKEN_KEY = 'massa-bridge-token';

export function _setInStorage(key: string, value: string): void {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export function _getFromStorage(key: string): string {
  return localStorage.getItem(key) || '';
}
