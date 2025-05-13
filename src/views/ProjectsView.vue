<!-- src/views/ProjectsView.vue -->
<template>
  <div class="projects-container animate-fade-in">
    <div class="projects-header glass-card">
      <h1 class="page-title text-shadow-glow-subtle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon text-accent-violet mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
          />
        </svg>
        Your Projects
      </h1>
      <router-link to="/projects/new" class="btn btn-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Create New Project
      </router-link>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>Loading projects...</span>
    </div>

    <div v-else-if="projects.length === 0" class="empty-state card-glass">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="empty-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"
        />
      </svg>
      <h2>No Projects Yet</h2>
      <p>Start by creating your first project to organize your content.</p>
      <router-link to="/projects/new" class="btn btn-gradient mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Create Your First Project
      </router-link>
    </div>

    <div v-else class="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card card-glass hover:card-hover p-6 rounded-lg transition-all duration-300 border border-panel-medium"
      >
        <div class="project-content">
          <h2 class="project-title text-xl font-semibold text-accent-cyan mb-2">
            <router-link
              :to="`/projects/${project.id}`"
              class="hover:text-accent-violet transition-colors duration-300"
            >
              {{ project.name }}
            </router-link>
          </h2>
          <p
            v-if="project.description"
            class="project-description text-text-light mb-4 line-clamp-2"
          >
            {{ project.description }}
          </p>
          <div class="project-meta flex items-center text-text-muted text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-accent-cyan mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ formatDate(project.created_at) }}</span>
          </div>
        </div>
        <div class="project-actions flex mt-4 gap-2">
          <router-link
            :to="`/projects/${project.id}`"
            class="btn btn-sm btn-glass flex-1 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fill-rule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clip-rule="evenodd"
              />
            </svg>
            View
          </router-link>
          <router-link
            :to="`/projects/${project.id}/edit`"
            class="btn btn-sm btn-secondary flex-1 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
            Edit
          </router-link>
          <button
            @click="confirmDelete(project)"
            class="btn btn-sm btn-danger flex-1 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="modal-overlay animate-fade-in fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        class="modal-backdrop absolute inset-0 bg-background-darkest bg-opacity-75 backdrop-blur-sm"
        @click="showDeleteModal = false"
      ></div>
      <div
        class="modal-container card-glass animate-scale-in relative w-full max-w-md p-6 rounded-lg shadow-lg"
      >
        <h3 class="modal-title text-xl font-semibold mb-4 flex items-center text-status-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Confirm Delete
        </h3>
        <p class="modal-text text-text-light mb-6">
          Are you sure you want to delete the project "{{ projectToDelete?.name }}"? This action
          cannot be undone.
        </p>
        <div class="modal-actions flex justify-end gap-4">
          <button @click="showDeleteModal = false" class="btn btn-glass">Cancel</button>
          <button @click="deleteProject" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'

const projectsStore = useProjectsStore()
const projects = ref([])
const loading = ref(true)
const showDeleteModal = ref(false)
const projectToDelete = ref(null)

onMounted(async () => {
  await loadProjects()
})

async function loadProjects() {
  loading.value = true
  try {
    await projectsStore.fetchProjects()
    projects.value = projectsStore.projects
  } catch (error) {
    console.error('Error loading projects:', error)
  } finally {
    loading.value = false
  }
}

function confirmDelete(project) {
  projectToDelete.value = project
  showDeleteModal.value = true
}

async function deleteProject() {
  if (!projectToDelete.value) return

  try {
    await projectsStore.deleteProject(projectToDelete.value.id)
    showDeleteModal.value = false
    projectToDelete.value = null
  } catch (error) {
    console.error('Error deleting project:', error)
  }
}

function formatDate(dateString) {
  if (!dateString) return ''

  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
</script>
