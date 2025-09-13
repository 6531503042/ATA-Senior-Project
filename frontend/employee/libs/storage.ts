import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const getToken = (key: string): string | null => {
  const token = getCookie(key);
  return token ? String(token) : null;
};

export const setToken = (key: string, value: string, options?: any): void => {
  setCookie(key, value, {
    maxAge: 15 * 60, // 15 minutes
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    ...options,
  });
};

export const removeToken = (key: string): void => {
  deleteCookie(key);
};

export const clearTokens = (): void => {
  removeToken('accessToken');
  removeToken('refreshToken');
};
