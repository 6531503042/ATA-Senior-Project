/**
 * Token storage utilities using localStorage
 */

export const getToken = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Error getting token from localStorage:', error);
    return null;
  }
};

export const saveToken = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Error saving token to localStorage:', error);
  }
};

export const removeToken = (key: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Error removing token from localStorage:', error);
  }
};

export const clearTokens = (): void => {
  removeToken('accessToken');
  removeToken('refreshToken');
  removeToken('lastValidation');
};
