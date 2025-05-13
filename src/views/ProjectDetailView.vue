<!-- src/views/ProjectDetailView.vue -->
<template>
  <div v-if="loading" class="loading">
    <div class="loading-spinner"></div>
    <span>Loading project...</span>
  </div>

  <div v-else-if="project" class="project-detail-container">
    <div class="project-header">
      <div>
        <h1 class="project-title">{{ project.name }}</h1>
        <p v-if="project.description" class="project-description">
          {{ project.description }}
        </p>
        <p class="project-meta">
          Created: {{ formatDate(project.created_at) }}
        </p>
      </div>

      <div class="project-actions">
        <router-link :to="`/projects/${project.id}/edit`" class="btn btn-secondary">
          Edit Project
        </router-link>
        <router-link :to="`/projects/${project.id}/content/new`" class="btn btn-primary">
          Create Content
        </router-link>
      </div>
    </div>

    <div class="content-section">
      <h2 class="section-title">Content Pieces</h2>

      <div v-if="contentLoading" class="loading">
        <div class="loading-spinner"></div>
        <span>Loading content...</span>
      </div>

      <div v-else-if="contentPieces.length === 0" class="empty-state">
        <h3>No Content Yet</h3>
        <p>Start creating content for this project.</p>
        <router-link :to="`/projects/${project.id}/content/new`" class="btn btn-primary mt-4">
          Create Your First Content
        </router-link>
      </div>

      <div v-else class="content-grid">
        <div v-for="content in contentPieces" :key="content.id" class="content-card">
          <div class="content-type-badge" :class="getBadgeClass(content.content_type)">
            {{ formatContentType(content.content_type) }}
          </div>
          <h3 class="content-title">
            <router-link :to="`/content/${content.id}`">
              {{ content.title }}
            </router-link>
          </h3>
          <p class="content-preview">
            {{ truncateText(content.generated_content, 100) }}
          </p>
          <div class="content-meta">
            <span class="content-date">Created: {{ formatDate(content.created_at) }}</span>
          </div>
          <div class="content-actions">
            <router-link :to="`/content/${content.id}`" class="btn btn-sm btn-secondary">
              View
            </router-link>
            <router-link :to="`/content/${content.id}/edit`" class="btn btn-sm btn-outline">
              Edit
            </router-link>
            <button @click="confirmDeleteContent(content)" class="btn btn-sm btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Content Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-container">
        <h3 class="modal-title">Confirm Delete</h3>
        <p class="modal-text">
          Are you sure you want to delete this content? This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn btn-secondary">
            Cancel
          </button>
          <button @click="deleteContent" class="btn btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import { useContentStore } from '@/stores/content';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const contentStore = useContentStore();

const project = ref(null);
const contentPieces = ref([]);
const loading = ref(true);
const contentLoading = ref(true);
const showDeleteModal = ref(false);
const contentToDelete = ref(null);

onMounted(async () => {
  const projectId = route.params.id;

  try {
    project.value = await projectsStore.fetchProject(projectId);
    loading.value = false;

    await loadContentPieces(projectId);
  } catch (error) {
    console.error('Error loading project data:', error);
    loading.value = false;
  }
});

async function loadContentPieces(projectId) {
  contentLoading.value = true;

  try {
    const data = await contentStore.fetchContentPieces(projectId);
    contentPieces.value = data || [];
  } catch (error) {
    console.error('Error loading content pieces:', error);
  } finally {
    contentLoading.value = false;
  }
}

function confirmDeleteContent(content) {
  contentToDelete.value = content;
  showDeleteModal.value = true;
}

async function deleteContent() {
  if (!contentToDelete.value) return;

  try {
    await contentStore.deleteContent(contentToDelete.value.id);
    contentPieces.value = contentPieces.value.filter(c => c.id !== contentToDelete.value.id);
    showDeleteModal.value = false;
    contentToDelete.value = null;
  } catch (error) {
    console.error('Error deleting content:', error);
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

function formatContentType(contentType) {
  if (!contentType) return '';

  return contentType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
.project-detail-container {
  max-width: 1000px;
  margin: 0 auto;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.project-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.project-description {
  font-size: 1.125rem;
  color: #4b5563;
  margin-bottom: 1rem;
  max-width: 600px;
}

.project-meta {
  color: #6b7280;
  font-size: 0.875rem;
}

.project-actions {
  display: flex;
  gap: 0.75rem;
}

.content-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.content-card {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.content-type-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-bottom-left-radius: 0.375rem;
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

.content-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: #1f2937;
}

.content-title a {
  color: inherit;
  text-decoration: none;
}

.content-title a:hover {
  color: #4f46e5;
}

.content-preview {
  color: #4b5563;
  margin-bottom: 1rem;
  line-height: 1.5;
  font-size: 0.875rem;
}

.content-meta {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.content-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.empty-state p {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>