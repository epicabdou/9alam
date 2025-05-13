<!-- src/views/ProjectFormView.vue -->
<template>
  <div class="project-form-container animate-fade-in max-w-2xl mx-auto">
    <h1
      class="page-title text-2xl font-bold text-accent-violet text-shadow-glow-subtle mb-6 flex items-center"
    >
      <svg
        v-if="isEditing"
        xmlns="http://www.w3.org/2000/svg"
        class="h-7 w-7 text-accent-cyan mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-7 w-7 text-accent-violet mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"
        />
      </svg>
      {{ isEditing ? 'Edit Project' : 'Create New Project' }}
    </h1>

    <form
      @submit.prevent="handleSubmit"
      class="form-container glass-card p-6 rounded-lg border border-panel-medium"
    >
      <div class="form-group mb-6">
        <label for="name" class="form-label block text-sm font-medium text-text-light mb-2"
          >Project Name</label
        >
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          placeholder="Enter project name"
          class="form-input w-full bg-background-deeper border border-panel-medium rounded-md px-4 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent"
        />
      </div>

      <div class="form-group mb-6">
        <label for="description" class="form-label block text-sm font-medium text-text-light mb-2"
          >Description (Optional)</label
        >
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Describe your project"
          rows="4"
          class="form-input w-full bg-background-deeper border border-panel-medium rounded-md px-4 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-accent-violet focus:border-transparent resize-y"
        ></textarea>
      </div>

      <div
        v-if="error"
        class="alert alert-danger p-4 rounded-md bg-opacity-20 bg-status-error border-l-4 border-status-error text-status-error mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 inline-block mr-2 -mt-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        {{ error }}
      </div>

      <div class="form-actions flex justify-end gap-4">
        <button
          type="button"
          @click="$router.go(-1)"
          class="btn btn-glass px-4 py-2 rounded-md flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-gradient px-4 py-2 rounded-md font-medium text-white bg-violet-cyan-gradient bg-size-200 transition-all duration-300 hover:bg-right flex items-center"
          :class="{ 'opacity-75 cursor-not-allowed': loading }"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </span>
          <span v-else>
            <svg
              v-if="isEditing"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
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
            {{ isEditing ? 'Update Project' : 'Create Project' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const route = useRoute()
const projectsStore = useProjectsStore()

const form = reactive({
  name: '',
  description: '',
})

const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (props.isEditing) {
    const projectId = route.params.id
    loading.value = true

    try {
      const project = await projectsStore.fetchProject(projectId)
      if (project) {
        form.name = project.name || ''
        form.description = project.description || ''
      } else {
        router.push('/projects')
      }
    } catch (err) {
      error.value = 'Error loading project. Please try again.'
      console.error('Error loading project:', err)
    } finally {
      loading.value = false
    }
  }
})

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    if (props.isEditing) {
      const projectId = route.params.id
      await projectsStore.updateProject(projectId, form)
      router.push(`/projects/${projectId}`)
    } else {
      const newProject = await projectsStore.createProject(form)
      router.push(`/projects/${newProject.id}`)
    }
  } catch (err) {
    error.value = err.message || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
