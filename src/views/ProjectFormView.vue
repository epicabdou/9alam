<!-- src/views/ProjectFormView.vue -->
<template>
  <div class="project-form-container">
    <h1 class="page-title">{{ isEditing ? 'Edit Project' : 'Create New Project' }}</h1>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-group">
        <label for="name">Project Name</label>
        <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Enter project name"
        />
      </div>

      <div class="form-group">
        <label for="description">Description (Optional)</label>
        <textarea
            id="description"
            v-model="form.description"
            placeholder="Describe your project"
            rows="4"
        ></textarea>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-actions">
        <button
            type="button"
            @click="$router.go(-1)"
            class="btn btn-secondary"
        >
          Cancel
        </button>
        <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
        >
          <span v-if="loading">
            {{ isEditing ? 'Updating...' : 'Creating...' }}
          </span>
          <span v-else>
            {{ isEditing ? 'Update Project' : 'Create Project' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const route = useRoute();
const projectsStore = useProjectsStore();

const form = reactive({
  name: '',
  description: ''
});

const loading = ref(false);
const error = ref('');

onMounted(async () => {
  if (props.isEditing) {
    const projectId = route.params.id;
    loading.value = true;

    try {
      const project = await projectsStore.fetchProject(projectId);
      if (project) {
        form.name = project.name || '';
        form.description = project.description || '';
      } else {
        router.push('/projects');
      }
    } catch (err) {
      error.value = 'Error loading project. Please try again.';
      console.error('Error loading project:', err);
    } finally {
      loading.value = false;
    }
  }
});

async function handleSubmit() {
  loading.value = true;
  error.value = '';

  try {
    if (props.isEditing) {
      const projectId = route.params.id;
      await projectsStore.updateProject(projectId, form);
      router.push(`/projects/${projectId}`);
    } else {
      const newProject = await projectsStore.createProject(form);
      router.push(`/projects/${newProject.id}`);
    }
  } catch (err) {
    error.value = err.message || 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.project-form-container {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.form-container {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>