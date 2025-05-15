<!-- src/views/ContentFormView.vue - Enhanced Version -->
<template>
  <div class="min-h-screen bg-background-darkest text-text-light p-4 md:p-8 font-sans scrollbar-thin">
    <div v-if="loading" class="flex flex-col justify-center items-center h-screen">
      <div class="spinner spinner-lg border-accent-violet"></div>
      <span class="mt-4 text-text-muted text-lg">Loading form...</span>
    </div>

    <template v-else>
      <button @click="$router.go(-1)" class="btn btn-glass mb-6 text-sm inline-flex items-center hover:bg-panel-highlight">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back
      </button>

      <h1 class="heading-1 font-display text-center mb-2 text-shadow-glow-violet">
        {{ props.isEditing ? 'Edit Content' : 'Create New Content' }}
      </h1>
      <p class="text-text-muted text-center mb-10 text-fluid-lg max-w-2xl mx-auto">
        Craft your perfect piece of content with fine-tuned controls and AI assistance.
      </p>

      <div class="max-w-6xl mx-auto grid lg:grid-cols-2 lg:gap-8 items-start">
        <form @submit.prevent="generateContent" class="glass-card p-6 md:p-8 space-y-6 shadow-xl lg:sticky lg:top-24 mb-8 lg:mb-0">
          <div class="pb-6 border-b border-panel-light">
            <h2 class="heading-3 text-accent-purple mb-4">1. Basic Information</h2>
            <div class="space-y-4">
              <div>
                <label for="title" class="block text-sm font-medium text-text-muted mb-1">Title</label>
                <input id="title" v-model="form.title" type="text" required placeholder="Give your content a name" class="form-input" />
              </div>

              <div>
                <label for="contentType" class="block text-sm font-medium text-text-muted mb-1">Content Type</label>
                <select id="contentType" v-model="form.contentType" required @change="loadTemplateOptions" class="form-input">
                  <option value="" disabled>Select content type</option>
                  <option value="email">Email</option>
                  <option value="social_post">Social Media Post</option>
                  <option value="ad_copy">Ad Copy</option>
                  <option value="blog_post">Blog Post</option>
                  <option value="product_description">Product Description</option>
                  <option value="website_copy">Website Copy</option>
                </select>
              </div>

              <div v-if="form.contentType && templateOptions.length > 0">
                <label for="templateId" class="block text-sm font-medium text-text-muted mb-1">Template (Optional)</label>
                <select id="templateId" v-model="form.templateId" @change="applyTemplate" class="form-input">
                  <option value="">No template - start from scratch</option>
                  <option v-for="template in templateOptions" :key="template.id" :value="template.id">
                    {{ template.name }}
                  </option>
                </select>
                <div class="text-xs text-text-muted mt-1 px-1" v-if="selectedTemplate">
                  {{ selectedTemplate.description }}
                </div>
              </div>

              <div>
                <label for="language" class="block text-sm font-medium text-text-muted mb-1">Language</label>
                <select id="language" v-model="form.language" class="form-input">
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
          </div>

          <div class="pb-6 border-b border-panel-light">
            <h2 class="heading-3 text-accent-purple mb-4">2. Content Details</h2>
            <div class="space-y-4">
              <div>
                <label for="prompt" class="block text-sm font-medium text-text-muted mb-1">Your Prompt</label>
                <textarea id="prompt" v-model="form.prompt" required placeholder="Describe what you want to create..." rows="5" class="form-input"></textarea>
                <div class="text-xs text-text-muted mt-1 px-1">
                  Be specific about your audience, tone, purpose, and key points.
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-muted mb-1">Tone</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label v-for="tone in toneOptions" :key="tone.value" class="flex items-center space-x-2 p-2 rounded-md hover:bg-panel-light cursor-pointer transition-colors">
                    <input type="checkbox" :value="tone.value" v-model="form.tones" class="form-checkbox rounded text-accent-violet focus:ring-accent-violet bg-panel-medium border-panel-highlight" />
                    <span class="text-sm text-text-light">{{ tone.label }}</span>
                  </label>
                </div>
              </div>

              <div v-if="purposeOptions.length > 0">
                <label class="block text-sm font-medium text-text-muted mb-1">Purpose</label>
                <div class="space-y-1">
                  <label v-for="purpose in purposeOptions" :key="purpose.value" class="flex items-center space-x-2 p-2 rounded-md hover:bg-panel-light cursor-pointer transition-colors">
                    <input type="radio" :value="purpose.value" v-model="form.purpose" name="purpose" class="form-radio text-accent-violet focus:ring-accent-violet bg-panel-medium border-panel-highlight" />
                    <span class="text-sm text-text-light">{{ purpose.label }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label for="contentLength" class="block text-sm font-medium text-text-muted mb-1">Content Length</label>
                <select id="contentLength" v-model="form.contentLength" class="form-input">
                  <option value="short">Short (under 150 words)</option>
                  <option value="medium">Medium (150-300 words)</option>
                  <option value="long">Long (300-600 words)</option>
                  <option value="comprehensive">Comprehensive (600+ words)</option>
                </select>
              </div>

              <div v-if="selectedTemplate && selectedTemplate.template_data && selectedTemplate.template_data.placeholders && selectedTemplate.template_data.placeholders.length > 0">
                <h3 class="text-sm font-medium text-text-muted mt-3 mb-1">Template Placeholders (Click to insert)</h3>
                <div class="flex flex-wrap gap-2">
                  <span v-for="placeholder in selectedTemplate.template_data.placeholders" :key="placeholder" @click="insertPlaceholder(placeholder)"
                        class="badge badge-secondary cursor-pointer hover:opacity-80 transition-opacity">
                    [{{ placeholder }}]
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="pb-6 border-b border-panel-light" v-if="selectedTemplate && selectedTemplate.template_data && selectedTemplate.template_data.placeholders && selectedTemplate.template_data.placeholders.length > 0">
            <h2 class="heading-3 text-accent-purple mb-4">3. Fill Template Values</h2>
            <p class="text-xs text-text-muted mb-3 px-1">
              Enter specific values to personalize your content before generation:
            </p>
            <div class="space-y-3">
              <div v-for="placeholder in selectedTemplate.template_data.placeholders" :key="placeholder">
                <label :for="'pre-' + placeholder" class="block text-xs font-medium text-text-muted mb-0.5 ml-1">[{{ placeholder }}]</label>
                <input :id="'pre-' + placeholder" v-model="preGenerationValues[placeholder]" type="text" :placeholder="'Enter value for ' + placeholder" class="form-input text-sm py-1.5" /> {/* Added text-sm py-1.5 for smaller input */}
              </div>
            </div>
            <div class="mt-4 p-3 bg-panel-medium rounded-md" v-if="Object.keys(preGenerationValues).some((key) => preGenerationValues[key])">
              <h3 class="text-sm font-semibold text-text-accent mb-2">Values to be used:</h3>
              <ul class="list-disc list-inside space-y-1 text-xs text-text-muted">
                <li v-for="(value, placeholder) in preGenerationValues" :key="placeholder" v-if="value">
                  <strong class="text-text-light">[{{ placeholder }}]:</strong> {{ value }}
                </li>
              </ul>
            </div>
          </div>

          <div class="pb-6 border-b border-panel-light">
            <h2 class="heading-3 text-accent-purple mb-4">4. AI Settings</h2> {/* Corrected step number */}
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-text-muted mb-1">AI Model</label>
                <div class="space-y-1">
                  <label class="flex items-center space-x-2 p-2 rounded-md hover:bg-panel-light cursor-pointer transition-colors">
                    <input type="radio" v-model="form.aiProvider" value="openai" name="aiProvider" class="form-radio text-accent-violet focus:ring-accent-violet bg-panel-medium border-panel-highlight" />
                    <span class="text-sm text-text-light">OpenAI (GPT-4o)</span>
                  </label>
                  <label class="flex items-center space-x-2 p-2 rounded-md hover:bg-panel-light cursor-pointer transition-colors">
                    <input type="radio" v-model="form.aiProvider" value="anthropic" name="aiProvider" class="form-radio text-accent-violet focus:ring-accent-violet bg-panel-medium border-panel-highlight" />
                    <span class="text-sm text-text-light">Anthropic (Claude 3 Opus)</span>
                  </label>
                  <label class="flex items-center space-x-2 p-2 rounded-md hover:bg-panel-light cursor-pointer transition-colors">
                    <input type="radio" v-model="form.aiProvider" value="deepseek" name="aiProvider" class="form-radio text-accent-violet focus:ring-accent-violet bg-panel-medium border-panel-highlight" />
                    <span class="text-sm text-text-light">DeepSeek</span>
                  </label>
                </div>
              </div>

              <div>
                <label for="temperature" class="block text-sm font-medium text-text-muted mb-1">Creativity Level: <span class="font-bold text-accent-cyan">{{ form.temperature }}</span></label>
                <input id="temperature" v-model.number="form.temperature" type="range" min="0" max="1" step="0.05" class="w-full h-2 bg-panel-light rounded-lg appearance-none cursor-pointer accent-accent-violet" />
                <div class="flex justify-between text-xs text-text-muted mt-1">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>
          </div>

          <div> {/* Removed bottom border for the last section */}
            <button type="button" @click="toggleAdditionalInstructions" class="flex justify-between items-center w-full py-2 text-sm font-medium text-text-muted hover:text-text-light transition-colors">
              <span>Additional Instructions (Optional)</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform duration-200" :class="{'rotate-180': showAdditionalInstructions}" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <div v-if="showAdditionalInstructions" class="mt-2 animate-fade-in">
              <textarea id="additionalInstructions" v-model="form.additionalInstructions" placeholder="Any specific requirements or constraints..." rows="3" class="form-input"></textarea>
              <div class="text-xs text-text-muted mt-1 px-1">
                Add any specific details that weren't covered by the options above.
              </div>
            </div>
          </div>


          <div v-if="error" class="alert alert-danger mt-4"> {/* Added margin top for separation */}
            {{ error }}
          </div>

          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6"> {/* Added top padding */}
            <button type="button" @click="$router.go(-1)" class="btn btn-glass w-full sm:w-auto hover:bg-panel-highlight">Cancel</button>
            <button type="submit" class="btn btn-primary btn-lg w-full sm:w-auto" :class="{'btn-loading': generatingContent, 'hover:btn-primary-hover active:btn-primary-active': !generatingContent}" :disabled="generatingContent">
              <span v-if="generatingContent" class="btn-loading-spin"></span>
              <span v-if="generatingContent">Generating...</span>
              <span v-else>{{ props.isEditing ? 'Regenerate Content' : 'Generate Content' }}</span>
            </button>
          </div>
        </form>

        <div class="card bg-background-deeper p-6 md:p-8 shadow-xl animate-fade-in space-y-6 h-full flex flex-col">
          <div v-if="generatingContent && !generatedContent" class="flex flex-col items-center justify-center text-center flex-grow">
            <div class="spinner spinner-lg border-accent-teal"></div>
            <p class="mt-3 text-text-muted">AI is thinking...</p>
          </div>
          <template v-else-if="generatedContent">
            <div class="flex justify-between items-center pb-4 border-b border-panel-light">
              <h2 class="heading-3 text-accent-cyan">Generated Content</h2>
              <div class="flex space-x-2">
                <button @click="copyToClipboard" class="btn btn-sm btn-glass hover:border-accent-cyan" :title="copied ? 'Copied!' : 'Copy to clipboard'">
                  <span v-if="copied">Copied!</span>
                  <span v-else>Copy</span>
                </button>
                <button @click="toggleEditMode" class="btn btn-sm btn-glass hover:border-accent-purple">
                  {{ editMode ? 'Preview' : 'Edit Text' }}
                </button>
              </div>
            </div>

            <div class="flex-grow min-h-[200px]">
              <textarea v-if="editMode" v-model="generatedContent" class="form-input w-full h-full min-h-[300px] resize-y bg-panel-medium !text-base" rows="20" spellcheck="true" :placeholder="editPlaceholder"></textarea>
              <div v-else class="prose prose-invert max-w-none text-text-light leading-relaxed text-base selection:bg-accent-violet selection:text-white p-1 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-thin" v-html="formattedContentWithHighlights"></div>
            </div>

            <div v-if="!editMode && detectedPlaceholders.length > 0" class="glass-card p-4 space-y-3 mt-auto border border-panel-light">
              <h3 class="text-sm font-semibold text-text-accent">Fill in Placeholders</h3>
              <p class="text-xs text-text-muted">Update these values to customize your content:</p>
              <div class="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-2">
                <div v-for="placeholder in detectedPlaceholders" :key="placeholder" class="flex items-center gap-2">
                  <label :for="'placeholder-' + placeholder" class="text-xs text-text-muted w-2/5 truncate" :title="placeholder">[{{ placeholder }}]</label>
                  <input :id="'placeholder-' + placeholder" v-model="placeholderValues[placeholder]" type="text" @input="updateContentWithPlaceholders" :placeholder="'Value for ' + placeholder" class="form-input text-sm py-1.5 flex-grow" />
                </div>
              </div>
              <div class="flex justify-end space-x-2 pt-2">
                <button @click="clearAllPlaceholders" class="btn btn-xs btn-glass hover:border-accent-violet">Clear All</button>
                <button @click="applyAllPlaceholders" class="btn btn-xs btn-secondary hover:btn-secondary-hover">Apply All</button>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t border-panel-light mt-auto">
              <button v-if="!props.isEditing" @click="saveContent" class="btn btn-primary" :class="{'btn-loading': saving, 'hover:btn-primary-hover active:btn-primary-active': !saving}" :disabled="saving">
                <span v-if="saving" class="btn-loading-spin"></span>
                Save New Content
              </button>
              <button v-else @click="updateContent" class="btn btn-primary" :class="{'btn-loading': saving, 'hover:btn-primary-hover active:btn-primary-active': !saving}" :disabled="saving">
                <span v-if="saving" class="btn-loading-spin"></span>
                Update Content
              </button>
            </div>
          </template>
          <div v-else class="flex flex-col items-center justify-center text-center glass-card p-10 h-full min-h-[400px] flex-grow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-accent-purple opacity-60 mb-4 animate-float" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 class="heading-3 text-text-muted">Content will appear here</h3>
            <p class="text-sm text-text-muted max-w-xs">Fill out the form and click "Generate Content" to see the AI in action.</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
// ... (Your existing script setup from the previous version remains the same)
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
// import { useProjectsStore } from '@/stores/projects'; // Not directly used in this provided template
import { supabase } from '@/services/supabase' // Assuming this is your Supabase client
import { marked } from 'marked'


const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()
// const projectsStore = useProjectsStore();

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
  additionalInstructions: '', // This field was missing in the template but is in the buildFullPrompt function
  aiProvider: 'openai', // Default, can be made configurable
  temperature: 0.7, // Default, can be made configurable
})

// UI state
const generatedContent = ref('')
const loading = ref(false) // For overall page/initial data loading
const generatingContent = ref(false) // For AI generation process
const saving = ref(false) // For saving/updating content
const error = ref('')
const copied = ref(false)
const showAdditionalInstructions = ref(false);
const templateOptions = ref([])
const selectedTemplate = ref(null)

// Options for form selectors
const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'empathetic', label: 'Empathetic' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'persuasive', label: 'Persuasive' },
]

const purposeOptions = computed(() => {
  switch (form.contentType) {
    case 'email':
      return [
        { value: 'welcome', label: 'Welcome/Onboarding' },
        { value: 'newsletter', label: 'Newsletter' },
        { value: 'promotional', label: 'Promotional' },
        { value: 'reengagement', label: 'Re-engagement' },
        { value: 'announcement', label: 'Announcement' },
      ]
    case 'social_post':
      return [
        { value: 'engagement', label: 'Engagement' },
        { value: 'awareness', label: 'Brand Awareness' },
        { value: 'promotion', label: 'Promotion' },
        { value: 'educational', label: 'Educational' },
        { value: 'testimonial', label: 'Testimonial' },
      ]
    case 'ad_copy':
      return [
        { value: 'conversion', label: 'Conversion' },
        { value: 'brand_awareness', label: 'Brand Awareness' },
        { value: 'retargeting', label: 'Retargeting' },
        { value: 'promotion', label: 'Promotion' },
      ]
    case 'blog_post':
      return [
        { value: 'educational', label: 'Educational' },
        { value: 'how_to', label: 'How-To Guide' },
        { value: 'listicle', label: 'List Article' },
        { value: 'case_study', label: 'Case Study' },
        { value: 'thought_leadership', label: 'Thought Leadership' },
      ]
    case 'product_description':
      return [
        { value: 'features', label: 'Feature-Focused' },
        { value: 'benefits', label: 'Benefit-Focused' },
        { value: 'problem_solution', label: 'Problem-Solution' },
        { value: 'comparison', label: 'Comparison' },
      ]
    case 'website_copy':
      return [
        { value: 'homepage', label: 'Homepage' },
        { value: 'about', label: 'About Us' },
        { value: 'services', label: 'Services/Products' },
        { value: 'landing', label: 'Landing Page' },
        { value: 'faq', label: 'FAQ' },
      ]
    default:
      return []
  }
})

const editMode = ref(false)
const placeholderValues = ref({})
const detectedPlaceholders = ref([])
const originalContent = ref('')
const editPlaceholder = 'Edit your content here. Use [placeholder_name] for dynamic content.'
const preGenerationValues = ref({})


marked.setOptions({
  pedantic: false,
  gfm: true,
  breaks: true,
  sanitize: false, // Consider security implications if content is user-input HTML
  smartLists: true,
  smartypants: false,
  xhtml: false
});

const formattedContentWithHighlights = computed(() => {
  if (!generatedContent.value) return ''
  let content = generatedContent.value
  // Apply filled placeholder values first
  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value && value.trim() !== '') { // Ensure value is not empty
      const regex = new RegExp(`\\[${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g')
      content = content.replace(regex, `<span class="filled-placeholder">${value}</span>`)
    }
  }
  // Highlight remaining (empty) placeholders
  content = content.replace(/\[([^\]]+)\]/g, (match, p1) => {
    // Only highlight if this placeholder wasn't filled (i.e., value is empty in placeholderValues)
    if (!placeholderValues.value[p1] || placeholderValues.value[p1].trim() === '') {
      return `<span class="highlight-placeholder" title="Click to focus input for [${p1}]" onclick="document.getElementById('placeholder-${p1}')?.focus()">[${p1}]</span>`;
    }
    return match; // Return the match as is if it was already replaced (should not happen if logic is correct)
  });
  return marked.parse(content)
})

function toggleEditMode() {
  if (!editMode.value) { // Switching to edit mode
    originalContent.value = generatedContent.value // Save current state before editing
  } else { // Switching to preview mode
    // If content was edited, originalContent might be different.
    // We might want to re-detect placeholders from the potentially edited generatedContent
    detectPlaceholders()
  }
  editMode.value = !editMode.value
}

function detectPlaceholders() {
  const placeholders = new Set(); // Use Set to avoid duplicates initially
  const regex = /\[([^\]]+)\]/g;
  let match;
  let contentToScan = generatedContent.value || '';
  while ((match = regex.exec(contentToScan)) !== null) {
    placeholders.add(match[1]);
  }
  detectedPlaceholders.value = Array.from(placeholders); // Convert Set to Array

  // Ensure placeholderValues has keys for all detected placeholders, initializing if new
  detectedPlaceholders.value.forEach((placeholder) => {
    if (!(placeholder in placeholderValues.value)) { // Check if key exists
      placeholderValues.value[placeholder] = '';
    }
  });
}


function updateContentWithPlaceholders() { // Called on @input from placeholder input fields
  if (editMode.value) return;

  let tempContent = originalContent.value || generatedContent.value;
  // It's crucial that originalContent holds the template with placeholders, not content with *some* placeholders filled.
  // So, originalContent should ideally be the raw output from AI, or the template before any user-side filling.

  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value && value.trim() !== '') { // Only replace if there's a value
      const regex = new RegExp(`\\[${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g');
      tempContent = tempContent.replace(regex, value);
    }
  }
  generatedContent.value = tempContent;
  // Do NOT re-detect placeholders here as it would remove filled ones from the detected list.
  // The preview (formattedContentWithHighlights) will handle displaying filled vs empty.
}


function applyAllPlaceholders() {
  let tempContent = originalContent.value || generatedContent.value;
  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value && value.trim() !== '') {
      const regex = new RegExp(`\\[${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g');
      tempContent = tempContent.replace(regex, value);
    }
  }
  generatedContent.value = tempContent;
  // Consider if originalContent should also be updated to this "fully applied" state.
  // If so, future edits to placeholder values will apply to this new baseline.
  // originalContent.value = tempContent;
  detectPlaceholders(); // Re-detect to update the list of *remaining* placeholders, if any.
}


function clearAllPlaceholders() {
  Object.keys(placeholderValues.value).forEach(key => {
    placeholderValues.value[key] = '';
  });
  // Reset generatedContent to the state before any client-side placeholder filling (original AI output)
  if (originalContent.value) {
    generatedContent.value = originalContent.value;
  }
  detectPlaceholders(); // Re-detect all placeholders from the original content.
}


async function loadTemplateOptions() {
  if (!form.contentType) {
    templateOptions.value = []
    selectedTemplate.value = null;
    form.templateId = '';
    return
  }
  try {
    const { data, error: fetchError } = await supabase
      .from('templates')
      .select('id, name, description, content_type, template_data')
      .eq('content_type', form.contentType)
      .eq('is_public', true); // Ensure you only fetch public templates or those accessible to the user

    if (fetchError) throw fetchError

    templateOptions.value = (data || []).map(template => {
      if (!template.template_data) {
        template.template_data = {
          title: '',
          structure: template.template || '',
          tone: ['professional'],
          purpose: '',
          contentLength: 'medium',
          placeholders: [],
          suggestedPrompt: `Write ${form.contentType} content.`,
        }
      }
      return template
    });
  } catch (err) {
    console.error('Error loading templates:', err)
    error.value = 'Failed to load templates.'
  }
}


function applyTemplate() {
  if (!form.templateId) {
    selectedTemplate.value = null
    preGenerationValues.value = {}
    return
  }

  const template = templateOptions.value.find((t) => t.id === form.templateId)
  if (template && template.template_data) {
    selectedTemplate.value = template
    const td = template.template_data

    form.title = td.title || form.title || '';
    form.tones = td.tone && Array.isArray(td.tone) ? [...td.tone] : form.tones;
    form.purpose = td.purpose || form.purpose;
    form.contentLength = td.contentLength || form.contentLength;

    let basePrompt = td.suggestedPrompt || '';
    if (td.structure) {
      basePrompt += `\n\n--- Suggested Structure ---\n${td.structure}`;
    }
    form.prompt = basePrompt;


    if (td.placeholders && Array.isArray(td.placeholders)) {
      const phObj = {}
      td.placeholders.forEach((ph) => { phObj[ph] = ''; });
      preGenerationValues.value = phObj
    } else {
      preGenerationValues.value = {}
    }
  } else {
    selectedTemplate.value = null;
    preGenerationValues.value = {};
  }
}

function toggleAdditionalInstructions() {
  showAdditionalInstructions.value = !showAdditionalInstructions.value;
}

function insertPlaceholder(placeholder) {
  const promptElement = document.getElementById('prompt')
  if (promptElement) {
    const cursorPos = promptElement.selectionStart
    const textBefore = form.prompt.substring(0, cursorPos)
    const textAfter = form.prompt.substring(cursorPos)
    form.prompt = `${textBefore}[${placeholder}]${textAfter}`
    setTimeout(() => {
      promptElement.focus()
      promptElement.setSelectionRange(cursorPos + placeholder.length + 2, cursorPos + placeholder.length + 2)
    }, 0)
  } else {
    form.prompt += ` [${placeholder}]`
  }
}

function buildFullPrompt() {
  let fullPrompt = form.prompt;

  const filledPreGenValues = Object.entries(preGenerationValues.value)
    .filter(([_, val]) => val && val.trim() !== '');

  if (filledPreGenValues.length > 0) {
    fullPrompt += '\n\n--- Pre-filled Values for Template Placeholders ---';
    for (const [placeholder, value] of filledPreGenValues) {
      fullPrompt += `\n[${placeholder}]: ${value}`;
    }
  }

  if (form.tones.length > 0) fullPrompt += `\n\nTone: ${form.tones.join(', ')}`;
  if (form.purpose) {
    const pLabel = purposeOptions.value.find(p => p.value === form.purpose)?.label || form.purpose;
    fullPrompt += `\nPurpose: ${pLabel}`;
  }
  fullPrompt += `\nLength: ${form.contentLength}`;
  const langNames = { en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese', ru: 'Russian', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ar: 'Arabic' };
  fullPrompt += `\nLanguage: ${langNames[form.language] || form.language}`;
  if (form.additionalInstructions && form.additionalInstructions.trim() !== '') {
    fullPrompt += `\n\nAdditional Instructions: ${form.additionalInstructions}`;
  }

  return fullPrompt;
}


onMounted(async () => {
  loading.value = true;
  try {
    const { data: existingTemplates } = await supabase
      .from('templates')
      .select('id')
      .eq('name', 'Email Promotionnel (Français)')
      .eq('content_type', 'email');

    if (!existingTemplates || existingTemplates.length === 0) {
      await supabase.from('templates').insert({
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
  }

  if (props.isEditing) {
    const contentId = route.params.id;
    try {
      // fetchContentPiece should ideally populate contentStore.currentContent
      await contentStore.fetchContentPiece(contentId);
      const current = contentStore.currentContent; // Use the store's currentContent

      if (current) {
        form.title = current.title || '';
        form.contentType = current.content_type || '';
        // Prefer a specific field for the base prompt if available, e.g., `prompt_template`
        form.prompt = current.prompt_template || current.prompt || '';

        form.tones = current.tones && Array.isArray(current.tones) ? current.tones : [];
        form.purpose = current.purpose || '';
        form.contentLength = current.content_length || 'medium';
        form.language = current.language || 'en';
        form.additionalInstructions = current.additional_instructions || '';
        form.aiProvider = current.ai_provider || 'openai';
        form.temperature = typeof current.temperature === 'number' ? current.temperature : 0.7;
        form.templateId = current.template_id || '';


        generatedContent.value = current.generated_content || '';
        originalContent.value = current.generated_content || '';
        if (generatedContent.value) detectPlaceholders();

        if (form.contentType) await loadTemplateOptions();
        // After loading templates, if form.templateId has a value, apply it
        if(form.templateId) {
          // Ensure templateOptions are loaded before trying to find the template
          const appliedTemplate = templateOptions.value.find(t => t.id === form.templateId);
          if (appliedTemplate) {
            selectedTemplate.value = appliedTemplate;
            // Pre-fill preGenerationValues from saved placeholder data if available
            // This assumes you save `preGenerationValues` or similar with the content piece
            // For example: preGenerationValues.value = current.saved_placeholder_inputs || {};
          }
        }
      } else {
        error.value = 'Content not found.';
      }
    } catch (err) {
      error.value = 'Error loading content for editing.';
      console.error('Edit load error:', err);
    }
  } else {
    if (!route.params.projectId) {
      error.value = "Project ID is missing. Cannot create new content.";
      console.error("Project ID missing for new content.");
    }
  }
  loading.value = false;
});


watch(() => form.contentType, (newType, oldType) => {
  if (newType !== oldType) { // Check if it actually changed
    form.templateId = '';
    selectedTemplate.value = null;
    preGenerationValues.value = {}; // Reset pre-gen values when content type changes
    loadTemplateOptions(); // Load new templates
  }
});

async function generateContent() {
  if (!form.title.trim() || !form.contentType || !form.prompt.trim()) {
    error.value = "Title, Content Type, and Prompt are required.";
    return;
  }
  generatingContent.value = true;
  error.value = '';
  try {
    const fullPrompt = buildFullPrompt();
    const projectId = props.isEditing ? contentStore.currentContent?.project_id : route.params.projectId;

    if (!projectId && !props.isEditing) { // Ensure projectId for new content
      error.value = "Project association is missing for new content.";
      generatingContent.value = false;
      return;
    }

    const generatedText = await contentStore.generateContent({
      prompt: fullPrompt,
      contentType: form.contentType,
      // Only pass projectId if it's for creating a NEW content piece associated with a project.
      // If isEditing is true, the updateContent function will handle updating the existing piece.
      // The generateContent store action might be designed to either create new or just return text.
      // For clarity, let's assume generateContent in the store is primarily for *getting text from AI*.
      // The decision to save new or update existing is handled by saveContent/updateContent here.
      projectId: props.isEditing ? null : projectId,
      aiProvider: form.aiProvider,
      temperature: parseFloat(form.temperature),
      // additionalInstructions is part of fullPrompt, but can be passed if API expects it separately
      // title: form.title, // Title isn't usually part of the AI generation prompt itself
    });

    let processedContent = generatedText;
    if (Object.keys(preGenerationValues.value).some((key) => preGenerationValues.value[key])) {
      for (const [placeholder, value] of Object.entries(preGenerationValues.value)) {
        if (value && value.trim() !== '') {
          const regex = new RegExp(`\\[${placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'g');
          processedContent = processedContent.replace(regex, value);
        }
      }
    }

    generatedContent.value = processedContent;
    originalContent.value = processedContent; // This is the raw AI output (potentially with pre-gen values applied)

    // Initialize placeholderValues with preGenerationValues, then detect any remaining placeholders
    placeholderValues.value = { ...preGenerationValues.value };
    detectPlaceholders();
    editMode.value = false;

  } catch (err) {
    error.value = err.message || 'Error generating content.';
    console.error('Generate error:', err);
  } finally {
    generatingContent.value = false;
  }
}


async function saveContent() {
  if (!generatedContent.value || !form.title.trim()) {
    error.value = "Generated content and title are required to save.";
    return;
  }
  saving.value = true;
  error.value = '';
  try {
    const projectId = route.params.projectId;
    if (!projectId) {
      error.value = "Project ID is missing. Cannot save content.";
      saving.value = false;
      return;
    }

    const contentData = {
      project_id: projectId,
      title: form.title,
      content_type: form.contentType,
      prompt: form.prompt, // Base prompt before full build for easier re-use later
      prompt_full: buildFullPrompt(), // The actual prompt sent to AI
      generated_content: generatedContent.value,
      tones: form.tones,
      purpose: form.purpose,
      language: form.language,
      content_length: form.contentLength,
      template_id: form.templateId || null,
      ai_provider: form.aiProvider,
      temperature: form.temperature,
      additional_instructions: form.additionalInstructions,
      // placeholder_inputs: placeholderValues.value, // If you want to save filled placeholders
    };

    // Use a dedicated store action that inserts and then fetches the new piece with versions
    const newContentPiece = await contentStore.createContentPieceWithVersion(contentData);

    if (newContentPiece && newContentPiece.id) {
      router.push(`/content/${newContentPiece.id}`);
    } else {
      throw new Error("Failed to save content piece or retrieve its ID.");
    }

  } catch (err) {
    error.value = err.message || 'Error saving content.';
    console.error('Save error:', err);
  } finally {
    saving.value = false;
  }
}

async function updateContent() {
  if (!generatedContent.value || !form.title.trim()) {
    error.value = "Generated content and title are required to update.";
    return;
  }
  saving.value = true;
  error.value = '';
  try {
    const contentId = route.params.id;
    const updateData = {
      title: form.title,
      content_type: form.contentType,
      prompt: form.prompt,
      prompt_full: buildFullPrompt(),
      generated_content: generatedContent.value,
      tones: form.tones,
      purpose: form.purpose,
      language: form.language,
      content_length: form.contentLength,
      template_id: form.templateId || null,
      ai_provider: form.aiProvider,
      temperature: form.temperature,
      additional_instructions: form.additionalInstructions,
      // placeholder_inputs: placeholderValues.value,
    };
    await contentStore.updateContent(contentId, updateData);
    router.push(`/content/${contentId}`);
  } catch (err) {
    error.value = err.message || 'Error updating content.';
    console.error('Update error:', err);
  } finally {
    saving.value = false;
  }
}


function copyToClipboard() {
  if (!generatedContent.value) return;
  let textToCopy = generatedContent.value;
  // If in preview mode and placeholders are filled, copy the version with placeholders filled
  if (!editMode.value) {
    textToCopy = generatedContent.value; // generatedContent already has values applied from updateContentWithPlaceholders/applyAllPlaceholders
    // To get pure text without HTML from markdown preview:
    // Create a temporary div to parse HTML, then get textContent
    // const tempDiv = document.createElement('div');
    // tempDiv.innerHTML = marked.parse(textToCopy); // Assuming formattedContentWithHighlights uses marked.parse on generatedContent
    // textToCopy = tempDiv.textContent || tempDiv.innerText || "";
  }

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      copied.value = true;
      setTimeout(() => copied.value = false, 2000);
    })
    .catch(err => console.error('Clipboard copy error:', err));
}

</script>

<style>
/* For prose styling of markdown */
.prose-invert a {
  color: #00E5FF; /* theme.colors.accent.cyan */
}
.prose-invert a:hover {
  color: #1DE9B6; /* theme.colors.accent.teal */
}
.prose-invert code {
  background-color: rgba(255, 255, 255, 0.1); /* theme.colors.panel.medium */
  color: #B388FF; /* theme.colors.text.accent */
  padding: 0.2em 0.4em;
  border-radius: 0.125rem; /* Tailwind's rounded-sm */
}
.prose-invert pre {
  background-color: rgba(255, 255, 255, 0.03); /* theme.colors.panel.glass */
  color: #EAEAEA; /* theme.colors.text.light */
  border-radius: 0.375rem; /* Tailwind's rounded-md */
  padding: 1em;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.05); /* theme.colors.panel.light */
}
.prose-invert ul > li::before {
  background-color: #9E9E9E; /* theme.colors.text.muted */
}
.prose-invert blockquote {
  border-left-color: #B388FF; /* theme.colors.accent.purple */
  color: #9E9E9E; /* theme.colors.text.muted */
}

/* Custom form checkbox and radio styles if @tailwindcss/forms is not used */

.form-checkbox, .form-radio {
  /* Ensure shrink-0 is applied if they might be in a flex container and shouldn't shrink */
  border-color: rgba(255, 255, 255, 0.15); /* panel-highlight */
}

.form-checkbox:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  background-color: #7F00FF; /* accent.violet */
  border-color: #7F00FF; /* accent.violet */
}
.form-radio:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
  background-color: #7F00FF; /* accent.violet */
  border-color: #7F00FF; /* accent.violet */
}
/*
.highlight-placeholder {
  @apply bg-accent-violet bg-opacity-30 text-text-light px-1 py-0.5 rounded-sm cursor-pointer hover:bg-opacity-50;
}
.filled-placeholder {
  @apply text-accent-gold font-semibold;
}
*/
</style>