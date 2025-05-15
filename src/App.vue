<!-- src/App.vue -->
<template>
  <div id="app-container" class="bg-background-darkest text-text-light font-sans min-h-screen flex flex-col scrollbar-thin">
    <nav v-if="authStore.isAuthenticated" class="navbar navbar-glass sticky top-0 z-100 shadow-lg">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-display font-bold text-accent-violet hover:text-shadow-glow-violet transition-all">
          9alam.io
        </router-link>
        <div class="flex items-center space-x-4">
          <router-link to="/projects" class="text-text-muted hover:text-text-light transition-colors px-3 py-2 rounded-md text-sm font-medium">
            Projects
          </router-link>
          <button @click="handleLogout" class="btn btn-sm btn-glass hover:bg-accent-violet hover:text-white">
            Logout
          </button>
        </div>
      </div>
    </nav>

    <main class="flex-grow">
      <router-view v-slot="{ Component, route }">
        <transition :name="route.meta.transition || 'fade-in'" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer v-if="authStore.isAuthenticated" class="py-6 text-center text-text-muted text-xs border-t border-panel-light mt-auto">
      &copy; {{ new Date().getFullYear() }} 9alam.io - AI Content Generation. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  authStore.initialize(); // Ensure auth state is initialized
});

const handleLogout = async () => {
  await authStore.signOut();
  router.push('/login');
};
</script>

<style>
/* Global transition styles (can be customized further) */
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.3s ease;
}
.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
}

/* You can define more route transitions here based on route.meta.transition */
.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.slide-in-right-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.slide-in-right-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

/* Add styles for other animations from your config if used for transitions */
/* e.g. .slide-in-up-enter-active etc. */
</style>