import { useAuthStore } from '@/stores/authStore'

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const auth = useAuthStore();

  const headers = new Headers(init.headers || {});

  if (auth.token) {
    headers.set('Authorization', `Bearer ${auth.token}`);
  }

  return fetch(input, { ...init, headers });
}
