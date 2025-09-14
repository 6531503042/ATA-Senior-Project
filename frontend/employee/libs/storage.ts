import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const getToken = (key: string): string | null => {
  const token = getCookie(key);
  return token ? String(token) : null;
};

export const setToken = (key: string, value: string, options?: any): void => {
  setCookie(key, value, {
    maxAge: key === 'refreshToken' ? 7 * 24 * 60 * 60 : 15 * 60, // 7 days for refresh token, 15 minutes for access token
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
