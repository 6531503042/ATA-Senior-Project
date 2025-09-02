import type {
  JwtResponse,
  LoginRequest,
  TokenValidationResponse,
} from '@/types/auth';

import { api } from '@/libs/apiClient';

export function login(request: LoginRequest) {
  return api.post<JwtResponse>('/api/auth/login', request, { auth: false });
}

export function logout() {
  return api.post<void>('/api/auth/logout');
}

export function refresh(refreshToken: string) {
  return api.post<JwtResponse>(
    '/api/auth/refresh-token',
    {},
    {
      headers: { 'Refresh-Token': refreshToken },
      auth: false,
    },
  );
}

export function validate() {
  return api.get<TokenValidationResponse>('/api/auth/validate');
}
