export function getToken(): string | null {
  // Try to get the token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  return token;
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
