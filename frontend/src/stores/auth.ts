import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { api, ApiError, TOKEN_KEY } from '../api/client';

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  status: 'online' | 'dnd' | 'offline';
  initials: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  let restored: Promise<void> | null = null;

  const isAuthenticated = computed(() => user.value !== null);
  // Display name, kept under the old name so the other components still work
  const username = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  );
  const nickName = computed(() => user.value?.nickName ?? '');

  function setSession(newToken: string, newUser: AuthUser) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem(TOKEN_KEY, newToken);
  }

  function clearSession() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  async function login(email: string, password: string) {
    const res = await api<{ data: { token: string; user: AuthUser } }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setSession(res.data.token, res.data.user);
  }

  async function register(form: RegisterForm) {
    const res = await api<{ data: { token: string; user: AuthUser } }>('/auth/signup', {
      method: 'POST',
      body: form,
    });
    setSession(res.data.token, res.data.user);
  }

  async function logout() {
    try {
      await api('/account/logout', { method: 'POST' });
    } catch {
      // the token may already be invalid, we log out locally either way
    }
    clearSession();
  }

  /** Runs once: if a saved token exists, asks the backend who it belongs to. */
  function restoreSession(): Promise<void> {
    if (!restored) {
      restored = (async () => {
        if (!token.value) return;
        try {
          const res = await api<{ data: AuthUser }>('/account/profile');
          user.value = res.data;
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) clearSession();
        }
      })();
    }
    return restored;
  }

  return {
    user,
    isAuthenticated,
    username,
    nickName,
    login,
    register,
    logout,
    restoreSession,
  };
});