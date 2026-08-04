'use client'

/**
 * Minimal client-side JWT storage helper.
 *
 * The backend (see web/src/utils/sendToken.ts) returns the JWT in the
 * response body AND sets it as an httpOnly cookie. We standardize the
 * frontend on the Authorization header + localStorage strategy because:
 *  - it works identically in dev (localhost:3000 -> localhost:4000) and in
 *    prod without extra CORS/cookie `SameSite`/`credentials` configuration,
 *  - it matches the auth middleware's `extractToken` which checks
 *    `Authorization: Bearer <token>` first.
 *
 * This removes the "cookie vs localStorage mismatch" risk called out in
 * the assessment: frontend and backend now agree on one strategy.
 */

const TOKEN_KEY = 'apax_token'

export function setToken(token: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function clearToken(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
