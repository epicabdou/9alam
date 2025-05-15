<template>
  <div class="min-h-screen flex items-center justify-center bg-background-darkest p-4 font-sans">
    <div class="glass-card w-full max-w-md p-8 shadow-xl">
      <h1 class="heading-2 text-text-light text-center mb-6 text-shadow-glow-violet font-display">
        Create Account
      </h1>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-text-muted mb-1">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-input"
            :class="{ 'form-input-focus': emailFocused, 'form-error': !!authError }"
            @focus="emailFocused = true"
            @blur="emailFocused = false"
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-text-muted mb-1">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-input"
            :class="{ 'form-input-focus': passwordFocused, 'form-error': !!authError }"
            @focus="passwordFocused = true"
            @blur="passwordFocused = false"
            required
            placeholder="••••••••"
          />
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-text-muted mb-1">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            class="form-input"
            :class="{ 'form-input-focus': confirmPasswordFocused, 'form-error': passwordsDoNotMatch || !!authError }"
            @focus="confirmPasswordFocused = true"
            @blur="confirmPasswordFocused = false"
            required
            placeholder="••••••••"
          />
          <p v-if="passwordsDoNotMatch" class="error-message mt-1">Passwords do not match.</p>
        </div>

        <p v-if="authError" class="error-message text-center">
          {{ authError }}
        </p>
        <p v-if="successMessage" class="text-status-success text-sm text-center">
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="btn btn-primary w-full btn-lg"
          :class="{ 'btn-loading': loading, 'hover:btn-primary-hover active:btn-primary-active': !loading }"
          :disabled="loading"
        >
          <span v-if="loading" class="btn-loading-spin"></span>
          <span v-else>Register</span>
        </button>
      </form>
      <p class="text-text-muted text-center mt-6 text-sm">
        Already have an account?
        <router-link
          to="/login"
          class="font-medium text-accent-cyan hover:text-accent-teal hover:text-shadow-glow-cyan transition-all duration-150"
        >
          Log in
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Assuming you have this store

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const emailFocused = ref(false);
const passwordFocused = ref(false);
const confirmPasswordFocused = ref(false);

const loading = ref(false);
const authError = ref(null);
const successMessage = ref(null);


const passwordsDoNotMatch = computed(() => {
  return password.value && confirmPassword.value && password.value !== confirmPassword.value;
});

const handleRegister = async () => {
  authError.value = null;
  successMessage.value = null;

  if (passwordsDoNotMatch.value) {
    authError.value = 'Passwords do not match.';
    return;
  }
  if (!email.value || !password.value) {
    authError.value = 'Email and password are required.';
    return;
  }

  loading.value = true;
  try {
    const { data, error } = await authStore.signUp(email.value, password.value);
    if (error) {
      throw error;
    }
    // data.user contains the new user
    // data.session is null until the user confirms their email
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      successMessage.value = 'Registration successful! Please check your email to confirm your account. User might already exist.';
      // This case might happen if user is already registered but not confirmed or some other edge case
    } else if (data.user) {
      successMessage.value = 'Registration successful! Please check your email to confirm your account.';
      // Optionally, redirect or clear form after a delay
      setTimeout(() => {
        if (router) { // check if router is available
          router.push('/login');
        }
      }, 3000);
    } else {
      // Handle cases where user might be null but no error (e.g. email confirmation pending)
      successMessage.value = 'Registration process initiated. Please check your email to confirm your account.';
    }

  } catch (error) {
    console.error('Registration error:', error);
    authError.value = error.message || 'An unexpected error occurred during registration.';
  } finally {
    loading.value = false;
  }
};
</script>