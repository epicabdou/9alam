<!-- src/views/ContentDetailView.vue -->
<template>
  <div v-if="loading" class="loading">
    <div class="loading-spinner"></div>
    <span>Loading content...</span>
  </div>

  <div v-else-if="content" class="content-detail-container">
    <div class="content-header">
      <div class="content-info">
        <div class="content-type-badge" :class="getBadgeClass(content.content_type)">
          {{ formatContentType(content.content_type) }}
        </div>
        <h1 class="content-title">{{ content.title }}</h1>
        <p class="content-meta">
          Created: {{ formatDate(content.created_at) }}
          <span v-if="content.updated_at !== content.created_at">
            · Updated: {{ formatDate(content.updated_at) }}
          </span>
        </p>
      </div>

      <div class="content-actions">
        <button @click="copyToClipboard" class="btn btn-outline">
          <span v-if="copied">Copied!</span>
          <span v-else>Copy Content</span>
        </button>
        <router-link :to="`/content/${content.id}/edit`" class="btn btn-secondary">
          Edit/Regenerate
        </router-link>
        <button @click="toggleVersionHistory" class="btn btn-link">
          {{ showVersions ? 'Hide Version History' : 'Show Version History' }}
        </button>
      </div>
    </div>

    <div class="content-layout">
      <div class="content-main">
        <div class="prompt-box">
          <h3 class="prompt-title">Prompt</h3>
          <p class="prompt-text">{{ content.prompt }}</p>
        </div>

        <div class="content-box">
          <h3 class="content-box-title">Generated Content</h3>
          <div class="content-body" v-html="formattedContent"></div>
        </div>
      </div>

      <div v-if="showVersions" class="version-sidebar">
        <h3 class="sidebar-title">Version History</h3>

        <div v-if="versionsLoading" class="loading">
          <div class="loading-spinner"></div>
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

    <div class="content-footer">
      <router-link :to="`/projects/${content.project_id}`" class="btn btn-link">
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

<style scoped>
.content-detail-container {
  max-width: 1000px;
  margin: 0 auto;
}

.content-header {
  margin-bottom: 2rem;
}

.content-info {
  margin-bottom: 1.5rem;
}

.content-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0.5rem 0;
}

.content-meta {
  color: #6b7280;
  font-size: 0.875rem;
}

.content-type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  margin-bottom: 0.5rem;
  background-color: #e0e7ff;
  color: #4f46e5;
}

.badge-email {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.badge-social {
  background-color: #dcfce7;
  color: #16a34a;
}

.badge-ad {
  background-color: #fef3c7;
  color: #d97706;
}

.badge-blog {
  background-color: #dbeafe;
  color: #2563eb;
}

.badge-product {
  background-color: #f3e8ff;
  color: #9333ea;
}

.badge-website {
  background-color: #ffedd5;
  color: #ea580c;
}

.badge-default {
  background-color: #f3f4f6;
  color: #6b7280;
}

.content-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
}

.content-layout.no-sidebar {
  grid-template-columns: 1fr;
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
}

.content-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.prompt-box, .content-box {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.prompt-title, .content-box-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.prompt-text {
  color: #4b5563;
  line-height: 1.6;
  font-style: italic;
}

.content-body {
  color: #1f2937;
  line-height: 1.6;
}

.version-sidebar {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.version-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.version-item {
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.version-item:hover {
  background-color: #f9fafb;
}

.version-item.active {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.version-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.version-number {
  font-weight: 600;
  color: #4f46e5;
}

.version-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.version-preview {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 0;
}

.content-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-link {
  background-color: transparent;
  color: #4f46e5;
  border: none;
  padding: 0;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}

.empty-state {
  color: #6b7280;
  font-style: italic;
  text-align: center;
  padding: 1rem 0;
}
</style>