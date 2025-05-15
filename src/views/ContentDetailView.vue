<!-- src/views/ContentDetailView.vue -->
<template>
  <div class="min-h-screen bg-background-dark text-text-light p-4 md:p-8 font-sans scrollbar-thin">
    <div v-if="contentStore.loading && !contentStore.currentContent" class="flex justify-center items-center h-screen">
      <div class="spinner spinner-lg"></div>
    </div>
    <div v-else-if="contentStore.error" class="max-w-3xl mx-auto">
      <div class="alert alert-danger">
        <p class="font-bold">Error loading content:</p>
        <p>{{ contentStore.error }}</p>
      </div>
      <button @click="goBackToProject" class="btn btn-glass mt-6 text-sm">
        Back to Project
      </button>
    </div>
    <div v-else-if="contentStore.currentContent" class="max-w-4xl mx-auto">
      <div class="mb-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <button @click="goBackToProject" class="btn btn-glass mb-4 md:mb-0 text-sm order-2 md:order-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Back to Project
          </button>
          <div class="flex space-x-3 order-1 md:order-2 ml-auto md:ml-0 mb-4 md:mb-0">
            <router-link :to="`/content/${contentStore.currentContent.id}/edit`" class="btn btn-secondary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </router-link>
            <button @click="confirmDelete" class="btn btn-danger btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
        <h1 class="heading-1 font-display text-text-light text-shadow-glow-violet break-words">
          {{ contentStore.currentContent.title || 'Content Detail' }}
        </h1>
        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-muted mt-2">
          <span class="badge badge-primary">{{ contentStore.currentContent.content_type?.replace(/_/g, ' ') || 'N/A' }}</span>
          <span>Created: {{ formatDate(contentStore.currentContent.created_at) }}</span>
          <span>Last Updated: {{ formatDate(contentStore.currentContent.updated_at) }}</span>
        </div>
      </div>

      <div class="mb-8 card bg-panel-medium p-6 rounded-lg shadow-lg">
        <h2 class="heading-3 text-accent-purple mb-3">Original Prompt</h2>
        <p class="text-text-light whitespace-pre-wrap text-base leading-relaxed">
          {{ contentStore.currentContent.prompt }}
        </p>
      </div>

      <div class="mb-8 card bg-background-deeper p-6 rounded-lg shadow-xl">
        <h2 class="heading-3 text-accent-cyan mb-4">Generated Content</h2>
        <div
          v-if="selectedVersionContent"
          class="prose prose-invert max-w-none text-text-light leading-relaxed text-lg selection:bg-accent-violet selection:text-white"
          v-html="renderMarkdown(selectedVersionContent)"
        ></div>
        <div v-else class="text-text-muted">No version selected or content is empty.</div>
      </div>

      <div class="mb-8 glass-card p-6 rounded-lg">
        <h2 class="heading-3 text-accent-teal mb-4">Version History</h2>
        <div v-if="contentStore.loading && contentStore.contentVersions.length === 0" class="text-text-muted">Loading versions...</div>
        <div v-else-if="contentStore.contentVersions.length > 0" class="space-y-3">
          <button
            v-for="version in contentStore.contentVersions"
            :key="version.id"
            @click="selectVersion(version)"
            class="btn w-full text-left justify-start"
            :class="selectedVersionId === version.id ? 'btn-primary' : 'btn-glass hover:bg-panel-highlight'"
          >
            <span class="mr-3 badge" :class="selectedVersionId === version.id ? 'badge-secondary' : 'badge-primary'">V{{ version.version_number }}</span>
            <span>Saved on {{ formatDate(version.created_at) }}</span>
            <span v-if="isActiveVersion(version)" class="ml-auto badge badge-success">Current</span>
          </button>
        </div>
        <div v-else class="text-text-muted">No version history available for this content.</div>
      </div>

      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-fade-in">
        <div class="glass-dark p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 class="heading-3 text-text-light mb-4">Confirm Deletion</h3>
          <p class="text-text-muted mb-6">Are you sure you want to delete this content piece? This action cannot be undone.</p>
          <div class="flex justify-end space-x-4">
            <button @click="showDeleteModal = false" class="btn btn-glass">Cancel</button>
            <button @click="executeDelete" class="btn btn-danger" :class="{'btn-loading': deleting}" :disabled="deleting">
              <span v-if="deleting" class="btn-loading-spin"></span>
              Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import { marked } from 'marked'; // Make sure to install marked: npm install marked

const route = useRoute();
const router = useRouter();
const contentStore = useContentStore();

const showDeleteModal = ref(false);
const deleting = ref(false);

const selectedVersionId = ref(null);

const currentContentDetails = computed(() => contentStore.currentContent);
const contentVersions = computed(() => contentStore.contentVersions);

const selectedVersionContent = computed(() => {
  if (!selectedVersionId.value) return currentContentDetails.value?.generated_content; // Fallback to current main content
  const version = contentVersions.value.find(v => v.id === selectedVersionId.value);
  return version ? version.content : currentContentDetails.value?.generated_content;
});

const isActiveVersion = (version) => {
  // The "active" version is the one whose content matches the main `generated_content`
  // and typically would be the highest version number if not explicitly set.
  // Here, we highlight the version that is currently loaded into the main display.
  return version.content === currentContentDetails.value?.generated_content && version.version_number === Math.max(...contentVersions.value.map(v => v.version_number));
};


onMounted(async () => {
  const contentId = route.params.id;
  if (contentId) {
    await contentStore.fetchContentPiece(contentId);
    await contentStore.fetchContentVersions(contentId);
    if (contentStore.currentContent) {
      // Select the latest version by default or the version matching the currentContent.generated_content
      const latestVersion = contentStore.contentVersions.find(
        v => v.content === contentStore.currentContent.generated_content
      ) || (contentStore.contentVersions.length > 0 ? contentStore.contentVersions[0] : null);

      if (latestVersion) {
        selectedVersionId.value = latestVersion.id;
      }
    }
  }
});

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await contentStore.fetchContentPiece(newId);
    await contentStore.fetchContentVersions(newId);
    if (contentStore.currentContent) {
      const latestVersion = contentStore.contentVersions.find(
        v => v.content === contentStore.currentContent.generated_content
      ) || (contentStore.contentVersions.length > 0 ? contentStore.contentVersions[0] : null);
      if (latestVersion) {
        selectedVersionId.value = latestVersion.id;
      }
    }
  }
});

const renderMarkdown = (markdownText) => {
  if (!markdownText) return '';
  // Configure marked (optional)
  marked.setOptions({
    pedantic: false,
    gfm: true,
    breaks: true,
    sanitize: false, // Be careful with this if content can be user-input HTML
    smartLists: true,
    smartypants: false,
    xhtml: false
  });
  return marked.parse(markdownText);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const executeDelete = async () => {
  deleting.value = true;
  try {
    const projectId = contentStore.currentContent?.project_id;
    await contentStore.deleteContent(contentStore.currentContent.id);
    showDeleteModal.value = false;
    if (projectId) {
      router.push(`/projects/${projectId}`);
    } else {
      router.push('/projects'); // Fallback
    }
  } catch (error) {
    console.error('Failed to delete content:', error);
    // Display error to user if needed
  } finally {
    deleting.value = false;
  }
};

const goBackToProject = () => {
  const projectId = contentStore.currentContent?.project_id;
  if (projectId) {
    router.push(`/projects/${projectId}`);
  } else {
    router.push('/projects'); // Fallback
  }
};

const selectVersion = (version) => {
  selectedVersionId.value = version.id;
  // Optionally, you could update the main currentContent if you want "switching version" to be a saveable action
  // For now, it just changes what's displayed in the v-html.
  // If you want this to "load" the version into the main content display and potentially save it as the new "current"
  // you'd call:
  // contentStore.currentContent.generated_content = version.content;
  // And then perhaps an updateContent call if you have a "set active version" mechanism.
};

</script>

<style>
/* Basic styling for prose (rendered markdown) */
.prose-invert {
  color: var(--tw-prose-invert-body); /* Ensure text color is from your theme */
}
.prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert strong {
  color: var(--tw-prose-invert-headings);
}
.prose-invert a {
  color: var(--tw-prose-invert-links);
}
.prose-invert a:hover {
  color: #00E5FF; /* theme('colors.accent.cyan') */
}
.prose-invert blockquote {
  border-left-color: var(--tw-prose-invert-quote-borders);
  color: var(--tw-prose-invert-quotes);
}
.prose-invert code {
  color: var(--tw-prose-invert-code);
  background-color: rgba(255,255,255,0.1); /* theme('colors.panel.medium') */
  padding: 0.2em 0.4em;
  border-radius: theme('borderRadius.sm');
}
.prose-invert pre {
  background-color: rgba(0,0,0,0.3); /* Darker panel for code blocks */
  color: var(--tw-prose-invert-pre-code);
  border-radius: theme('borderRadius.md');
  padding: 1em;
  overflow-x: auto;
}
.prose-invert ul > li::before {
  background-color: var(--tw-prose-invert-bullets);
}
</style>