'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/auth/signin?error=callback_error')
        return
      }

      if (data.session) {
        // Check if user has a profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()

        if (!profile) {
          // Create profile for OAuth users
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.session.user.id,
              email: data.session.user.email!,
              full_name: data.session.user.user_metadata?.full_name || 
                        data.session.user.user_metadata?.name || 
                        'User',
              role: 'citizen'
            })

          if (profileError) {
            console.error('Profile creation error:', profileError)
          }
        }

        router.push('/dashboard')
      } else {
        router.push('/auth/signin')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري تسجيل الدخول...</p>
      </div>
    </div>
  )
}