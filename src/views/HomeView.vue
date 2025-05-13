<!-- src/views/HomeView.vue -->
<template>
  <div class="home-container animate-fade-in">
    <header class="home-header glass-card bg-aurora-gradient-diagonal">
      <h1 class="home-title text-shadow-glow-white">Welcome to CopyGenius AI</h1>
      <p class="home-subtitle">
        Your AI-powered copywriting assistant to create compelling marketing content
      </p>
      <div class="action-buttons">
        <router-link to="/projects" class="btn btn-primary">
          View Your Projects
        </router-link>
        <router-link to="/projects/new" class="btn btn-glass">
          Create New Project
        </router-link>
      </div>
    </header>

    <section class="stats-section" v-if="recentProjects.length > 0 || recentContentPieces.length > 0">
      <div class="stats-container">
        <div class="stats-card card-glass hover:card-hover">
          <h3 class="stats-title">Recent Projects</h3>
          <div v-if="loading" class="loading">
            <div class="spinner spinner-sm"></div>
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

        <div class="stats-card card-glass hover:card-hover">
          <h3 class="stats-title">Recent Content</h3>
          <div v-if="loading" class="loading">
            <div class="spinner spinner-sm"></div>
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
              <span class="content-type badge badge-primary">{{ formatContentType(content.content_type) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="features-section">
      <h2 class="section-title text-shadow-glow-subtle">What You Can Do</h2>
      <div class="features-grid">
        <div class="feature-card card-glass hover:card-hover">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-accent-cyan">
              <path d="M12 5.5V4"></path>
              <path d="M12 20v-1.5"></path>
              <path d="M4 12h1.5"></path>
              <path d="M18.5 12H20"></path>
              <path d="M17.5 20h-11a2.5 2.5 0 0 1 0-5h11a2.5 2.5 0 0 0 0-5h-11a2.5 2.5 0 0 1 0-5h11"></path>
            </svg>
          </div>
          <h3 class="feature-title">Create Engaging Copy</h3>
          <p class="feature-description">
            Generate high-quality, engaging copy for various marketing channels using AI.
          </p>
        </div>

        <div class="feature-card card-glass hover:card-hover">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-accent-violet">
              <rect x="4" y="4" width="16" height="16" rx="2"></rect>
              <path d="M9 4v16"></path>
              <path d="M15 4v16"></path>
              <path d="M4 9h16"></path>
              <path d="M4 15h16"></path>
            </svg>
          </div>
          <h3 class="feature-title">Organize Projects</h3>
          <p class="feature-description">
            Keep your content organized by projects for different campaigns or clients.
          </p>
        </div>

        <div class="feature-card card-glass hover:card-hover">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-accent-teal">
              <path d="M3 12h6"></path>
              <path d="M15 12h6"></path>
              <path d="M9 6l3 6 3-6"></path>
              <path d="M9 18l3-6 3 6"></path>
            </svg>
          </div>
          <h3 class="feature-title">Version History</h3>
          <p class="feature-description">
            Track revisions and improvements to your content with version history.
          </p>
        </div>

        <div class="feature-card card-glass hover:card-hover">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-accent-gold">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
            </svg>
          </div>
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