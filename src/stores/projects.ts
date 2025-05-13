// src/stores/projects.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabase'

export const useProjectsStore = defineStore('projects', () => {
    const projects = ref([])
    const currentProject = ref(null)
    const loading = ref(false)
    const error = ref(null)

    async function fetchProjects() {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError

            projects.value = data
            return data
        } catch (err) {
            error.value = err.message
            console.error('Error fetching projects:', err)
        } finally {
            loading.value = false
        }
    }

    async function fetchProject(id) {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single()

            if (fetchError) throw fetchError

            currentProject.value = data
            return data
        } catch (err) {
            error.value = err.message
            console.error('Error fetching project:', err)
        } finally {
            loading.value = false
        }
    }

    async function createProject(projectData) {
        loading.value = true
        error.value = null

        try {
            // Get current user ID
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                throw new Error('User not authenticated')
            }

            // Make sure to set the user_id field to the current authenticated user's ID
            const dataWithUserId = {
                ...projectData,
                user_id: user.id
            }

            console.log('Creating project with data:', dataWithUserId)

            const { data, error: createError } = await supabase
                .from('projects')
                .insert(dataWithUserId)
                .select()
                .single()

            if (createError) throw createError

            projects.value.unshift(data)
            return data
        } catch (err) {
            error.value = err.message
            console.error('Error creating project:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateProject(id, projectData) {
        loading.value = true
        error.value = null

        try {
            const { data, error: updateError } = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', id)
                .select()
                .single()

            if (updateError) throw updateError

            const index = projects.value.findIndex(p => p.id === id)
            if (index !== -1) {
                projects.value[index] = data
            }

            if (currentProject.value && currentProject.value.id === id) {
                currentProject.value = data
            }

            return data
        } catch (err) {
            error.value = err.message
            console.error('Error updating project:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteProject(id) {
        loading.value = true
        error.value = null

        try {
            const { error: deleteError } = await supabase
                .from('projects')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            projects.value = projects.value.filter(p => p.id !== id)

            if (currentProject.value && currentProject.value.id === id) {
                currentProject.value = null
            }
        } catch (err) {
            error.value = err.message
            console.error('Error deleting project:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        projects,
        currentProject,
        loading,
        error,
        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
        deleteProject
    }
})