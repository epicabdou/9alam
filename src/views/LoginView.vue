<!-- src/views/LoginView.vue -->
<template>
  <div class="auth-container">
    <div class="form-container">
      <h1 class="form-title">Login to Your Account</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Your email address"
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
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-actions">
          <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="loading"
          >
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
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

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.form-container {
  width: 100%;
}

.form-actions {
  margin-top: 1.5rem;
}

.w-full {
  width: 100%;
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
  color: #6b7280;
}

.auth-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>