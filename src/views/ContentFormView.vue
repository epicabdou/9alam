<!-- src/views/ContentFormView.vue - Enhanced Version -->
<template>
  <div class="content-form-container">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading...</span>
    </div>

    <template v-else>
      <h1 class="page-title">{{ isEditing ? 'Edit Content' : 'Create New Content' }}</h1>

      <div class="content-form-layout">
        <form @submit.prevent="generateContent" class="form-container">
          <!-- Step 1: Basic Info -->
          <div class="form-section">
            <h2 class="section-title">1. Basic Information</h2>

            <div class="form-group">
              <label for="title">Title</label>
              <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Give your content a name"
              />
            </div>

            <div class="form-group">
              <label for="contentType">Content Type</label>
              <select
                  id="contentType"
                  v-model="form.contentType"
                  required
                  @change="loadTemplateOptions"
              >
                <option value="" disabled>Select content type</option>
                <option value="email">Email</option>
                <option value="social_post">Social Media Post</option>
                <option value="ad_copy">Ad Copy</option>
                <option value="blog_post">Blog Post</option>
                <option value="product_description">Product Description</option>
                <option value="website_copy">Website Copy</option>
              </select>
            </div>

            <div class="form-group" v-if="form.contentType && templateOptions.length > 0">
              <label for="templateId">Template (Optional)</label>
              <select
                  id="templateId"
                  v-model="form.templateId"
                  @change="applyTemplate"
              >
                <option value="">No template - start from scratch</option>
                <option v-for="template in templateOptions" :key="template.id" :value="template.id">
                  {{ template.name }}
                </option>
              </select>
              <div class="help-text" v-if="selectedTemplate">
                {{ selectedTemplate.description }}
              </div>
            </div>

            <div class="form-group">
              <label for="language">Language</label>
              <select id="language" v-model="form.language">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="ru">Russian</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="ko">Korean</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
          </div>

          <!-- Step 2: Content Details -->
          <div class="form-section">
            <h2 class="section-title">2. Content Details</h2>

            <div class="form-group">
              <label for="prompt">Your Prompt</label>
              <textarea
                  id="prompt"
                  v-model="form.prompt"
                  required
                  placeholder="Describe what you want to create..."
                  rows="5"
              ></textarea>
              <div class="help-text">
                Be specific about your audience, tone, purpose, and key points.
              </div>
            </div>

            <!-- Tone Selection -->
            <div class="form-group">
              <label>Tone</label>
              <div class="checkbox-grid">
                <label class="checkbox-label" v-for="tone in toneOptions" :key="tone.value">
                  <input
                      type="checkbox"
                      :value="tone.value"
                      v-model="form.tones"
                  />
                  <span>{{ tone.label }}</span>
                </label>
              </div>
            </div>

            <!-- Purpose Selection - Shows different options based on content type -->
            <div class="form-group" v-if="purposeOptions.length > 0">
              <label>Purpose</label>
              <div class="radio-group">
                <label class="radio-label" v-for="purpose in purposeOptions" :key="purpose.value">
                  <input
                      type="radio"
                      :value="purpose.value"
                      v-model="form.purpose"
                      name="purpose"
                  />
                  <span>{{ purpose.label }}</span>
                </label>
              </div>
            </div>

            <!-- Length Selection -->
            <div class="form-group">
              <label for="contentLength">Content Length</label>
              <select id="contentLength" v-model="form.contentLength">
                <option value="short">Short (under 150 words)</option>
                <option value="medium">Medium (150-300 words)</option>
                <option value="long">Long (300-600 words)</option>
                <option value="comprehensive">Comprehensive (600+ words)</option>
              </select>
            </div>

            <!-- Template Placeholders - Shows when a template is selected -->
            <div class="form-group" v-if="selectedTemplate && selectedTemplate.template_data && selectedTemplate.template_data.placeholders && selectedTemplate.template_data.placeholders.length > 0">
              <div class="placeholders-section">
                <h3 class="subsection-title">Template Placeholders</h3>
                <p class="help-text">Replace these placeholders in your prompt with your specific information:</p>

                <div class="placeholder-tags">
                  <span
                      v-for="placeholder in selectedTemplate.template_data.placeholders"
                      :key="placeholder"
                      class="placeholder-tag"
                      @click="insertPlaceholder(placeholder)"
                  >
                    [{{ placeholder }}]
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pre-generation Placeholder Values -->
          <div class="form-section" v-if="selectedTemplate && selectedTemplate.template_data && selectedTemplate.template_data.placeholders && selectedTemplate.template_data.placeholders.length > 0">
            <h2 class="section-title">4. Fill Template Values</h2>
            <p class="help-text">Enter specific values to personalize your content before generation:</p>

            <div class="pre-generation-placeholders">
              <div
                  v-for="placeholder in selectedTemplate.template_data.placeholders"
                  :key="placeholder"
                  class="placeholder-input-group"
              >
                <label :for="'pre-' + placeholder">[{{ placeholder }}]</label>
                <input
                    :id="'pre-' + placeholder"
                    v-model="preGenerationValues[placeholder]"
                    type="text"
                    :placeholder="'Enter value for ' + placeholder"
                />
              </div>
            </div>

            <div class="placeholder-summary" v-if="Object.keys(preGenerationValues).some(key => preGenerationValues[key])">
              <h3 class="subsection-title">Values to be used:</h3>
              <ul class="placeholder-summary-list">
                <li v-for="(value, placeholder) in preGenerationValues" :key="placeholder" v-if="value">
                  <strong>[{{ placeholder }}]:</strong> {{ value }}
                </li>
              </ul>
            </div>
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
                :disabled="generatingContent"
            >
              <span v-if="generatingContent">
                <span class="spinner-inline"></span>
                Generating...
              </span>
              <span v-else>
                {{ isEditing ? 'Regenerate Content' : 'Generate Content' }}
              </span>
            </button>
          </div>
        </form>

        <!-- Generated Content with Enhanced Display and Editing -->
        <div v-if="generatedContent" class="generated-content-container">
          <div class="generated-content-header">
            <h2 class="content-result-title">Generated Content</h2>
            <div class="content-actions">
              <button @click="copyToClipboard" class="btn btn-sm btn-outline">
                <span v-if="copied">Copied!</span>
                <span v-else>Copy</span>
              </button>
              <button @click="toggleEditMode" class="btn btn-sm btn-outline">
                {{ isEditing ? 'Preview' : 'Edit' }}
              </button>
              <button v-if="!props.isEditing" @click="saveContent" class="btn btn-sm btn-primary" :disabled="saving">
                <span v-if="saving">Saving...</span>
                <span v-else>Save</span>
              </button>
              <button v-else @click="updateContent" class="btn btn-sm btn-primary" :disabled="saving">
                <span v-if="saving">Updating...</span>
                <span v-else>Update</span>
              </button>
            </div>
          </div>

          <!-- Content Preview/Edit Mode Toggle -->
          <div class="generated-content-body">
            <!-- Edit Mode -->
            <div v-if="editMode" class="content-edit-mode">
      <textarea
          v-model="generatedContent"
          class="content-editor"
          rows="20"
          spellcheck="true"
          :placeholder="editPlaceholder"
      ></textarea>
            </div>

            <!-- Preview Mode with Placeholder Highlighting -->
            <div v-else class="generated-content-preview" v-html="formattedContentWithHighlights"></div>
          </div>

          <!-- Placeholder Values for Generated Content -->
          <div v-if="detectedPlaceholders.length > 0" class="content-placeholders-panel">
            <h3 class="panel-title">Fill in Placeholders</h3>
            <p class="panel-description">Update these values to customize your content:</p>

            <div class="placeholder-inputs">
              <div
                  v-for="placeholder in detectedPlaceholders"
                  :key="placeholder"
                  class="placeholder-input-group"
              >
                <label :for="'placeholder-' + placeholder">[{{ placeholder }}]</label>
                <input
                    :id="'placeholder-' + placeholder"
                    v-model="placeholderValues[placeholder]"
                    type="text"
                    @input="updateContentWithPlaceholders"
                    :placeholder="'Enter value for ' + placeholder"
                />
              </div>
            </div>

            <div class="placeholder-actions">
              <button @click="applyAllPlaceholders" class="btn btn-sm btn-primary">
                Apply All Values
              </button>
              <button @click="clearAllPlaceholders" class="btn btn-sm btn-outline">
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContentStore } from '@/stores/content';
import { useProjectsStore } from '@/stores/projects';
import { supabase } from '@/services/supabase';
import { marked } from 'marked';

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const router = useRouter();
const contentStore = useContentStore();
const projectsStore = useProjectsStore();

// Form state
const form = reactive({
  title: '',
  contentType: '',
  templateId: '',
  prompt: '',
  tones: [],
  purpose: '',
  contentLength: 'medium',
  language: 'en',
  additionalInstructions: '',
  aiProvider: 'openai',
  temperature: 0.7
});

// UI state
const generatedContent = ref('');
const loading = ref(false);
const generatingContent = ref(false);
const saving = ref(false);
const error = ref('');
const copied = ref(false);
const showAdditionalInstructions = ref(false);
const templateOptions = ref([]);
const selectedTemplate = ref(null);

// Options for form selectors
const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'persuasive', label: 'Persuasive' }
];

// Purpose options based on content type
const purposeOptions = computed(() => {
  switch (form.contentType) {
    case 'email':
      return [
        { value: 'welcome', label: 'Welcome/Onboarding' },
        { value: 'newsletter', label: 'Newsletter' },
        { value: 'promotional', label: 'Promotional' },
        { value: 'reengagement', label: 'Re-engagement' },
        { value: 'announcement', label: 'Announcement' }
      ];
    case 'social_post':
      return [
        { value: 'engagement', label: 'Engagement' },
        { value: 'awareness', label: 'Brand Awareness' },
        { value: 'promotion', label: 'Promotion' },
        { value: 'educational', label: 'Educational' },
        { value: 'testimonial', label: 'Testimonial' }
      ];
    case 'ad_copy':
      return [
        { value: 'conversion', label: 'Conversion' },
        { value: 'brand_awareness', label: 'Brand Awareness' },
        { value: 'retargeting', label: 'Retargeting' },
        { value: 'promotion', label: 'Promotion' }
      ];
    case 'blog_post':
      return [
        { value: 'educational', label: 'Educational' },
        { value: 'how_to', label: 'How-To Guide' },
        { value: 'listicle', label: 'List Article' },
        { value: 'case_study', label: 'Case Study' },
        { value: 'thought_leadership', label: 'Thought Leadership' }
      ];
    case 'product_description':
      return [
        { value: 'features', label: 'Feature-Focused' },
        { value: 'benefits', label: 'Benefit-Focused' },
        { value: 'problem_solution', label: 'Problem-Solution' },
        { value: 'comparison', label: 'Comparison' }
      ];
    case 'website_copy':
      return [
        { value: 'homepage', label: 'Homepage' },
        { value: 'about', label: 'About Us' },
        { value: 'services', label: 'Services/Products' },
        { value: 'landing', label: 'Landing Page' },
        { value: 'faq', label: 'FAQ' }
      ];
    default:
      return [];
  }
});

// Format generated content with markdown
// State for content editing and placeholder handling
const editMode = ref(false);
const placeholderValues = ref({});
const detectedPlaceholders = ref([]);
const originalContent = ref('');
const editPlaceholder = 'Edit your content here. Use [placeholder_name] for dynamic content.';

// Format content with placeholder highlighting
const formattedContentWithHighlights = computed(() => {
  if (!generatedContent.value) return '';

  // First apply any placeholder values
  let content = generatedContent.value;
  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value) {
      const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
      content = content.replace(regex, `<span class="filled-placeholder">${value}</span>`);
    }
  }

  // Then highlight remaining placeholders
  content = content.replace(/\[([^\]]+)\]/g, '<span class="highlight-placeholder">[$1]</span>');

  // Convert markdown to HTML
  return marked(content);
});

// Toggle between edit and preview mode
function toggleEditMode() {
  if (!editMode.value) {
    // Switching to edit mode
    originalContent.value = generatedContent.value;
  } else {
    // Switching to preview mode
    detectPlaceholders();
  }
  editMode.value = !editMode.value;
}

// Detect placeholders in the generated content
function detectPlaceholders() {
  const placeholders = [];
  const regex = /\[([^\]]+)\]/g;
  let match;

  while ((match = regex.exec(generatedContent.value)) !== null) {
    if (!placeholders.includes(match[1])) {
      placeholders.push(match[1]);
    }
  }

  detectedPlaceholders.value = placeholders;

  // Initialize placeholder values if not already set
  placeholders.forEach(placeholder => {
    if (!placeholderValues.value[placeholder]) {
      placeholderValues.value[placeholder] = '';
    }
  });
}

// Update content with placeholder values in real-time
function updateContentWithPlaceholders() {
  // Create a temporary copy of the content to modify
  let tempContent = originalContent.value || generatedContent.value;

  // Replace each placeholder with its value if available
  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value) {
      const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
      tempContent = tempContent.replace(regex, value);
    }
  }

  // Only update if not in edit mode to avoid overwriting edits
  if (!editMode.value) {
    generatedContent.value = tempContent;
  }
}

// Apply all placeholder values at once
function applyAllPlaceholders() {
  let tempContent = originalContent.value || generatedContent.value;

  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value) {
      const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
      tempContent = tempContent.replace(regex, value);
    }
  }

  generatedContent.value = tempContent;

  // Update original content to include these changes
  originalContent.value = tempContent;

  // Re-detect placeholders as some may have been removed
  detectPlaceholders();
}

// Clear all placeholder values
function clearAllPlaceholders() {
  placeholderValues.value = {};

  // Reset to original content
  if (originalContent.value) {
    generatedContent.value = originalContent.value;
  }

  // Re-detect placeholders
  detectPlaceholders();
}

// Load template options when content type changes
async function loadTemplateOptions() {
  if (!form.contentType) {
    templateOptions.value = [];
    return;
  }

  try {
    const { data, error: fetchError } = await supabase
        .from('templates')
        .select('id, name, description, content_type, template_data')
        .eq('content_type', form.contentType)
        .eq('is_public', true);

    if (fetchError) throw fetchError;

    templateOptions.value = data || [];

    // For backward compatibility, check if template_data exists
    templateOptions.value = templateOptions.value.map(template => {
      if (!template.template_data) {
        // Create a basic template_data if not present
        template.template_data = {
          title: '',
          structure: template.template || '',
          tone: ['professional'],
          purpose: '',
          contentLength: 'medium',
          suggestedPrompt: `Write ${form.contentType} content based on the following template.`
        };
      }
      return template;
    });
  } catch (err) {
    console.error('Error loading templates:', err);
    error.value = 'Failed to load templates. Please try again.';
  }
}

// State for pre-generation placeholder values
const preGenerationValues = ref({});

// Apply selected template with pre-generation placeholder fields
function applyTemplate() {
  if (!form.templateId) {
    selectedTemplate.value = null;
    preGenerationValues.value = {};
    return;
  }

  const template = templateOptions.value.find(t => t.id === form.templateId);
  if (template && template.template_data) {
    selectedTemplate.value = template;

    // Initialize placeholder input fields
    if (template.template_data.placeholders && Array.isArray(template.template_data.placeholders)) {
      const placeholderObj = {};
      template.template_data.placeholders.forEach(placeholder => {
        placeholderObj[placeholder] = '';
      });
      preGenerationValues.value = placeholderObj;
    }

    // Apply the template data to populate the form
    const templateData = template.template_data;

    // Set title if not already specified by user
    if (!form.title || form.title.trim() === '') {
      form.title = templateData.title || '';
    }

    // Set tone if available in template
    if (templateData.tone && Array.isArray(templateData.tone)) {
      form.tones = [...templateData.tone];
    }

    // Set purpose if available in template
    if (templateData.purpose) {
      form.purpose = templateData.purpose;
    }

    // Set content length if available
    if (templateData.contentLength) {
      form.contentLength = templateData.contentLength;
    }

    // Set the suggested prompt if not already entered
    if (!form.prompt || form.prompt.trim() === '') {
      form.prompt = templateData.suggestedPrompt || '';

      // If there's a structure field, add it after the prompt
      if (templateData.structure) {
        form.prompt += '\n\n--- Suggested Structure ---\n\n' + templateData.structure;
      }
    }
  }
}

// Toggle additional instructions section
function toggleAdditionalInstructions() {
  showAdditionalInstructions.value = !showAdditionalInstructions.value;
}

// Insert placeholder into prompt at cursor or append
function insertPlaceholder(placeholder) {
  const promptElement = document.getElementById('prompt');

  if (promptElement) {
    const cursorPos = promptElement.selectionStart;
    const textBefore = form.prompt.substring(0, cursorPos);
    const textAfter = form.prompt.substring(cursorPos);

    form.prompt = textBefore + `[${placeholder}]` + textAfter;

    // Set focus back to the prompt field
    setTimeout(() => {
      promptElement.focus();
      // Place cursor after the inserted placeholder
      const newCursorPos = cursorPos + placeholder.length + 2; // +2 for the brackets
      promptElement.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  } else {
    // If we can't get the element, just append to the end
    form.prompt += ` [${placeholder}]`;
  }
}

// Build the final prompt with all form options
function buildFullPrompt() {
  let fullPrompt = form.prompt;

  // Add tone preferences
  if (form.tones.length > 0) {
    fullPrompt += `\n\nTone: ${form.tones.join(', ')}`;
  }

  // Add purpose
  if (form.purpose) {
    const purposeLabel = purposeOptions.value.find(p => p.value === form.purpose)?.label || form.purpose;
    fullPrompt += `\n\nPurpose: ${purposeLabel}`;
  }

  // Add content length
  fullPrompt += `\n\nLength: ${form.contentLength}`;

  // Add language preference
  const languageNames = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic'
  };

  fullPrompt += `\n\nLanguage: ${languageNames[form.language] || form.language}`;

  // Add additional instructions
  if (form.additionalInstructions) {
    fullPrompt += `\n\nAdditional Instructions: ${form.additionalInstructions}`;
  }

  return fullPrompt;
}

// Initialize component
onMounted(async () => {
  // Add the French template if it doesn't exist in the database yet
  try {
    // First check if we already have it
    const { data: existingTemplates } = await supabase
        .from('templates')
        .select('id')
        .eq('name', 'Email Promotionnel (Français)')
        .eq('content_type', 'email');

    if (!existingTemplates || existingTemplates.length === 0) {
      // Add the French template
      await supabase
          .from('templates')
          .insert({
            name: 'Email Promotionnel (Français)',
            description: 'Modèle d\'email pour une offre limitée ou une promotion spéciale',
            content_type: 'email',
            is_public: true,
            template_data: {
              title: '[Offre Limitée] Économisez [X]% sur [Produit/Service]',
              structure: 'Objet : [Offre Limitée] Économisez [X]% sur [Produit/Service]\n\nBonjour [Prénom],\n\nNous sommes ravis de vous offrir une réduction exclusive sur notre [Produit/Service].\n\n[Brève description de l\'offre et de ses avantages]\n\n🔥 [Détails spécifiques de l\'offre, ex. : "Bénéficiez de 20% de réduction sur tous nos abonnements premium"]\n⏰ Offre valable jusqu\'au : [Date de fin]\n🎁 Code promo : [CODE_REDUCTION]\n\n[Appel à l\'action, ex. : "Cliquez ici pour profiter de votre réduction"]\n\nNe manquez pas cette opportunité limitée dans le temps !\n\nCordialement,\n[Votre Prénom]\n[Nom de l\'entreprise]',
              tone: ['persuasive', 'friendly'],
              purpose: 'promotional',
              contentLength: 'medium',
              placeholders: ['Offre Limitée', 'X', 'Produit/Service', 'Prénom', 'Brève description', 'Détails spécifiques', 'Date de fin', 'CODE_REDUCTION', 'Appel à l\'action', 'Votre Prénom', 'Nom de l\'entreprise'],
              suggestedPrompt: 'Créez un email promotionnel pour une offre à durée limitée sur [Produit/Service]. L\'email doit créer un sentiment d\'urgence et inciter à l\'action.'
            }
          });
    }
  } catch (err) {
    console.warn('Error adding French template:', err);
    // Don't show error to user, continue with normal initialization
  }

  if (props.isEditing) {
    const contentId = route.params.id;
    loading.value = true;

    try {
      const content = await contentStore.fetchContentPiece(contentId);
      if (content) {
        form.title = content.title || '';
        form.contentType = content.content_type || '';
        form.prompt = content.prompt || '';

        // Store original content for placeholder handling
        generatedContent.value = content.generated_content || '';
        originalContent.value = content.generated_content || '';

        // Try to parse additional form fields from the prompt
        try {
          const toneMatch = content.prompt.match(/Tone: ([^]*?)(?=\n\n|$)/);
          if (toneMatch) {
            form.tones = toneMatch[1].split(', ').map(t => t.trim());
          }

          const purposeMatch = content.prompt.match(/Purpose: ([^]*?)(?=\n\n|$)/);
          if (purposeMatch) {
            form.purpose = purposeMatch[1];
          }

          const lengthMatch = content.prompt.match(/Length: ([^]*?)(?=\n\n|$)/);
          if (lengthMatch) {
            form.contentLength = lengthMatch[1];
          }

          const languageMatch = content.prompt.match(/Language: ([^]*?)(?=\n\n|$)/);
          if (languageMatch) {
            // Convert language name back to code
            const langName = languageMatch[1].trim();
            const langEntries = Object.entries({
              'en': 'English',
              'es': 'Spanish',
              'fr': 'French',
              'de': 'German',
              'it': 'Italian',
              'pt': 'Portuguese',
              'ru': 'Russian',
              'zh': 'Chinese',
              'ja': 'Japanese',
              'ko': 'Korean',
              'ar': 'Arabic'
            });

            const langCode = langEntries.find(([code, name]) => name === langName)?.[0];
            if (langCode) {
              form.language = langCode;
            }
          }

          const additionalMatch = content.prompt.match(/Additional Instructions: ([^]*?)(?=\n\n|$)/);
          if (additionalMatch) {
            form.additionalInstructions = additionalMatch[1];
            showAdditionalInstructions.value = true;
          }
        } catch (parseErr) {
          console.warn('Error parsing prompt format:', parseErr);
          // Don't show error to user, just keep the content as is
        }

        // Detect placeholders
        if (generatedContent.value) {
          detectPlaceholders();
        }

        // Load template options
        if (form.contentType) {
          await loadTemplateOptions();
        }
      } else {
        router.push('/');
      }
    } catch (err) {
      error.value = 'Error loading content. Please try again.';
      console.error('Error loading content:', err);
    } finally {
      loading.value = false;
    }
  }
});

// Watch for content type changes to load templates
watch(() => form.contentType, async (newType) => {
  if (newType) {
    form.templateId = ''; // Reset template selection
    selectedTemplate.value = null;
    await loadTemplateOptions();
  }
});

// Generate content from form data
async function generateContent() {
  generatingContent.value = true;
  error.value = '';

  try {
    // Build the final prompt
    let finalPrompt = buildFullPrompt();

    // Add pre-generation placeholder values information
    if (Object.keys(preGenerationValues.value).some(key => preGenerationValues.value[key])) {
      finalPrompt += '\n\n--- Pre-filled Values ---\n';

      for (const [placeholder, value] of Object.entries(preGenerationValues.value)) {
        if (value) {
          finalPrompt += `\n[${placeholder}]: ${value}`;
        }
      }
    }

    const projectId = props.isEditing
        ? contentStore.currentContent?.project_id
        : route.params.projectId;

    const content = await contentStore.generateContent({
      prompt: finalPrompt,
      contentType: form.contentType,
      projectId,
      aiProvider: form.aiProvider,
      temperature: parseFloat(form.temperature),
      additionalInstructions: '' // Already included in the final prompt
    });

    // Apply pre-generation values to the generated content
    let processedContent = content;
    if (Object.keys(preGenerationValues.value).some(key => preGenerationValues.value[key])) {
      for (const [placeholder, value] of Object.entries(preGenerationValues.value)) {
        if (value) {
          const regex = new RegExp(`\\[${placeholder}\\]`, 'g');
          processedContent = processedContent.replace(regex, value);
        }
      }
    }

    generatedContent.value = processedContent;
    originalContent.value = processedContent; // Store original for placeholder handling

    // Initialize placeholder values with what we already have
    placeholderValues.value = { ...preGenerationValues.value };

    // Detect any remaining placeholders in the generated content
    detectPlaceholders();

    // Switch to preview mode if in edit mode
    editMode.value = false;
  } catch (err) {
    error.value = err.message || 'Error generating content. Please try again.';
    console.error('Error generating content:', err);
  } finally {
    generatingContent.value = false;
  }
}

// Save content to database
async function saveContent() {
  if (!generatedContent.value) return;

  saving.value = true;
  error.value = '';

  try {
    const projectId = route.params.projectId;

    const contentData = {
      project_id: projectId,
      title: form.title,
      content_type: form.contentType,
      prompt: buildFullPrompt(),
      generated_content: generatedContent.value
    };

    const { data: newContent, error: createError } = await supabase
        .from('content_pieces')
        .insert(contentData)
        .select()
        .single();

    if (createError) throw createError;

    // After saving, redirect to the content detail page
    router.push(`/content/${newContent.id}`);
  } catch (err) {
    error.value = err.message || 'Error saving content. Please try again.';
    console.error('Error saving content:', err);
  } finally {
    saving.value = false;
  }
}

// Update existing content
async function updateContent() {
  if (!generatedContent.value) return;

  saving.value = true;
  error.value = '';

  try {
    const contentId = route.params.id;

    const contentData = {
      title: form.title,
      content_type: form.contentType,
      prompt: buildFullPrompt(),
      generated_content: generatedContent.value
    };

    await contentStore.updateContent(contentId, contentData);

    // After updating, redirect to the content detail page
    router.push(`/content/${contentId}`);
  } catch (err) {
    error.value = err.message || 'Error updating content. Please try again.';
    console.error('Error updating content:', err);
  } finally {
    saving.value = false;
  }
}

// Copy generated content to clipboard
function copyToClipboard() {
  if (!generatedContent.value) return;

  navigator.clipboard.writeText(generatedContent.value)
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
</script>

<style scoped>
.content-form-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.content-form-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .content-form-layout {
    grid-template-columns: 1fr;
  }
}

.form-container {
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 1rem;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.radio-label, .checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.slider-container {
  padding: 0.5rem 0;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.collapsible-section {
  width: 100%;
}

.collapsible-toggle {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: #4f46e5;
  cursor: pointer;
}

.collapsible-content {
  margin-top: 0.75rem;
}

.generated-content-container {
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.generated-content-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-result-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.content-actions {
  display: flex;
  gap: 0.75rem;
}

.generated-content-preview {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  line-height: 1.6;
}

.spinner-inline {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}
</style>