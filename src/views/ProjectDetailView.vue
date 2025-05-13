<!-- src/views/ProjectDetailView.vue -->
<template>
  <div v-if="loading" class="loading flex flex-col items-center justify-center py-12">
    <div class="spinner mb-4"></div>
    <span class="text-text-muted">Loading project...</span>
  </div>

  <div v-else-if="project" class="project-detail-container animate-fade-in">
    <div class="project-header glass-card p-6 rounded-lg mb-8 border border-panel-medium">
      <div class="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1
            class="project-title text-2xl md:text-3xl font-bold text-accent-violet text-shadow-glow-subtle mb-2"
          >
            {{ project.name }}
          </h1>
          <p v-if="project.description" class="project-description text-text-light max-w-2xl mb-4">
            {{ project.description }}
          </p>
          <p class="project-meta flex items-center text-text-muted text-sm">
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
            Created: {{ formatDate(project.created_at) }}
          </p>
        </div>

        <div class="project-actions flex gap-4">
          <router-link :to="`/projects/${project.id}/edit`" class="btn btn-glass flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
              />
            </svg>
            Edit Project
          </router-link>
          <router-link
            :to="`/projects/${project.id}/content/new`"
            class="btn btn-primary flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Create Content
          </router-link>
        </div>
      </div>
    </div>

    <div class="content-section">
      <h2
        class="section-title text-xl font-semibold text-accent-violet text-shadow-glow-subtle mb-6 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
          <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
        </svg>
        Content Pieces
      </h2>

      <div v-if="contentLoading" class="loading-small flex items-center justify-center py-8">
        <div class="spinner spinner-sm mr-3"></div>
        <span class="text-text-muted">Loading content...</span>
      </div>

      <div
        v-else-if="contentPieces.length === 0"
        class="empty-state card-glass p-12 rounded-lg text-center border border-panel-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="empty-icon h-16 w-16 mx-auto mb-4 text-panel-medium"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clip-rule="evenodd"
          />
        </svg>
        <h3 class="text-xl font-semibold text-text-light mb-2">No Content Yet</h3>
        <p class="text-text-muted mb-6">Start creating content for this project.</p>
        <router-link
          :to="`/projects/${project.id}/content/new`"
          class="btn btn-gradient mx-auto flex items-center justify-center w-64"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Create Your First Content
        </router-link>
      </div>

      <div v-else class="content-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="content in contentPieces"
          :key="content.id"
          class="content-card card-glass hover:card-hover p-6 rounded-lg transition-all duration-300 border border-panel-medium"
        >
          <div
            class="content-type-badge inline-block px-2 py-1 text-xs rounded-full mb-3"
            :class="getBadgeClass(content.content_type)"
          >
            {{ formatContentType(content.content_type) }}
          </div>
          <h3 class="content-title text-lg font-semibold text-accent-cyan mb-3">
            <router-link
              :to="`/content/${content.id}`"
              class="hover:text-accent-violet transition-colors duration-300"
            >
              {{ content.title }}
            </router-link>
          </h3>
          <p class="content-preview text-text-light mb-4 line-clamp-3 text-sm">
            {{ truncateText(content.generated_content, 100) }}
          </p>
          <div class="content-meta flex items-center text-text-muted text-sm mb-4">
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
            <span class="content-date">{{ formatDate(content.created_at) }}</span>
          </div>
          <div class="content-actions grid grid-cols-3 gap-2">
            <router-link
              :to="`/content/${content.id}`"
              class="btn btn-sm btn-glass flex items-center justify-center"
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
              :to="`/content/${content.id}/edit`"
              class="btn btn-sm btn-secondary flex items-center justify-center"
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
              @click="confirmDeleteContent(content)"
              class="btn btn-sm btn-danger flex items-center justify-center"
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
    </div>

    <!-- Delete Content Confirmation Modal -->
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
          Are you sure you want to delete this content? This action cannot be undone.
        </p>
        <div class="modal-actions flex justify-end gap-4">
          <button @click="showDeleteModal = false" class="btn btn-glass">Cancel</button>
          <button @click="deleteContent" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useContentStore } from '@/stores/content'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const contentStore = useContentStore()

const project = ref(null)
const contentPieces = ref([])
const loading = ref(true)
const contentLoading = ref(true)
const showDeleteModal = ref(false)
const contentToDelete = ref(null)

onMounted(async () => {
  const projectId = route.params.id

  try {
    project.value = await projectsStore.fetchProject(projectId)
    loading.value = false

    await loadContentPieces(projectId)
  } catch (error) {
    console.error('Error loading project data:', error)
    loading.value = false
  }
})

async function loadContentPieces(projectId) {
  contentLoading.value = true

  try {
    const data = await contentStore.fetchContentPieces(projectId)
    contentPieces.value = data || []
  } catch (error) {
    console.error('Error loading content pieces:', error)
  } finally {
    contentLoading.value = false
  }
}

function confirmDeleteContent(content) {
  contentToDelete.value = content
  showDeleteModal.value = true
}

async function deleteContent() {
  if (!contentToDelete.value) return

  try {
    await contentStore.deleteContent(contentToDelete.value.id)
    contentPieces.value = contentPieces.value.filter((c) => c.id !== contentToDelete.value.id)
    showDeleteModal.value = false
    contentToDelete.value = null
  } catch (error) {
    console.error('Error deleting content:', error)
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

function formatContentType(contentType) {
  if (!contentType) return ''

  return contentType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function truncateText(text, maxLength) {
  if (!text) return ''

  if (text.length <= maxLength) {
    return text
  }

  return text.substring(0, maxLength) + '...'
}

function getBadgeClass(contentType) {
  const typeMap = {
    email: 'badge-email',
    social_post: 'badge-social',
    ad_copy: 'badge-ad',
    blog_post: 'badge-blog',
    product_description: 'badge-product',
    website_copy: 'badge-website',
  }

  return typeMap[contentType] || 'badge-default'
}
</script>
