/**
 * Helper to check if JWT is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    return exp < currentTime;
  } catch (err) {
    console.warn('Error parsing token:', err);

    return true;
  }
}

/**
 * Helper to check if JWT will expire soon (within 5 minutes)
 */
export function isTokenExpiringSoon(token: string): boolean {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;

    return exp < currentTime + fiveMinutes;
  } catch (err) {
    console.warn('Error parsing token:', err);

    return true;
  }
}
