export default function VerificationPendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          في انتظار التحقق
        </h1>
        
        <p className="text-gray-600 mb-6">
          تم إنشاء حسابك بنجاح. سيقوم فريقنا بمراجعة معلوماتك المهنية والتحقق من هويتك كمحامي مرخص.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">ما يحدث الآن:</h3>
          <ul className="text-sm text-blue-700 space-y-1 text-right">
            <li>• مراجعة رقم هيئة المحامين</li>
            <li>• التحقق من رقم الترخيص</li>
            <li>• التأكد من صحة المعلومات المهنية</li>
          </ul>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          عادة ما تستغرق عملية التحقق من 1-3 أيام عمل. سنرسل لك بريداً إلكترونياً عند اكتمال المراجعة.
        </p>
        
        <div className="space-y-3">
          <a
            href="/auth/signin"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors inline-block"
          >
            تسجيل الدخول
          </a>
          
          <a
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors inline-block"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  )
}