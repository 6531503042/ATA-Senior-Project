export function getToken(key: string): string | null {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem(key);
}

export function saveToken(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}

export function removeToken(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
