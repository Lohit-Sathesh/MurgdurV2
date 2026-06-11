import type { User } from '@/types/user';

const tokenKey = 'murgdur-token';

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(tokenKey);
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') window.localStorage.setItem(tokenKey, token);
}

export function clearAuthToken() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(tokenKey);
}

export async function fetchCurrentUser(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) return null;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  return response.json();
}
