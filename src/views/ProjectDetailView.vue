<!-- src/views/ProjectDetailView.vue -->
<template>
  <div class="min-h-screen bg-background-dark text-text-light p-6 md:p-10 font-sans animate-fade-in scrollbar-thin">
    <div v-if="projectsStore.loading && !projectsStore.currentProject" class="flex justify-center items-center h-screen">
      <div class="spinner spinner-lg border-accent-violet"></div>
      <p class="ml-4 text-text-muted text-lg">Loading project details...</p>
    </div>

    <div v-else-if="projectsStore.error && !projectsStore.currentProject" class="max-w-3xl mx-auto">
      <div class="alert alert-danger">
        <p class="font-bold">Could not load project:</p>
        <p>{{ projectsStore.error }}</p>
      </div>
      <router-link to="/projects" class="btn btn-glass mt-6 text-sm">
        Back to Projects
      </router-link>
    </div>

    <div v-else-if="projectsStore.currentProject" class="max-w-5xl mx-auto">
      <div class="mb-10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-3">
          <router-link to="/projects" class="btn btn-glass text-sm mb-4 md:mb-0 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            All Projects
          </router-link>
          <div class="flex space-x-3">
            <router-link :to="`/projects/${projectsStore.currentProject.id}/edit`" class="btn btn-secondary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Project
            </router-link>
            <router-link :to="`/projects/${projectsStore.currentProject.id}/content/new`" class="btn btn-primary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Content
            </router-link>
          </div>
        </div>
        <h1 class="heading-1 font-display text-text-light text-shadow-glow-purple break-words">
          {{ projectsStore.currentProject.name }}
        </h1>
        <p v-if="projectsStore.currentProject.description" class="text-text-muted text-fluid-lg mt-2 max-w-3xl">
          {{ projectsStore.currentProject.description }}
        </p>
        <div class="text-xs text-text-muted mt-3">
          Created: {{ formatDate(projectsStore.currentProject.created_at) }} |
          Last Updated: {{ formatDate(projectsStore.currentProject.updated_at) }}
        </div>
      </div>

      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="heading-2 text-accent-cyan">Content Pieces</h2>
        </div>

        <div v-if="contentStore.loading && contentStore.contentPieces.length === 0" class="flex justify-center items-center py-10">
          <div class="spinner spinner-md border-accent-teal"></div>
          <p class="ml-3 text-text-muted">Loading content...</p>
        </div>

        <div v-else-if="contentStore.error" class="alert alert-danger">
          <p class="font-bold">Could not load content pieces:</p>
          <p>{{ contentStore.error }}</p>
        </div>

        <div v-else-if="!contentStore.contentPieces.length" class="text-center py-16 glass-card p-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-accent-cyan opacity-50 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="heading-3 text-text-muted mb-4">No Content Yet</h3>
          <p class="text-text-muted mb-6 max-w-sm mx-auto">
            This project doesn't have any content pieces. Let's create some!
          </p>
          <router-link :to="`/projects/${projectsStore.currentProject.id}/content/new`" class="btn btn-secondary hover:btn-secondary-hover">
            Generate First Content
          </router-link>
        </div>

        <div v-else class="grid grid-auto-fit-lg gap-6">
          <router-link
            v-for="content in contentStore.contentPieces"
            :key="content.id"
            :to="`/content/${content.id}`"
            class="card bg-panel-card hover:shadow-accent-teal transition-all duration-300 ease-in-out group transform hover:-translate-y-1.5 flex flex-col"
          >
            <div class="card-body p-6 flex flex-col flex-grow">
              <h4 class="heading-3 font-semibold text-lg text-text-light group-hover:text-accent-teal transition-colors mb-2 truncate" :title="content.title">
                {{ content.title || 'Untitled Content' }}
              </h4>
              <span class="badge badge-secondary mb-3 self-start">{{ content.content_type?.replace(/_/g, ' ') || 'N/A' }}</span>
              <p class="text-text-muted text-sm mb-4 flex-grow line-clamp-2" :title="content.prompt">
                <strong class="text-text-accent">Prompt:</strong> {{ content.prompt.substring(0,100) }}{{ content.prompt.length > 100 ? '...' : '' }}
              </p>
              <div class="mt-auto pt-3 border-t border-panel-light text-xs text-text-muted">
                Created: {{ formatDate(content.created_at) }}
              </div>
            </div>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import { useContentStore } from '@/stores/content';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const contentStore = useContentStore();

const projectId = computed(() => route.params.id);

onMounted(() => {
  fetchData();
});

// Watch for route changes if navigating between different project details
watch(projectId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchData();
  }
});

const fetchData = async () => {
  if (projectId.value) {
    projectsStore.error = null; // Clear previous project errors
    contentStore.error = null;  // Clear previous content errors
    await projectsStore.fetchProject(projectId.value);
    if (projectsStore.currentProject) { // Proceed only if project loaded successfully
      await contentStore.fetchContentPieces(projectId.value);
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour:'2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
/* Custom line-clamp utility if not available or for specific browsers */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>