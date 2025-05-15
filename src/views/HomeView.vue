<!-- src/views/HomeView.vue -->
<template>
  <div class="animate-fade-in p-6 md:p-12">
    <div class="max-w-5xl mx-auto">
      <header class="mb-12 text-center">
        <h1 class="heading-1 font-display text-transparent bg-clip-text bg-aurora-gradient mb-4">
          Welcome to 9alam.io
        </h1>
        <p class="text-fluid-lg text-text-muted max-w-2xl mx-auto">
          Your AI-powered assistant for crafting compelling content effortlessly.
          Let's get started!
        </p>
      </header>

      <section class="grid md:grid-cols-2 gap-8 mb-12">
        <router-link to="/projects"
                     class="card bg-panel-card hover:shadow-accent-violet transition-all duration-300 ease-in-out transform hover:-translate-y-1 p-8 rounded-xl group">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-lg bg-accent-violet bg-opacity-20 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h2 class="heading-3 font-display text-text-light group-hover:text-accent-purple transition-colors">
              Manage Projects
            </h2>
          </div>
          <p class="text-text-muted group-hover:text-text-light transition-colors">
            View your existing projects or start a new one to organize your AI-generated content.
          </p>
        </router-link>

        <router-link to="/projects/new"
                     class="card bg-panel-card hover:shadow-accent-cyan transition-all duration-300 ease-in-out transform hover:-translate-y-1 p-8 rounded-xl group">
          <div class="flex items-center mb-4">
            <div class="p-3 rounded-lg bg-accent-cyan bg-opacity-20 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-accent-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 class="heading-3 font-display text-text-light group-hover:text-accent-cyan transition-colors">
              Create New Project
            </h2>
          </div>
          <p class="text-text-muted group-hover:text-text-light transition-colors">
            Kickstart a new project and begin generating fresh content with our AI tools.
          </p>
        </router-link>
      </section>

      <section class="text-center py-10">
        <h3 class="heading-2 text-text-muted opacity-50 font-display">
          More Features Coming Soon...
        </h3>
        <div class="mt-8">
          <div class="spinner spinner-lg animate-pulse-subtle border-accent-teal"></div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
// No specific script logic needed for this static HomeView example,
// but you might add calls to fetch user data or stats in a real app.
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore(); // to potentially display user's name or personalize
</script>

<style scoped>
/* Scoped styles specific to HomeView if absolutely necessary */
/* Example: gradient text requires Tailwind 3.0+ with JIT or specific setup.
   If not working out of the box, ensure your Tailwind version supports it or use a CSS workaround.
   Your tailwind.config.js includes background-image gradients.
   text-transparent bg-clip-text bg-aurora-gradient should work.
*/
</style>
