<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-background-darkest p-4">
    <div class="glass-card w-full max-w-md p-8">
      <h1 class="heading-2 text-text-light text-center mb-6 text-shadow-glow-violet">Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-text-muted mb-2">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-input"
            :class="{ 'form-input-focus': emailFocused, 'form-error': authError }"
            @focus="emailFocused = true"
            @blur="emailFocused = false"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-text-muted mb-2">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-input"
            :class="{ 'form-input-focus': passwordFocused, 'form-error': authError }"
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
            required
          />
        </div>
        <p v-if="authError" class="error-message mb-4">{{ authError }}</p>
        <button type="submit" class="btn btn-primary w-full btn-lg" :class="{'btn-loading': loading}">
          <span :class="{'btn-loading-spin': loading}"></span>
          Login
        </button>
      </form>
      <p class="text-text-muted text-center mt-6">
        Don't have an account? <router-link to="/register" class="text-accent-cyan hover:text-shadow-glow-cyan">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    await authStore.signIn(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>
