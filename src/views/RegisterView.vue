<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-container animate-fade-in">
    <div class="form-container glass-card">
      <h1 class="form-title text-shadow-glow-violet">Create an Account</h1>

      <form @submit.prevent="handleRegister">
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
            placeholder="Create a password"
            minlength="6"
            class="form-input"
          />
          <span class="help-text">Password must be at least 6 characters</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
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
            <span v-if="!loading">Register</span>
          </button>
        </div>
      </form>

      <div class="divider my-6 flex items-center">
        <div class="flex-1 border-t border-panel-medium"></div>
        <span class="px-4 text-text-muted">or</span>
        <div class="flex-1 border-t border-panel-medium"></div>
      </div>

      <div class="auth-links">
        <p>
          Already have an account?
          <router-link to="/login" class="auth-link">Login</router-link>
        </p>
      </div>
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
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    loading.value = false
    return
  }

  try {
    await authStore.signUp(email.value, password.value)
    router.push('/login')
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
