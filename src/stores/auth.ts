// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabase'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const isAuthenticated = computed(() => !!user.value)

    async function initialize() {
        loading.value = true
        error.value = null

        try {
            // Get the current session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession()

            if (sessionError) {
                throw sessionError
            }

            if (session) {
                user.value = session.user

                // Get user details from our users table
                const { data, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (profileError) {
                    // If user doesn't exist in our table, create them
                    if (profileError.code === 'PGRST116') {
                        const { data: newUser, error: createError } = await supabase
                            .from('users')
                            .insert({
                                id: session.user.id,
                                email: session.user.email
                            })
                            .select()
                            .single()

                        if (createError) throw createError
                    } else {
                        throw profileError
                    }
                }
            }
        } catch (err) {
            error.value = err.message
            console.error('Auth error:', err)
        } finally {
            loading.value = false
        }

        // Set up auth state change listener
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                user.value = session.user
            } else if (event === 'SIGNED_OUT') {
                user.value = null
            }
        })
    }

    async function signIn(email, password) {
        loading.value = true
        error.value = null

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (signInError) throw signInError

            user.value = data.user
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    async function signUp(email, password) {
        loading.value = true
        error.value = null

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password
            })

            if (signUpError) throw signUpError

            return data
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    async function signOut() {
        loading.value = true
        error.value = null

        try {
            const { error: signOutError } = await supabase.auth.signOut()

            if (signOutError) throw signOutError

            user.value = null
        } catch (err) {
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        user,
        loading,
        error,
        isAuthenticated,
        initialize,
        signIn,
        signUp,
        signOut
    }
})