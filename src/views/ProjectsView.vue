<!-- src/views/ProjectsView.vue -->
<template>
  <div class="min-h-screen bg-background-dark text-text-light p-6 md:p-10 font-sans animate-fade-in scrollbar-thin">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 class="heading-1 font-display text-shadow-glow-violet mb-4 md:mb-0">
          Your Projects
        </h1>
        <router-link
          to="/projects/new"
          class="btn btn-primary btn-lg hover:btn-primary-hover active:btn-primary-active"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          New Project
        </router-link>
      </div>

      <div v-if="projectsStore.loading && projectsStore.projects.length === 0" class="flex justify-center items-center py-20">
        <div class="spinner spinner-lg border-accent-cyan"></div>
        <p class="ml-4 text-text-muted text-lg">Loading your projects...</p>
      </div>

      <div v-else-if="projectsStore.error" class="alert alert-danger">
        <p class="font-bold">Could not load projects:</p>
        <p>{{ projectsStore.error }}</p>
      </div>

      <div v-else-if="!projectsStore.projects.length" class="text-center py-20 glass-card p-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-accent-purple opacity-50 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21V9M3 15h18M9 3v6" />
        </svg>
        <h2 class="heading-2 text-text-muted mb-4">No Projects Yet</h2>
        <p class="text-text-muted mb-8 max-w-md mx-auto">
          It looks like you haven't created any projects. Get started by creating your first one!
        </p>
        <router-link
          to="/projects/new"
          class="btn btn-secondary btn-lg hover:btn-secondary-hover active:btn-secondary-active"
        >
          Create Your First Project
        </router-link>
      </div>

      <div v-else class="grid-auto-fit-lg gap-6 md:gap-8">
        <router-link
          v-for="project in projectsStore.projects"
          :key="project.id"
          :to="`/projects/${project.id}`"
          class="card bg-panel-card hover:shadow-accent-purple transition-all duration-300 ease-in-out group transform hover:-translate-y-1.5 flex flex-col"
        >
          <div class="card-body flex flex-col flex-grow p-6">
            <h3 class="heading-3 font-display text-text-light group-hover:text-accent-purple transition-colors mb-2 truncate">
              {{ project.name }}
            </h3>
            <p class="text-text-muted text-sm mb-4 flex-grow line-clamp-3">
              {{ project.description || 'No description provided.' }}
            </p>
            <div class="mt-auto pt-4 border-t border-panel-light">
              <p class="text-xs text-text-muted">
                Last updated: {{ formatDate(project.updated_at) }}
              </p>
              <p class="text-xs text-text-muted mt-1">
                Content Pieces: {{ project.content_piece_count || 0 }} </p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useProjectsStore } from '@/stores/projects';

const projectsStore = useProjectsStore();

onMounted(() => {
  projectsStore.fetchProjects();
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
/* Custom line-clamp utility if not available or for specific browsers */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>