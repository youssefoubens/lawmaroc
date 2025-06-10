import { supabase } from './supabase'
import { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']

export interface AuthUser {
  id: string
  email: string
  profile?: Profile
}

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, userData: {
    full_name: string
    phone?: string
    role?: 'citizen' | 'advocate'
    preferred_language?: 'ar' | 'fr' | 'en'
  }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role || 'citizen'
        }
      }
    })

    if (authError) throw authError

    if (authData.user) {
      // Create profile
      const profileData: ProfileInsert = {
        id: authData.user.id,
        email,
        full_name: userData.full_name,
        phone: userData.phone,
        role: userData.role || 'citizen',
        preferred_language: userData.preferred_language || 'ar'
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)

      if (profileError) throw profileError
    }

    return authData
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  // Sign in with Google OAuth
  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Sign in with phone (SMS)
  static async signInWithPhone(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms'
      }
    })

    if (error) throw error
    return data
  }

  // Verify phone OTP
  static async verifyPhoneOTP(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms'
    })

    if (error) throw error
    return data
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Get current user with profile
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email!,
      profile: profile || undefined
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Check if user has role
  static async hasRole(userId: string, role: 'citizen' | 'advocate' | 'admin'): Promise<boolean> {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    return data?.role === role
  }

  // Get user subscription status
  static async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }
}