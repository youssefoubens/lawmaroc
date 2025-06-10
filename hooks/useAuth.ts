import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthService, AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  signInWithPhone: (phone: string) => Promise<any>
  verifyPhoneOTP: (phone: string, token: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const authUser = await AuthService.getCurrentUser()
        setUser(authUser)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const authUser = await AuthService.getCurrentUser()
          setUser(authUser)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true)
    try {
      const result = await AuthService.signUp(email, password, userData)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await AuthService.signIn(email, password)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    return AuthService.signInWithGoogle()
  }

  const signInWithPhone = async (phone: string) => {
    return AuthService.signInWithPhone(phone)
  }

  const verifyPhoneOTP = async (phone: string, token: string) => {
    setLoading(true)
    try {
      const result = await AuthService.verifyPhoneOTP(phone, token)
      return result
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await AuthService.signOut()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('No user logged in')
    
    const result = await AuthService.updateProfile(user.id, updates)
    
    // Update local user state
    setUser(prev => prev ? {
      ...prev,
      profile: { ...prev.profile, ...result }
    } : null)
    
    return result
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneOTP,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}