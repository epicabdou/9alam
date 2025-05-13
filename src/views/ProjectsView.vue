<!-- src/views/ProjectsView.vue -->
<template>
  <div class="projects-container">
    <div class="projects-header">
      <h1 class="page-title">Your Projects</h1>
      <router-link to="/projects/new" class="btn btn-primary">
        Create New Project
      </router-link>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading projects...</span>
    </div>

    <div v-else-if="projects.length === 0" class="empty-state">
      <h2>No Projects Yet</h2>
      <p>Start by creating your first project to organize your content.</p>
      <router-link to="/projects/new" class="btn btn-primary mt-4">
        Create Your First Project
      </router-link>
    </div>

    <div v-else class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-content">
          <h2 class="project-title">
            <router-link :to="`/projects/${project.id}`">
              {{ project.name }}
            </router-link>
          </h2>
          <p v-if="project.description" class="project-description">
            {{ project.description }}
          </p>
          <div class="project-meta">
            <span class="project-date">Created: {{ formatDate(project.created_at) }}</span>
          </div>
        </div>
        <div class="project-actions">
          <router-link :to="`/projects/${project.id}`" class="btn btn-secondary btn-sm">
            View
          </router-link>
          <router-link :to="`/projects/${project.id}/edit`" class="btn btn-outline btn-sm">
            Edit
          </router-link>
          <button @click="confirmDelete(project)" class="btn btn-danger btn-sm">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <h3 class="modal-title">Confirm Delete</h3>
        <p class="modal-text">
          Are you sure you want to delete the project "{{ projectToDelete?.name }}"? This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="deleteProject" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProjectsStore } from '@/stores/projects';

const projectsStore = useProjectsStore();
const projects = ref([]);
const loading = ref(true);
const showDeleteModal = ref(false);
const projectToDelete = ref(null);

onMounted(async () => {
  await loadProjects();
});

async function loadProjects() {
  loading.value = true;
  try {
    await projectsStore.fetchProjects();
    projects.value = projectsStore.projects;
  } catch (error) {
    console.error('Error loading projects:', error);
  } finally {
    loading.value = false;
  }
}

function confirmDelete(project) {
  projectToDelete.value = project;
  showDeleteModal.value = true;
}

async function deleteProject() {
  if (!projectToDelete.value) return;

  try {
    await projectsStore.deleteProject(projectToDelete.value.id);
    showDeleteModal.value = false;
    projectToDelete.value = null;
  } catch (error) {
    console.error('Error deleting project:', error);
  }
}

function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}
</script>

<style scoped>
.projects-container {
  max-width: 1000px;
  margin: 0 auto;
}

.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.project-content {
  padding: 1.5rem;
  flex: 1;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.project-title a {
  color: inherit;
  text-decoration: none;
}

.project-title a:hover {
  color: #4f46e5;
}

.project-description {
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-meta {
  font-size: 0.875rem;
  color: #6b7280;
}

.project-actions {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.btn-outline:hover {
  background-color: #f3f4f6;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.empty-state p {
  color: #4b5563;
  max-width: 400px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-container {
  background-color: #fff;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.modal-text {
  margin-bottom: 1.5rem;
  color: #4b5563;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>