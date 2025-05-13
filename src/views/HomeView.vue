<!-- src/views/HomeView.vue -->
<template>
  <div class="home-container">
    <header class="home-header">
      <h1 class="home-title">Welcome to CopyGenius AI</h1>
      <p class="home-subtitle">
        Your AI-powered copywriting assistant to create compelling marketing content
      </p>
      <div class="action-buttons">
        <router-link to="/projects" class="btn btn-primary">
          View Your Projects
        </router-link>
        <router-link to="/projects/new" class="btn btn-secondary">
          Create New Project
        </router-link>
      </div>
    </header>

    <section class="stats-section" v-if="recentProjects.length > 0 || recentContentPieces.length > 0">
      <div class="stats-container">
        <div class="stats-card">
          <h3 class="stats-title">Recent Projects</h3>
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <span>Loading projects...</span>
          </div>
          <div v-else-if="recentProjects.length === 0" class="empty-state">
            <p>No projects yet. Start by creating a new project.</p>
          </div>
          <ul v-else class="stats-list">
            <li v-for="project in recentProjects" :key="project.id" class="stats-item">
              <router-link :to="`/projects/${project.id}`" class="stats-link">
                {{ project.name }}
              </router-link>
              <span class="stats-date">{{ formatDate(project.created_at) }}</span>
            </li>
          </ul>
        </div>

        <div class="stats-card">
          <h3 class="stats-title">Recent Content</h3>
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <span>Loading content...</span>
          </div>
          <div v-else-if="recentContentPieces.length === 0" class="empty-state">
            <p>No content pieces yet. Create a project and start generating content.</p>
          </div>
          <ul v-else class="stats-list">
            <li v-for="content in recentContentPieces" :key="content.id" class="stats-item">
              <router-link :to="`/content/${content.id}`" class="stats-link">
                {{ content.title }}
              </router-link>
              <span class="content-type">{{ formatContentType(content.content_type) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="features-section">
      <h2 class="section-title">What You Can Do</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <h3 class="feature-title">Create Engaging Copy</h3>
          <p class="feature-description">
            Generate high-quality, engaging copy for various marketing channels using AI.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🗂️</div>
          <h3 class="feature-title">Organize Projects</h3>
          <p class="feature-description">
            Keep your content organized by projects for different campaigns or clients.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔄</div>
          <h3 class="feature-title">Version History</h3>
          <p class="feature-description">
            Track revisions and improvements to your content with version history.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Quick Generation</h3>
          <p class="feature-description">
            Generate content in seconds with powerful AI models.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProjectsStore } from '@/stores/projects';
import { supabase } from '@/services/supabase';

const projectsStore = useProjectsStore();
const recentProjects = ref([]);
const recentContentPieces = ref([]);
const loading = ref(true);

onMounted(async () => {
  await loadDashboardData();
});

async function loadDashboardData() {
  loading.value = true;

  try {
    // Fetch recent projects
    const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (projectsError) throw projectsError;
    recentProjects.value = projectsData;

    // Fetch recent content pieces
    const { data: contentData, error: contentError } = await supabase
        .from('content_pieces')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (contentError) throw contentError;
    recentContentPieces.value = contentData;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    loading.value = false;
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
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 1rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
}

.home-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.home-subtitle {
  font-size: 1.25rem;
  color: #4b5563;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.stats-section {
  margin-bottom: 3rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stats-card {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.stats-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.stats-list {
  list-style: none;
  padding: 0;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.stats-item:last-child {
  border-bottom: none;
}

.stats-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

.stats-link:hover {
  text-decoration: underline;
}

.stats-date, .content-type {
  font-size: 0.875rem;
  color: #6b7280;
}

.content-type {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
}

.empty-state {
  color: #6b7280;
  font-style: italic;
  text-align: center;
  padding: 1.5rem 0;
}

.features-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.feature-description {
  color: #4b5563;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .home-title {
    font-size: 2rem;
  }

  .home-subtitle {
    font-size: 1.125rem;
  }
}
</style>