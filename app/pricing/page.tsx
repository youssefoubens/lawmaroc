'use client'

import { useState, useEffect } from 'react'
import { FaCheck, FaTimes, FaCrown, FaUsers, FaGavel } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/database.types'

type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row']

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_mad', { ascending: true })

      if (error) throw error
      setPlans(data || [])
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('free')) return <FaUsers className="text-gray-500" />
    if (planName.toLowerCase().includes('citizen')) return <FaUsers className="text-blue-500" />
    if (planName.toLowerCase().includes('advocate')) return <FaGavel className="text-green-500" />
    return <FaCrown className="text-yellow-500" />
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getFeaturesList = (features: any) => {
    if (!features || typeof features !== 'object') return []
    
    const featureMap: { [key: string]: string } = {
      basic_info: 'الوصول للمعلومات القانونية الأساسية',
      priority_support: 'دعم ذو أولوية',
      document_generation: 'إنشاء المستندات القانونية',
      chat_support: 'دعم عبر الدردشة',
      case_management: 'إدارة القضايا',
      client_portal: 'بوابة العملاء',
      calendar: 'التقويم والمواعيد',
      analytics: 'التحليلات المتقدمة',
      video_calls: 'استشارات فيديو',
      priority_listing: 'ظهور متقدم في النتائج',
      api_access: 'الوصول لواجهة برمجة التطبيقات'
    }

    return Object.keys(features)
      .filter(key => features[key] === true)
      .map(key => featureMap[key] || key)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            خطط الأسعار
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            اختر الخطة المناسبة لاحتياجاتك القانونية
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="bg-white p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'month'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              شهرياً
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'year'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              سنوياً
              <span className="mr-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                وفر 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const features = getFeaturesList(plan.features)
            const isPopular = plan.name.toLowerCase().includes('citizen pro')
            const yearlyPrice = plan.price_mad * 12 * 0.8 // 20% discount for yearly
            const displayPrice = billingInterval === 'year' ? yearlyPrice : plan.price_mad

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                  isPopular ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-medium">
                    الأكثر شعبية
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-3xl">
                      {getPlanIcon(plan.name)}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 text-center">
                    {plan.name_ar}
                  </h3>

                  <div className="mt-4 text-center">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {formatPrice(displayPrice)}
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /{billingInterval === 'month' ? 'شهر' : 'سنة'}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-gray-500 text-center">
                    {plan.description_ar}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheck className="flex-shrink-0 w-4 h-4 text-green-500 mt-0.5" />
                        <span className="mr-3 text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}

                    {plan.max_consultations && plan.max_consultations > 0 && (
                      <li className="flex items-start">
                        <FaCheck className="flex-shrink-0 w-4 h-4 text-green-500 mt-0.5" />
                        <span className="mr-3 text-sm text-gray-700">
                          {plan.max_consultations === -1 
                            ? 'استشارات غير محدودة' 
                            : `${plan.max_consultations} استشارة شهرياً`
                          }
                        </span>
                      </li>
                    )}

                    {plan.max_documents && plan.max_documents > 0 && (
                      <li className="flex items-start">
                        <FaCheck className="flex-shrink-0 w-4 h-4 text-green-500 mt-0.5" />
                        <span className="mr-3 text-sm text-gray-700">
                          {plan.max_documents === -1 
                            ? 'مستندات غير محدودة' 
                            : `${plan.max_documents} مستند شهرياً`
                          }
                        </span>
                      </li>
                    )}

                    {plan.priority_support && (
                      <li className="flex items-start">
                        <FaCheck className="flex-shrink-0 w-4 h-4 text-green-500 mt-0.5" />
                        <span className="mr-3 text-sm text-gray-700">دعم ذو أولوية</span>
                      </li>
                    )}
                  </ul>

                  <div className="mt-8">
                    <button
                      className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                        plan.price_mad === 0
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : isPopular
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
                      }`}
                    >
                      {plan.price_mad === 0 ? 'البدء مجاناً' : 'اختيار الخطة'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            الأسئلة الشائعة
          </h2>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                هل يمكنني تغيير خطتي لاحقاً؟
              </h3>
              <p className="mt-2 text-gray-600">
                نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. التغييرات ستدخل حيز التنفيذ في دورة الفوترة التالية.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                هل هناك رسوم إضافية للمحامين؟
              </h3>
              <p className="mt-2 text-gray-600">
                لا، جميع الرسوم شاملة. المحامون المتحققون يحصلون على جميع الميزات المدرجة في خطتهم.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                كيف يتم التحقق من هوية المحامين؟
              </h3>
              <p className="mt-2 text-gray-600">
                نتحقق من رقم هيئة المحامين ورقم الترخيص مع السجلات الرسمية قبل تفعيل الحساب.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                ما هي طرق الدفع المقبولة؟
              </h3>
              <p className="mt-2 text-gray-600">
                نقبل بطاقات الائتمان والخصم، PayPal، والتحويل البنكي المحلي في المغرب.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}