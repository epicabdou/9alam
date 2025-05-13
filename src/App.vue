<!-- src/App.vue -->
<template>
  <div class="app-container dark-mode bg-background-dark min-h-screen flex flex-col">
    <header v-if="authStore.isAuthenticated">
      <nav class="navbar-glass backdrop-blur-md fixed w-full top-0 z-50">
        <div class="navbar-brand">
          <router-link
            to="/"
            class="text-2xl font-bold text-accent-violet hover:text-accent-cyan transition-colors duration-300"
          >
            <span class="text-shadow-glow-violet">CopyGenius AI</span>
          </router-link>
        </div>
        <div class="navbar-nav">
          <router-link
            to="/projects"
            class="nav-link-underline text-text-light hover:text-accent-cyan"
            >Projects</router-link
          >
          <button @click="logout" class="btn btn-glass btn-sm">
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </header>

    <main class="flex-1 container mx-auto px-6 py-8 mt-16">
      <router-view />
    </main>

    <footer class="glass-card bg-transparent mt-auto py-4 text-center text-text-muted">
      <p>&copy; {{ new Date().getFullYear() }} CopyGenius AI</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
})

async function logout() {
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>
