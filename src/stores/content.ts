// src/stores/content.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useContentStore = defineStore('content', () => {
    const contentPieces = ref([])
    const currentContent = ref(null)
    const contentVersions = ref([])
    const loading = ref(false)
    const error = ref(null)
    const generatingContent = ref(false)

    async function fetchContentPieces(projectId) {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('content_pieces')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError

            contentPieces.value = data
            return data
        } catch (err) {
            error.value = err.message
            console.error('Error fetching content pieces:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchContentPiece(id) {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('content_pieces')
                .select('*')
                .eq('id', id)
                .single()

            if (fetchError) throw fetchError

            currentContent.value = data
            return data
        } catch (err) {
            error.value = err.message
            console.error('Error fetching content piece:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchContentVersions(contentId) {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('content_versions')
                .select('*')
                .eq('content_id', contentId)
                .order('version_number', { ascending: false })

            if (fetchError) throw fetchError

            contentVersions.value = data
            return data
        } catch (err) {
            error.value = err.message
            console.error('Error fetching content versions:', err)
        } finally {
            loading.value = false
        }
    }

    async function generateContent({ prompt, contentType, projectId, aiProvider, temperature, additionalInstructions }) {
        generatingContent.value = true
        error.value = null

        try {
            const { data: authData } = await supabase.auth.getSession()

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-copywriting`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.session.access_token}`
                },
                body: JSON.stringify({
                    prompt,
                    contentType,
                    projectId,
                    aiProvider,
                    temperature,
                    additionalInstructions
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to generate content')
            }

            const result = await response.json()
            return result.content
        } catch (err) {
            error.value = err.message
            console.error('Error generating content:', err)
            throw err
        } finally {
            generatingContent.value = false
        }
    }

    async function updateContent(id, contentData) {
        loading.value = true
        error.value = null

        try {
            // First, get current version number
            const { data: currentData, error: fetchError } = await supabase
                .from('content_pieces')
                .select('*')
                .eq('id', id)
                .single()

            if (fetchError) throw fetchError

            // Start a transaction
            const { data, error: updateError } = await supabase
                .from('content_pieces')
                .update(contentData)
                .eq('id', id)
                .select()
                .single()

            if (updateError) throw updateError

            // Create a new version
            if (contentData.generated_content) {
                const { data: versionsData, error: versionsError } = await supabase
                    .from('content_versions')
                    .select('*')
                    .eq('content_id', id)
                    .order('version_number', { ascending: false })
                    .limit(1)

                const nextVersionNumber = versionsData && versionsData.length > 0
                    ? versionsData[0].version_number + 1
                    : 1

                await supabase
                    .from('content_versions')
                    .insert({
                        content_id: id,
                        version_number: nextVersionNumber,
                        content: contentData.generated_content
                    })
            }

            // Update the stores
            const index = contentPieces.value.findIndex(p => p.id === id)
            if (index !== -1) {
                contentPieces.value[index] = data
            }

            if (currentContent.value && currentContent.value.id === id) {
                currentContent.value = data
            }

            return data
        } catch (err) {
            error.value = err.message
            console.error('Error updating content:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteContent(id) {
        loading.value = true
        error.value = null

        try {
            // Delete all versions first (due to foreign key constraints)
            const { error: versionsDeleteError } = await supabase
                .from('content_versions')
                .delete()
                .eq('content_id', id)

            if (versionsDeleteError) throw versionsDeleteError

            // Now delete the content piece
            const { error: deleteError } = await supabase
                .from('content_pieces')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            contentPieces.value = contentPieces.value.filter(p => p.id !== id)

            if (currentContent.value && currentContent.value.id === id) {
                currentContent.value = null
            }
        } catch (err) {
            error.value = err.message
            console.error('Error deleting content:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        contentPieces,
        currentContent,
        contentVersions,
        loading,
        error,
        generatingContent,
        fetchContentPieces,
        fetchContentPiece,
        fetchContentVersions,
        generateContent,
        updateContent,
        deleteContent
    }
})