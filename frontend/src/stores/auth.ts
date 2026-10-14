import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const username = ref('');

  function login(name: string) {
    if (name.trim() !== '') {
      username.value = name;
      isAuthenticated.value = true;
    }
  }

  function logout() {
    username.value = '';
    isAuthenticated.value = false;
  }

  return {
    isAuthenticated,
    username,
    login,
    logout,
  };
});