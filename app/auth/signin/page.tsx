'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaGoogle, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'otp'>('email')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signInWithGoogle, signInWithPhone, verifyPhoneOTP } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Redirect will be handled by the callback
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول بجوجل')
    }
  }

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithPhone(phone)
      setAuthMethod('otp')
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال رمز التحقق')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await verifyPhoneOTP(phone, otp)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'رمز التحقق غير صحيح')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link href="/auth/signup" className="font-medium text-green-600 hover:text-green-500">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {searchParams.get('error') && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow">
          {/* Auth Method Tabs */}
          <div className="flex mb-6 border-b">
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 px-4 text-center ${
                authMethod === 'email'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500'
              }`}
            >
              البريد الإلكتروني
            </button>
            <button
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 px-4 text-center ${
                authMethod === 'phone'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500'
              }`}
            >
              رقم الهاتف
            </button>
          </div>

          {authMethod === 'email' && (
            <form onSubmit={handleEmailSignIn} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  كلمة المرور
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>
          )}

          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneSignIn} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  رقم الهاتف
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+212XXXXXXXXX"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
              </button>
            </form>
          )}

          {authMethod === 'otp' && (
            <form onSubmit={handleOTPVerification} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  رمز التحقق
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="أدخل الرمز المرسل إلى هاتفك"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'جاري التحقق...' : 'تأكيد الرمز'}
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('phone')}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
              >
                العودة لإدخال رقم الهاتف
              </button>
            </form>
          )}

          {authMethod !== 'otp' && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">أو</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="mt-6 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaGoogle className="ml-2 text-red-500" />
                تسجيل الدخول بجوجل
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}