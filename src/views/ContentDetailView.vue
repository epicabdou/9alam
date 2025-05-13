
<!-- src/views/ContentDetailView.vue -->
<template>
  <div v-if="loading" class="loading">
    <div class="spinner"></div>
    <span>Loading content...</span>
  </div>

  <div v-else-if="content" class="content-detail-container animate-fade-in">
    <div class="content-header glass-card">
      <div class="content-info">
        <div class="content-type-badge" :class="getBadgeClass(content.content_type)">
          {{ formatContentType(content.content_type) }}
        </div>
        <h1 class="content-title text-shadow-glow-subtle">{{ content.title }}</h1>
        <p class="content-meta">
          Created: {{ formatDate(content.created_at) }}
          <span v-if="content.updated_at !== content.created_at" class="updated-badge">
            · Updated: {{ formatDate(content.updated_at) }}
          </span>
        </p>
      </div>

      <div class="content-actions">
        <button @click="copyToClipboard" class="btn btn-outline-primary" :class="{ 'btn-success': copied }">
          <span v-if="copied">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Copied!
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy Content
          </span>
        </button>
        <router-link :to="`/content/${content.id}/edit`" class="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit/Regenerate
        </router-link>
        <button @click="toggleVersionHistory" class="btn btn-glass">
          <svg v-if="!showVersions" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
          {{ showVersions ? 'Hide Version History' : 'Show Version History' }}
        </button>
      </div>
    </div>

    <div class="content-layout" :class="{ 'no-sidebar': !showVersions }">
      <div class="content-main">
        <div class="prompt-box card-glass">
          <h3 class="prompt-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-accent-violet" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
            </svg>
            Prompt
          </h3>
          <p class="prompt-text">{{ content.prompt }}</p>
        </div>

        <div class="content-box card-glass">
          <h3 class="content-box-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-accent-cyan" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
            </svg>
            Generated Content
          </h3>
          <div class="content-body" v-html="formattedContent"></div>
        </div>
      </div>

      <div v-if="showVersions" class="version-sidebar card-glass animate-slide-in-right">
        <h3 class="sidebar-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-accent-teal" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
            <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
          </svg>
          Version History
        </h3>

        <div v-if="versionsLoading" class="loading-small">
          <div class="spinner spinner-sm"></div>
          <span>Loading versions...</span>
        </div>

        <div v-else-if="contentVersions.length === 0" class="empty-state">
          <p>No version history available.</p>
        </div>

        <ul v-else class="version-list">
          <li
              v-for="version in contentVersions"
              :key="version.id"
              class="version-item"
              :class="{ 'active': activeVersion === version.id }"
              @click="viewVersion(version)"
          >
            <div class="version-header">
              <span class="version-number">v{{ version.version_number }}</span>
              <span class="version-date">{{ formatDate(version.created_at) }}</span>
            </div>
            <p class="version-preview">
              {{ truncateText(version.content, 50) }}
            </p>
          </li>
        </ul>
      </div>
    </div>

    <div class="content-footer glass-card">
      <router-link :to="`/projects/${content.project_id}`" class="btn btn-glass">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to Project
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import { marked } from 'marked';

const route = useRoute();
const router = useRouter();
const contentStore = useContentStore();

const content = ref(null);
const contentVersions = ref([]);
const originalContent = ref('');
const currentViewingContent = ref('');
const loading = ref(true);
const versionsLoading = ref(false);
const showVersions = ref(false);
const activeVersion = ref(null);
const copied = ref(false);

const formattedContent = computed(() => {
  if (!currentViewingContent.value) return '';
  return marked(currentViewingContent.value);
});

onMounted(async () => {
  const contentId = route.params.id;

  try {
    const contentData = await contentStore.fetchContentPiece(contentId);
    content.value = contentData;
    originalContent.value = contentData.generated_content;
    currentViewingContent.value = contentData.generated_content;
  } catch (error) {
    console.error('Error loading content:', error);
  } finally {
    loading.value = false;
  }
});

async function loadVersions() {
  if (!content.value) return;

  versionsLoading.value = true;

  try {
    const versions = await contentStore.fetchContentVersions(content.value.id);
    contentVersions.value = versions;
  } catch (error) {
    console.error('Error loading versions:', error);
  } finally {
    versionsLoading.value = false;
  }
}

function toggleVersionHistory() {
  showVersions.value = !showVersions.value;

  if (showVersions.value && contentVersions.value.length === 0) {
    loadVersions();
  }

  // Reset to original content when closing version history
  if (!showVersions.value) {
    currentViewingContent.value = originalContent.value;
    activeVersion.value = null;
  }
}

function viewVersion(version) {
  currentViewingContent.value = version.content;
  activeVersion.value = version.id;
}

function copyToClipboard() {
  if (!currentViewingContent.value) return;

  navigator.clipboard.writeText(currentViewingContent.value)
      .then(() => {
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
      });
}

function formatContentType(contentType) {
  if (!contentType) return '';

  return contentType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function truncateText(text, maxLength) {
  if (!text) return '';

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}

function getBadgeClass(contentType) {
  const typeMap = {
    'email': 'badge-email',
    'social_post': 'badge-social',
    'ad_copy': 'badge-ad',
    'blog_post': 'badge-blog',
    'product_description': 'badge-product',
    'website_copy': 'badge-website'
  };

  return typeMap[contentType] || 'badge-default';
}
</script>