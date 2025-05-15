<!-- src/views/ProjectFormView.vue -->
<template>
  <div class="min-h-screen bg-background-darkest text-text-light p-6 md:p-10 font-sans animate-fade-in scrollbar-thin">
    <div class="max-w-2xl mx-auto">
      <button @click="goBack" class="btn btn-glass mb-8 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        {{ isEditing ? 'Back to Project' : 'Back to Projects' }}
      </button>

      <div class="glass-card p-8 md:p-10 shadow-xl">
        <h1 class="heading-2 font-display text-center mb-3 text-shadow-glow-violet">
          {{ isEditing ? 'Edit Project' : 'Create New Project' }}
        </h1>
        <p class="text-text-muted text-center mb-10">
          {{ isEditing ? 'Update the details of your project.' : 'Fill in the details to start a new project.' }}
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="projectName" class="block text-lg font-medium text-text-accent mb-2">Project Name</label>
            <input
              type="text"
              id="projectName"
              v-model="projectData.name"
              class="form-input"
              :class="{ 'form-input-focus': nameFocused }"
              @focus="nameFocused = true"
              @blur="nameFocused = false"
              required
              placeholder="e.g., My Awesome Blog Campaign"
            />
            <p v-if="projectsStore.error?.message?.includes('name')" class="error-message">{{ projectsStore.error.message }}</p>
          </div>

          <div>
            <label for="projectDescription" class="block text-lg font-medium text-text-accent mb-2">
              Description <span class="text-sm text-text-muted">(Optional)</span>
            </label>
            <textarea
              id="projectDescription"
              v-model="projectData.description"
              rows="4"
              class="form-input"
              :class="{ 'form-input-focus': descriptionFocused }"
              @focus="descriptionFocused = true"
              @blur="descriptionFocused = false"
              placeholder="A brief description of what this project is about."
            ></textarea>
          </div>

          <div v-if="formError" class="alert alert-danger">
            {{ formError }}
          </div>
          <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
          </div>

          <div class="pt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              @click="goBack"
              class="btn btn-glass w-full sm:w-auto hover:bg-panel-highlight"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-lg w-full sm:w-auto"
              :class="{ 'btn-loading': projectsStore.loading, 'hover:btn-primary-hover active:btn-primary-active': !projectsStore.loading }"
              :disabled="projectsStore.loading"
            >
              <span v-if="projectsStore.loading" class="btn-loading-spin"></span>
              {{ isEditing ? 'Save Changes' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();

// Determine if we are editing an existing project or creating a new one
// The `isEditing` prop is passed from the router configuration
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const projectData = ref({
  name: '',
  description: '',
});

const formError = ref(null);
const successMessage = ref(null);

// For dynamic input classes
const nameFocused = ref(false);
const descriptionFocused = ref(false);

const projectId = computed(() => route.params.id);

onMounted(async () => {
  projectsStore.error = null; // Clear previous errors
  if (props.isEditing && projectId.value) {
    await projectsStore.fetchProject(projectId.value);
    if (projectsStore.currentProject) {
      projectData.value.name = projectsStore.currentProject.name;
      projectData.value.description = projectsStore.currentProject.description || '';
    } else if (projectsStore.error) {
      formError.value = "Could not load project data for editing.";
    }
  } else {
    // Reset for new project form
    projectData.value = { name: '', description: '' };
  }
});

// Watch for route changes if the component is reused for navigation between new/edit
watch(() => route.params.id, async (newId, oldId) => {
  if (newId !== oldId) {
    projectsStore.error = null;
    if (props.isEditing && newId) {
      await projectsStore.fetchProject(newId);
      if (projectsStore.currentProject) {
        projectData.value.name = projectsStore.currentProject.name;
        projectData.value.description = projectsStore.currentProject.description || '';
      } else if (projectsStore.error) {
        formError.value = "Could not load project data for editing.";
      }
    } else if (!props.isEditing) {
      projectData.value = { name: '', description: '' };
    }
  }
});

const handleSubmit = async () => {
  formError.value = null;
  successMessage.value = null;
  projectsStore.error = null;

  if (!projectData.value.name.trim()) {
    formError.value = 'Project name is required.';
    return;
  }

  try {
    let newOrUpdatedProject;
    if (props.isEditing) {
      newOrUpdatedProject = await projectsStore.updateProject(projectId.value, projectData.value);
      successMessage.value = 'Project updated successfully!';
    } else {
      newOrUpdatedProject = await projectsStore.createProject(projectData.value);
      successMessage.value = 'Project created successfully!';
    }

    if (newOrUpdatedProject && newOrUpdatedProject.id) {
      setTimeout(() => {
        router.push(`/projects/${newOrUpdatedProject.id}`);
      }, 1500);
    } else if (!projectsStore.error) {
      // If the store didn't return an error but also not a project, handle this edge case.
      formError.value = "An unexpected issue occurred. Project might not have been saved correctly.";
    }

  } catch (err) {
    // The store itself sets projectsStore.error, but we might want a form-specific one
    formError.value = err.message || `Failed to ${props.isEditing ? 'update' : 'create'} project.`;
    console.error('Project form submission error:', err);
  }
};

const goBack = () => {
  if (props.isEditing && projectId.value) {
    router.push(`/projects/${projectId.value}`);
  } else {
    router.push('/projects');
  }
};
</script>

<style scoped>
/* Any component-specific styles can go here if needed,
   but Tailwind utilities and components should cover most cases. */
</style>