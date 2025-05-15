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
          <!-- Step Indicator -->
          <div class="mb-6 flex justify-between items-center">
            <div
              v-for="(step, index) in formSteps"
              :key="step.id"
              class="flex flex-col items-center space-y-2 relative"
              :class="index < formSteps.length - 1 ? 'flex-1' : ''"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center z-10"
                :class="currentStep >= index ? 'bg-accent-violet text-white' : 'bg-panel-medium text-text-muted'"
              >
                {{ index + 1 }}
              </div>
              <span class="text-xs" :class="currentStep >= index ? 'text-text-light' : 'text-text-muted'">
                {{ step.title }}
              </span>
              <!-- Connecting line -->
              <div
                v-if="index < formSteps.length - 1"
                class="absolute top-4 left-1/2 w-full h-px transform -translate-y-1/2"
                :class="currentStep > index ? 'bg-accent-violet' : 'bg-panel-medium'"
              ></div>
            </div>
          </div>

          <!-- Step 1: Basic Information -->
          <div v-show="currentStep === 0" class="space-y-4 animate-fade-in">
            <h2 class="heading-3 text-accent-purple mb-4">Basic Information</h2>
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
                <option
                  v-for="template in templateOptions"
                  :key="template.id"
                  :value="template.id"
                >
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

          <!-- Step 2: Content Details -->
          <div v-show="currentStep === 1" class="space-y-4 animate-fade-in">
            <h2 class="heading-3 text-accent-purple mb-4">Content Details</h2>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label for="prompt" class="block text-sm font-medium text-text-muted">Your Prompt</label>
                <span class="text-xs text-text-muted">{{ form.prompt.length }} / 1500 characters</span>
              </div>
              <Editor
                :api-key="apiKey"
                id="prompt"
                v-model="form.prompt"
                required
                placeholder="Describe what you want to create..."
                rows="5"
                class="form-input"
                maxlength="1500"
              />
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

            <!-- Template placeholders section with proper null checks -->
            <div v-if="hasTemplatePlaceholders">
              <h3 class="text-sm font-medium text-text-muted mt-3 mb-1">Template Placeholders (Click to insert)</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="placeholder in getTemplatePlaceholders()"
                  :key="placeholder"
                  @click="insertPlaceholder(placeholder)"
                  class="badge badge-secondary cursor-pointer hover:opacity-80 transition-opacity"
                >
                  [{{ placeholder }}]
                </span>
              </div>
            </div>
          </div>

          <!-- Step 3: Template Values - With proper null checks -->
          <div v-show="currentStep === 2 && hasTemplatePlaceholders" class="space-y-3 animate-fade-in">
            <h2 class="heading-3 text-accent-purple mb-4">Template Values</h2>
            <p class="text-xs text-text-muted mb-3 px-1">
              Enter specific values to personalize your content before generation:
            </p>
            <div class="space-y-3">
              <div v-for="placeholder in getTemplatePlaceholders()" :key="placeholder">
                <label :for="'pre-' + placeholder" class="block text-xs font-medium text-text-muted mb-0.5 ml-1">[{{ placeholder }}]</label>
                <input :id="'pre-' + placeholder" v-model="preGenerationValues[placeholder]" type="text" :placeholder="'Enter value for ' + placeholder" class="form-input text-sm py-1.5" />
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

          <!-- Step 4: AI Settings -->
          <div v-show="currentStep === 3" class="space-y-4 animate-fade-in">
            <h2 class="heading-3 text-accent-purple mb-4">AI Settings</h2>

            <div>
              <label class="block text-sm font-medium text-text-muted mb-2">AI Model</label>
              <div class="grid grid-cols-1 gap-3">
                <div
                  v-for="provider in aiProviders"
                  :key="provider.value"
                  class="card bg-panel-card p-4 rounded-lg cursor-pointer transition-all duration-200"
                  :class="{'ring-2 ring-accent-violet': form.aiProvider === provider.value}"
                  @click="form.aiProvider = provider.value"
                >
                  <div class="flex items-center mb-2">
                    <input
                      type="radio"
                      :id="provider.value"
                      :value="provider.value"
                      v-model="form.aiProvider"
                      class="form-radio text-accent-violet focus:ring-accent-violet bg-panel-medium border-panel-highlight mr-3"
                    />
                    <label :for="provider.value" class="font-medium text-text-light">{{ provider.label }}</label>
                  </div>
                  <p class="text-xs text-text-muted ml-6">{{ provider.description }}</p>
                </div>
              </div>
            </div>

            <div>
              <label for="temperature" class="block text-sm font-medium text-text-muted mb-1">Creativity Level: <span class="font-bold text-accent-cyan">{{ form.temperature }}</span></label>
              <input id="temperature" v-model.number="form.temperature" type="range" min="0" max="1" step="0.05" class="w-full h-2 bg-panel-light rounded-lg appearance-none cursor-pointer accent-accent-violet" />
              <div class="flex justify-between text-xs text-text-muted mt-1">
                <span>Conservative</span>
                <span>Creative</span>
              </div>

              <div class="mt-3 p-3 bg-panel-medium rounded-md">
                <div class="flex items-start">
                  <div class="mr-3 text-accent-violet">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="text-xs text-text-muted">
                    <p class="mb-1"><span class="font-medium text-accent-violet">Low values (0.1-0.3):</span> Produces more predictable, accurate responses.</p>
                    <p class="mb-1"><span class="font-medium text-accent-violet">Medium values (0.4-0.7):</span> Good balance of creativity and coherence.</p>
                    <p><span class="font-medium text-accent-violet">High values (0.8-1.0):</span> More unique, diverse but potentially less focused responses.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-2">
              <button
                type="button"
                @click="toggleAdditionalInstructions"
                class="flex justify-between items-center w-full py-2 text-sm font-medium text-text-muted hover:text-text-light transition-colors"
              >
                <span>Additional Instructions (Optional)</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform transition-transform duration-200"
                  :class="{'rotate-180': showAdditionalInstructions}"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div v-if="showAdditionalInstructions" class="mt-2 animate-fade-in">
                <Editor
                  :api-key="apiKey"
                  id="additionalInstructions"
                  v-model="form.additionalInstructions"
                  placeholder="Any specific requirements or constraints..."
                  rows="3"
                  class="form-input"
                />
                <div class="text-xs text-text-muted mt-1 px-1">
                  Add any specific details that weren't covered by the options above.
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div v-if="error" class="alert alert-danger my-4">
            {{ error }}
          </div>

          <div class="flex justify-between pt-4 border-t border-panel-light">
            <button
              v-if="currentStep > 0"
              type="button"
              @click="prevStep"
              class="btn btn-glass hover:bg-panel-highlight"
            >
              Previous
            </button>
            <div v-else class="invisible">Placeholder</div>

            <div>
              <button
                v-if="currentStep < formSteps.length - 1"
                type="button"
                @click="nextStep"
                class="btn btn-primary"
                :disabled="!canProceedToNextStep"
              >
                Next
              </button>
              <button
                v-else
                type="submit"
                class="btn btn-primary btn-lg"
                :class="{'btn-loading': generatingContent, 'hover:btn-primary-hover active:btn-primary-active': !generatingContent}"
                :disabled="generatingContent"
              >
                <span v-if="generatingContent" class="btn-loading-spin"></span>
                <span v-if="generatingContent">Generating...</span>
                <span v-else>{{ props.isEditing ? 'Regenerate Content' : 'Generate Content' }}</span>
              </button>
            </div>
          </div>
        </form>

        <div class="card bg-background-deeper p-6 md:p-8 shadow-xl animate-fade-in space-y-6 h-full flex flex-col">
          <div v-if="generatingContent && !generatedContent" class="flex flex-col items-center justify-center text-center flex-grow">
            <div class="spinner spinner-lg border-accent-teal"></div>
            <p class="mt-3 text-text-muted">AI is thinking...</p>

            <div class="max-w-md mx-auto mt-8 p-4 bg-panel-medium rounded-lg">
              <p class="text-xs text-text-muted mb-3">While you wait, here's what the AI is considering:</p>
              <ul class="text-xs text-text-muted list-disc list-inside space-y-1">
                <li>Content type: <span class="text-text-light">{{ form.contentType?.replace('_', ' ') || 'Not specified' }}</span></li>
                <li>Tone: <span class="text-text-light">{{ form.tones.length ? form.tones.join(', ') : 'Not specified' }}</span></li>
                <li>Purpose: <span class="text-text-light">{{ getPurposeLabel() }}</span></li>
                <li>Language: <span class="text-text-light">{{ getLanguageName() }}</span></li>
                <li>Length: <span class="text-text-light">{{ form.contentLength }}</span></li>
                <li>AI model: <span class="text-text-light">{{ getProviderName() }}</span></li>
              </ul>
            </div>
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
              <Editor
                :api-key="apiKey"
                v-if="editMode"
                v-model="generatedContent"
                class="form-input w-full h-full min-h-[300px] resize-y bg-panel-medium !text-base"
                rows="20"
                spellcheck="true"
                :placeholder="editPlaceholder"
              />
              <div
                v-else
                class="prose prose-invert max-w-none text-text-light leading-relaxed text-base selection:bg-accent-violet selection:text-white p-1 overflow-y-auto max-h-[calc(100vh-300px)] scrollbar-thin"
                v-html="formattedContentWithHighlights"
              ></div>
            </div>

            <div v-if="!editMode && detectedPlaceholders.length > 0" class="glass-card p-4 space-y-3 mt-auto border border-panel-light">
              <h3 class="text-sm font-semibold text-text-accent">Fill in Placeholders</h3>
              <p class="text-xs text-text-muted">Update these values to customize your content:</p>
              <div class="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-2">
                <div v-for="placeholder in detectedPlaceholders" :key="placeholder" class="flex items-center gap-2">
                  <label :for="'placeholder-' + placeholder" class="text-xs text-text-muted w-2/5 truncate" :title="placeholder">[{{ placeholder }}]</label>
                  <input
                    :id="'placeholder-' + placeholder"
                    v-model="placeholderValues[placeholder]"
                    type="text"
                    @input="updateContentWithPlaceholders"
                    :placeholder="'Value for ' + placeholder"
                    class="form-input text-sm py-1.5 flex-grow"
                  />
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { supabase } from '@/services/supabase'
import { marked } from 'marked'
import Editor from '@tinymce/tinymce-vue'

const apiKey = import.meta.env.VITE_TINYMCE_API_KEY // All Vite secret

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()

// Multi-step form
const formSteps = [
  { id: 'basics', title: 'Basics' },
  { id: 'details', title: 'Details' },
  { id: 'template', title: 'Template' },
  { id: 'ai', title: 'AI Settings' },
]
const currentStep = ref(0)

// Computed property to check if the selected template has valid placeholders
const hasTemplatePlaceholders = computed(() => {
  return selectedTemplate.value &&
    selectedTemplate.value.template_data &&
    Array.isArray(selectedTemplate.value.template_data.placeholders) &&
    selectedTemplate.value.template_data.placeholders.length > 0
})

// Function to safely get template placeholders
function getTemplatePlaceholders() {
  if (!hasTemplatePlaceholders.value) {
    return []
  }
  return selectedTemplate.value.template_data.placeholders
}

const nextStep = () => {
  if (currentStep.value < formSteps.length - 1) {
    currentStep.value++
    // Skip template step if no template selected or template has no placeholders
    if (currentStep.value === 2 && !hasTemplatePlaceholders.value) {
      currentStep.value++
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    // Skip template step if no template selected or template has no placeholders
    if (currentStep.value === 2 && !hasTemplatePlaceholders.value) {
      currentStep.value--
    }
  }
}

const canProceedToNextStep = computed(() => {
  // Validation for each step
  if (currentStep.value === 0) {
    return !!form.title && !!form.contentType
  }
  if (currentStep.value === 1) {
    return !!form.prompt
  }
  return true
})

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
  temperature: 0.7,
})

// UI state
const generatedContent = ref('')
const loading = ref(false)
const generatingContent = ref(false)
const saving = ref(false)
const error = ref('')
const copied = ref(false)
const showAdditionalInstructions = ref(false)
const templateOptions = ref([])
const selectedTemplate = ref(null)

// AI Provider options with enhanced descriptions
const aiProviders = [
  {
    value: 'openai',
    label: 'OpenAI (GPT-4o)',
    description: 'Excels at following instructions precisely. Good balance of creativity and coherence.'
  },
  {
    value: 'anthropic',
    label: 'Anthropic (Claude 3 Opus)',
    description: 'Specializes in long-form content with nuanced understanding. Excellent for detailed, thoughtful writing.'
  },
  {
    value: 'deepseek',
    label: 'DeepSeek',
    description: 'Strong in technical content and complex reasoning. Good for specialized or domain-specific text.'
  },
]

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
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})

const formattedContentWithHighlights = computed(() => {
  if (!generatedContent.value) return ''
  let content = generatedContent.value

  // Apply filled placeholder values first
  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value && value.trim() !== '') {
      // Properly escape regex special characters
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\[${escapedPlaceholder}\\]`, 'g')
      content = content.replace(regex, `<span class="filled-placeholder">${value}</span>`)
    }
  }

  // Highlight remaining (empty) placeholders
  content = content.replace(/\[([^\]]+)\]/g, (match, p1) => {
    // Only highlight if this placeholder wasn't filled
    if (!placeholderValues.value[p1] || placeholderValues.value[p1].trim() === '') {
      return `<span class="highlight-placeholder" title="Click to focus input for [${p1}]" onclick="document.getElementById('placeholder-${p1}')?.focus()">[${p1}]</span>`
    }
    return match
  })

  return marked.parse(content)
})

// Helper methods for display
function getProviderName() {
  const provider = aiProviders.find(p => p.value === form.aiProvider)
  return provider ? provider.label : form.aiProvider
}

function getPurposeLabel() {
  if (!form.purpose) return 'Not specified'
  const purpose = purposeOptions.value.find(p => p.value === form.purpose)
  return purpose ? purpose.label : form.purpose
}

function getLanguageName() {
  const languages = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic'
  }
  return languages[form.language] || form.language
}

function toggleEditMode() {
  if (!editMode.value) {
    // Switching to edit mode
    originalContent.value = generatedContent.value
  } else {
    // Switching to preview mode
    // Re-detect placeholders from the potentially edited generatedContent
    detectPlaceholders()
  }
  editMode.value = !editMode.value
}

function detectPlaceholders() {
  const placeholders = new Set()
  const regex = /\[([^\]]+)\]/g
  let match
  let contentToScan = generatedContent.value || ''

  while ((match = regex.exec(contentToScan)) !== null) {
    placeholders.add(match[1])
  }

  detectedPlaceholders.value = Array.from(placeholders)

  // Ensure placeholderValues has keys for all detected placeholders
  detectedPlaceholders.value.forEach((placeholder) => {
    if (!(placeholder in placeholderValues.value)) {
      placeholderValues.value[placeholder] = ''
    }
  })

  // Remove keys that are no longer in detected placeholders
  Object.keys(placeholderValues.value).forEach(key => {
    if (!detectedPlaceholders.value.includes(key)) {
      delete placeholderValues.value[key]
    }
  })
}

function updateContentWithPlaceholders() {
  if (editMode.value) return

  let tempContent = originalContent.value || generatedContent.value

  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value && value.trim() !== '') {
      // Properly escape regex special characters
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\[${escapedPlaceholder}\\]`, 'g')
      tempContent = tempContent.replace(regex, value)
    }
  }

  generatedContent.value = tempContent
}

function applyAllPlaceholders() {
  let tempContent = originalContent.value || generatedContent.value

  for (const [placeholder, value] of Object.entries(placeholderValues.value)) {
    if (value && value.trim() !== '') {
      // Properly escape regex special characters
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\[${escapedPlaceholder}\\]`, 'g')
      tempContent = tempContent.replace(regex, value)
    }
  }

  generatedContent.value = tempContent
  detectPlaceholders()
}

function clearAllPlaceholders() {
  Object.keys(placeholderValues.value).forEach(key => {
    placeholderValues.value[key] = ''
  })

  // Reset generatedContent to the original AI output
  if (originalContent.value) {
    generatedContent.value = originalContent.value
  }

  detectPlaceholders()
}

async function loadTemplateOptions() {
  if (!form.contentType) {
    templateOptions.value = []
    selectedTemplate.value = null
    form.templateId = ''
    return
  }

  try {
    const { data, error: fetchError } = await supabase
      .from('templates')
      .select('id, name, description, content_type, template_data')
      .eq('content_type', form.contentType)
      .eq('is_public', true)

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
    })
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

    // Apply template defaults to form
    form.title = td.title || form.title || ''
    if (td.tone && Array.isArray(td.tone)) {
      form.tones = [...td.tone]
    }
    form.purpose = td.purpose || form.purpose
    form.contentLength = td.contentLength || form.contentLength

    // Build base prompt with template structure
    let basePrompt = td.suggestedPrompt || ''
    if (td.structure) {
      basePrompt += `\n\n--- Suggested Structure ---\n${td.structure}`
    }
    form.prompt = basePrompt

    // Initialize placeholder values
    if (td.placeholders && Array.isArray(td.placeholders)) {
      const phObj = {}
      td.placeholders.forEach((ph) => { phObj[ph] = '' })
      preGenerationValues.value = phObj
    } else {
      preGenerationValues.value = {}
    }

    // If we're on step 1, auto-advance to step 2 since we've filled in the basic info
    if (currentStep.value === 0 && form.title && form.contentType) {
      nextStep()
    }
  } else {
    selectedTemplate.value = null
    preGenerationValues.value = {}
  }
}

function toggleAdditionalInstructions() {
  showAdditionalInstructions.value = !showAdditionalInstructions.value
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
  let fullPrompt = form.prompt

  // Add pre-filled template values if any
  const filledPreGenValues = Object.entries(preGenerationValues.value)
    .filter(([_, val]) => val && val.trim() !== '')

  if (filledPreGenValues.length > 0) {
    fullPrompt += '\n\n--- Pre-filled Values for Template Placeholders ---'
    for (const [placeholder, value] of filledPreGenValues) {
      fullPrompt += `\n[${placeholder}]: ${value}`
    }
  }

  // Add tone, purpose, length, language
  if (form.tones.length > 0) fullPrompt += `\n\nTone: ${form.tones.join(', ')}`
  if (form.purpose) {
    const pLabel = purposeOptions.value.find(p => p.value === form.purpose)?.label || form.purpose
    fullPrompt += `\nPurpose: ${pLabel}`
  }
  fullPrompt += `\nLength: ${form.contentLength}`

  const langNames = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    it: 'Italian', pt: 'Portuguese', ru: 'Russian', zh: 'Chinese',
    ja: 'Japanese', ko: 'Korean', ar: 'Arabic'
  }
  fullPrompt += `\nLanguage: ${langNames[form.language] || form.language}`

  // Add additional instructions if any
  if (form.additionalInstructions && form.additionalInstructions.trim() !== '') {
    fullPrompt += `\n\nAdditional Instructions: ${form.additionalInstructions}`
  }

  return fullPrompt
}

async function generateContent() {
  if (!form.title.trim() || !form.contentType || !form.prompt.trim()) {
    error.value = "Title, Content Type, and Prompt are required."
    return
  }

  generatingContent.value = true
  error.value = ''

  try {
    const fullPrompt = buildFullPrompt()
    const projectId = props.isEditing ? contentStore.currentContent?.project_id : route.params.projectId

    if (!projectId && !props.isEditing) {
      error.value = "Project association is missing for new content."
      generatingContent.value = false
      return
    }

    const generatedText = await contentStore.generateContent({
      prompt: fullPrompt,
      contentType: form.contentType,
      projectId: props.isEditing ? null : projectId,
      aiProvider: form.aiProvider,
      temperature: parseFloat(form.temperature),
    })

    // Process and apply pre-generation placeholder values
    let processedContent = generatedText
    if (Object.keys(preGenerationValues.value).some((key) => preGenerationValues.value[key])) {
      for (const [placeholder, value] of Object.entries(preGenerationValues.value)) {
        if (value && value.trim() !== '') {
          // Properly escape regex special characters
          const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(`\\[${escapedPlaceholder}\\]`, 'g')
          processedContent = processedContent.replace(regex, value)
        }
      }
    }

    generatedContent.value = processedContent
    originalContent.value = processedContent

    // Initialize placeholderValues with preGenerationValues
    placeholderValues.value = { ...preGenerationValues.value }
    detectPlaceholders()
    editMode.value = false

    // Scroll to the generated content area if on mobile
    setTimeout(() => {
      if (window.innerWidth < 1024) { // lg breakpoint in Tailwind
        const contentArea = document.querySelector('.card.bg-background-deeper')
        if (contentArea) {
          contentArea.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, 200)

  } catch (err) {
    error.value = err.message || 'Error generating content.'
    console.error('Generate error:', err)
  } finally {
    generatingContent.value = false
  }
}

async function saveContent() {
  if (!generatedContent.value || !form.title.trim()) {
    error.value = "Generated content and title are required to save."
    return
  }

  saving.value = true
  error.value = ''

  try {
    const projectId = route.params.projectId
    if (!projectId) {
      error.value = "Project ID is missing. Cannot save content."
      saving.value = false
      return
    }

    const contentData = {
      project_id: projectId,
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
      placeholder_inputs: placeholderValues.value
    }

    // Create content piece with initial version
    const { data, error: createError } = await supabase
      .from('content_pieces')
      .insert(contentData)
      .select()
      .single()

    if (createError) throw createError

    // Create initial version
    if (data) {
      await supabase
        .from('content_versions')
        .insert({
          content_id: data.id,
          version_number: 1,
          content: generatedContent.value,
        })
    }

    router.push(`/content/${data.id}`)
  } catch (err) {
    error.value = err.message || 'Error saving content.'
    console.error('Save error:', err)
  } finally {
    saving.value = false
  }
}

async function updateContent() {
  if (!generatedContent.value || !form.title.trim()) {
    error.value = "Generated content and title are required to update."
    return
  }

  saving.value = true
  error.value = ''

  try {
    const contentId = route.params.id
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
      placeholder_inputs: placeholderValues.value,
    }

    // Update content piece
    const { data, error: updateError } = await supabase
      .from('content_pieces')
      .update(updateData)
      .eq('id', contentId)
      .select()
      .single()

    if (updateError) throw updateError

    // Get latest version number
    const { data: versionData } = await supabase
      .from('content_versions')
      .select('version_number')
      .eq('content_id', contentId)
      .order('version_number', { ascending: false })
      .limit(1)

    // Create new version
    const nextVersion = versionData && versionData.length > 0
      ? versionData[0].version_number + 1
      : 1

    await supabase
      .from('content_versions')
      .insert({
        content_id: contentId,
        version_number: nextVersion,
        content: generatedContent.value,
      })

    router.push(`/content/${contentId}`)
  } catch (err) {
    error.value = err.message || 'Error updating content.'
    console.error('Update error:', err)
  } finally {
    saving.value = false
  }
}

function copyToClipboard() {
  if (!generatedContent.value) return

  let textToCopy = generatedContent.value

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      copied.value = true
      setTimeout(() => copied.value = false, 2000)
    })
    .catch(err => console.error('Clipboard copy error:', err))
}

onMounted(async () => {
  loading.value = true
  try {
    // Check if demo template exists or create it
    const { data: existingTemplates } = await supabase
      .from('templates')
      .select('id')
      .eq('name', 'Email Promotionnel (Français)')
      .eq('content_type', 'email')

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
      })
    }

    // If editing an existing content piece
    if (props.isEditing) {
      const contentId = route.params.id
      try {
        await contentStore.fetchContentPiece(contentId)
        const current = contentStore.currentContent

        if (current) {
          form.title = current.title || ''
          form.contentType = current.content_type || ''
          form.prompt = current.prompt_template || current.prompt || ''
          form.tones = current.tones && Array.isArray(current.tones) ? current.tones : []
          form.purpose = current.purpose || ''
          form.contentLength = current.content_length || 'medium'
          form.language = current.language || 'en'
          form.additionalInstructions = current.additional_instructions || ''
          form.aiProvider = current.ai_provider || 'openai'
          form.temperature = typeof current.temperature === 'number' ? current.temperature : 0.7
          form.templateId = current.template_id || ''

          generatedContent.value = current.generated_content || ''
          originalContent.value = current.generated_content || ''

          if (generatedContent.value) {
            detectPlaceholders()
          }

          if (form.contentType) {
            await loadTemplateOptions()

            // Apply template if one was used
            if (form.templateId) {
              const appliedTemplate = templateOptions.value.find(t => t.id === form.templateId)
              if (appliedTemplate) {
                selectedTemplate.value = appliedTemplate

                // Initialize preGenerationValues if placeholder data available
                if (current.placeholder_inputs) {
                  preGenerationValues.value = current.placeholder_inputs
                } else if (appliedTemplate.template_data &&
                  appliedTemplate.template_data.placeholders &&
                  Array.isArray(appliedTemplate.template_data.placeholders)) {
                  const phObj = {}
                  appliedTemplate.template_data.placeholders.forEach(ph => { phObj[ph] = '' })
                  preGenerationValues.value = phObj
                }
              }
            }
          }
        } else {
          error.value = 'Content not found.'
        }
      } catch (err) {
        error.value = 'Error loading content for editing.'
        console.error('Edit load error:', err)
      }
    } else {
      // Check project ID for new content
      if (!route.params.projectId) {
        error.value = "Project ID is missing. Cannot create new content."
        console.error("Project ID missing for new content.")
      }
    }
  } catch (err) {
    console.error('Error during component initialization:', err)
    error.value = 'An error occurred while setting up the form.'
  } finally {
    loading.value = false
  }
})

// Watch for content type changes to reload templates
watch(() => form.contentType, (newType, oldType) => {
  if (newType !== oldType) {
    form.templateId = ''
    selectedTemplate.value = null
    preGenerationValues.value = {}
    loadTemplateOptions()
    // Reset purpose when content type changes
    form.purpose = ''
  }
})
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

/* Custom form elements styling */
.form-checkbox, .form-radio {
  /* Ensure proper sizing and appearance if custom checkboxes are used */
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

/* Placeholder styling */
.highlight-placeholder {
  background-color: rgba(127, 0, 255, 0.2);
  color: #EAEAEA;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.highlight-placeholder:hover {
  background-color: rgba(127, 0, 255, 0.4);
}

.filled-placeholder {
  color: #FFD700; /* accent.gold */
  font-weight: 600;
}

/* Step indicators animation */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(127, 0, 255, 0.7); }
  50% { box-shadow: 0 0 10px rgba(127, 0, 255, 0.7); }
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* Smooth transition for step switching */
.form-step {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.form-step-enter-active, .form-step-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.form-step-enter-from, .form-step-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Transition for the additional instructions panel */
.instructions-transition-enter-active {
  transition: all 0.3s ease-out;
}
.instructions-transition-leave-active {
  transition: all 0.3s ease-in;
}
.instructions-transition-enter-from,
.instructions-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Step navigation indicators */
.step-indicator {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-indicator-active {
  background-color: #7F00FF;
  color: white;
  box-shadow: 0 0 15px rgba(127, 0, 255, 0.5);
}

.step-indicator-line {
  position: absolute;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  z-index: 0;
  transition: background-color 0.3s ease;
}

.step-indicator-line-active {
  background-color: #7F00FF;
}

/* Animation for the generate content section */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer-effect {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 3s infinite linear;
}

/* AI model selection styles */
.ai-provider-card {
  transition: all 0.2s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ai-provider-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(127, 0, 255, 0.3);
}

.ai-provider-card.selected {
  border-color: #7F00FF;
  background-color: rgba(127, 0, 255, 0.1);
}
</style>