<!-- src/views/LoginView.vue -->
<template>
  <div class="auth-container animate-fade-in">
    <div class="form-container glass-card">
      <h1 class="form-title text-shadow-glow-violet">Login to Your Account</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Your email address"
              class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Your password"
              class="form-input"
          />
        </div>

        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div class="form-actions">
          <button
              type="submit"
              class="btn btn-gradient w-full"
              :class="{ 'btn-loading': loading }"
              :disabled="loading"
          >
            <span v-if="!loading">Login</span>
          </button>
        </div>
      </form>

      <div class="auth-links">
        <p>
          Don't have an account?
          <router-link to="/register" class="auth-link">Register</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleLogin() {
  loading.value = true;
  error.value = '';

  try {
    await authStore.signIn(email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
}
</script>