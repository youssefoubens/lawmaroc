'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'citizen' as 'citizen' | 'advocate',
    preferred_language: 'ar' as 'ar' | 'fr' | 'en',
    // Advocate-specific fields
    bar_association_id: '',
    license_number: '',
    specializations: '',
    years_experience: '',
    office_address: '',
    city: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    if (formData.role === 'advocate') {
      setStep(2)
    } else {
      handleSignUp()
    }
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError('')

    try {
      const userData = {
        full_name: formData.full_name,
        phone: formData.phone,
        role: formData.role,
        preferred_language: formData.preferred_language
      }

      await signUp(formData.email, formData.password, userData)

      // If advocate, create advocate record
      if (formData.role === 'advocate') {
        // This would be handled in a separate API call after user creation
        // For now, we'll redirect to a verification pending page
        router.push('/auth/verification-pending')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التسجيل بجوجل')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أو{' '}
            <Link href="/auth/signin" className="font-medium text-green-600 hover:text-green-500">
              تسجيل الدخول إلى حسابك
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow">
          {step === 1 && (
            <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  رقم الهاتف (اختياري)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+212XXXXXXXXX"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  نوع الحساب
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="citizen">مواطن</option>
                  <option value="advocate">محامي</option>
                </select>
              </div>

              <div>
                <label htmlFor="preferred_language" className="block text-sm font-medium text-gray-700">
                  اللغة المفضلة
                </label>
                <select
                  id="preferred_language"
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  كلمة المرور
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
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

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  تأكيد كلمة المرور
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {formData.role === 'advocate' ? 'التالي' : (loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب')}
              </button>
            </form>
          )}

          {step === 2 && formData.role === 'advocate' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900">معلومات المحامي</h3>
                <p className="text-sm text-gray-600">يرجى ملء المعلومات المهنية للتحقق من هويتك</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} className="space-y-4">
                <div>
                  <label htmlFor="bar_association_id" className="block text-sm font-medium text-gray-700">
                    رقم هيئة المحامين
                  </label>
                  <input
                    id="bar_association_id"
                    name="bar_association_id"
                    type="text"
                    required
                    value={formData.bar_association_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">
                    رقم الترخيص
                  </label>
                  <input
                    id="license_number"
                    name="license_number"
                    type="text"
                    required
                    value={formData.license_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="specializations" className="block text-sm font-medium text-gray-700">
                    التخصصات (مفصولة بفواصل)
                  </label>
                  <input
                    id="specializations"
                    name="specializations"
                    type="text"
                    value={formData.specializations}
                    onChange={handleInputChange}
                    placeholder="قانون الأسرة، قانون الأعمال، القانون الجنائي"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700">
                    سنوات الخبرة
                  </label>
                  <input
                    id="years_experience"
                    name="years_experience"
                    type="number"
                    min="0"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    المدينة
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="flex space-x-4 space-x-reverse">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    السابق
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 1 && (
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
                onClick={handleGoogleSignUp}
                className="mt-6 w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaGoogle className="ml-2 text-red-500" />
                التسجيل بجوجل
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}