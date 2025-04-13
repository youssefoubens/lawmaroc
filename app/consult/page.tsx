"use client";

import { useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import "@/app/styles/consult.css";

export default function ConsultPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    question: "",
    anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<null | {
    success: boolean;
    message: string;
  }>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmissionResult({
        success: true,
        message: "تم إرسال استشارتك القانونية بنجاح! سنتواصل معك قريباً.",
      });
      setFormData({
        name: "",
        email: "",
        category: "",
        question: "",
        anonymous: false,
      });
    } catch (err) {
      setSubmissionResult({
        success: false,
        message: "حدث خطأ أثناء إرسال استشارتك. يرجى المحاولة مرة أخرى لاحقاً."+err,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="consult-page" dir="rtl">
      <h1 className="consult-title">استشارة قانونية</h1>
      <p className="consult-description">
        لديك سؤال قانوني؟ املأ النموذج أدناه وسيقوم نظامنا أو خبراؤنا القانونيون بتقديم التوجيه لك بناءً على القانون المغربي.
      </p>

      {submissionResult && (
        <div className={`submission-result ${submissionResult.success ? "success" : "error"}`}>
          {submissionResult.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="consult-form">
        <div className="form-group">
          <label htmlFor="category">التصنيف القانوني</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">اختر تصنيفاً</option>
            <option value="family">قانون الأسرة</option>
            <option value="property">قانون الملكية</option>
            <option value="employment">قانون العمل</option>
            <option value="business">قانون الأعمال/التجارة</option>
            <option value="criminal">القانون الجنائي</option>
            <option value="other">أخرى</option>
          </select>
        </div>

        {!formData.anonymous && (
          <>
            <div className="form-group">
              <label htmlFor="name">اسمك</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={!formData.anonymous}
              />
            </div>
          </>
        )}

        <div className="anonymous-option">
          <input
            type="checkbox"
            id="anonymous"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleChange}
          />
          <label htmlFor="anonymous">إرسال الاستشارة بشكل مجهول</label>
        </div>

        <div className="form-group">
          <label htmlFor="question">سؤالك القانوني</label>
          <textarea
            id="question"
            name="question"
            value={formData.question}
            onChange={handleChange}
            rows={6}
            required
            placeholder="يرجى تقديم أكبر قدر ممكن من التفاصيل حول وضعك القانوني..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="spinner-icon" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <FaPaperPlane />
              إرسال الاستشارة
            </>
          )}
        </button>
      </form>

      <div className="expectations">
        <h2>ما يمكن توقعه</h2>
        <ul>
          <li>الأسئلة البسيطة قد تحصل على ردود آلية فورية</li>
          <li>الأسئلة المعقدة سيتم مراجعتها من قبل فريقنا القانوني</li>
          <li>مدة الرد المعتادة: من 1 إلى 3 أيام عمل</li>
          <li>للأمور العاجلة، يرجى التواصل مع محام مباشرة</li>
        </ul>
      </div>
    </div>
  );
}