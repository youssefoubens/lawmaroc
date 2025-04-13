"use client";

import { useState } from "react";
import { FaFileDownload, FaSpinner } from "react-icons/fa";
import "@/app/styles/generate-document.css";

const documentTypes = [
  {
    id: "rental",
    name: "عقد إيجار",
    description: "عقد إيجار قياسي للممتلكات السكنية أو التجارية",
  },
  {
    id: "employment",
    name: "عقد عمل",
    description: "اتفاق بين صاحب العمل والموظف",
  },
  {
    id: "service",
    name: "عقد خدمة",
    description: "للمقاولين المستقلين أو مقدمي الخدمات",
  },
  {
    id: "sales",
    name: "عقد بيع",
    description: "لشراء/بيع البضائع أو العقارات",
  },
  {
    id: "nda",
    name: "اتفاقية عدم إفصاح",
    description: "اتفاقية سرية بين الأطراف",
  },
];

export default function GenerateDocumentPage() {
  const [selectedDocType, setSelectedDocType] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<null | {
    url: string;
    name: string;
  }>(null);

  const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const docType = e.target.value;
    setSelectedDocType(docType);
    setFormData({});
    setGeneratedDoc(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGeneratedDoc({
        url: "#",
        name: `${selectedDocType}_agreement_${new Date().toISOString().slice(0, 10)}.pdf`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderFormFields = () => {
    if (!selectedDocType) return null;

    const commonFields = [
      { name: "party1_name", label: "الاسم الكامل", type: "text" },
      { name: "party1_address", label: "العنوان", type: "text" },
      { name: "party1_id", label: "رقم الهوية", type: "text" },
      { name: "party2_name", label: "الاسم الكامل للطرف الآخر", type: "text" },
      { name: "party2_address", label: "عنوان الطرف الآخر", type: "text" },
      { name: "party2_id", label: "رقم هوية الطرف الآخر", type: "text" },
    ];

    const specificFields: Record<string, Array<{name: string, label: string, type: string}>> = {
      rental: [
        { name: "property_address", label: "عنوان العقار", type: "text" },
        { name: "rent_amount", label: "الإيجار الشهري (درهم)", type: "number" },
        { name: "deposit_amount", label: "مبلغ الضمان (درهم)", type: "number" },
        { name: "start_date", label: "تاريخ البدء", type: "date" },
        { name: "duration", label: "المدة (أشهر)", type: "number" },
      ],
      employment: [
        { name: "job_title", label: "المسمى الوظيفي", type: "text" },
        { name: "salary", label: "الراتب الشهري (درهم)", type: "number" },
        { name: "start_date", label: "تاريخ البدء", type: "date" },
        { name: "probation_period", label: "فترة التجربة (أشهر)", type: "number" },
        { name: "working_hours", label: "ساعات العمل الأسبوعية", type: "number" },
      ],
      service: [
        { name: "service_description", label: "وصف الخدمة", type: "text" },
        { name: "service_fee", label: "أجر الخدمة (درهم)", type: "number" },
        { name: "start_date", label: "تاريخ البدء", type: "date" },
        { name: "end_date", label: "تاريخ الانتهاء", type: "date" },
      ],
      sales: [
        { name: "item_description", label: "وصف السلعة", type: "text" },
        { name: "price", label: "السعر (درهم)", type: "number" },
        { name: "delivery_date", label: "تاريخ التسليم", type: "date" },
      ],
      nda: [
        { name: "confidential_info", label: "وصف المعلومات السرية", type: "text" },
        { name: "duration_months", label: "المدة (أشهر)", type: "number" },
      ],
    };

    return [...commonFields, ...(specificFields[selectedDocType] || [])].map(
      (field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>
            {field.label}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleInputChange}
            required
          />
        </div>
      )
    );
  };

  return (
    <div className="generate-document-page" dir="rtl">
      <h1 className="page-title">إنشاء مستند قانوني</h1>
      <p className="page-description">
        أنشئ مستندات قانونية صالحة مخصصة وفقًا للقانون المغربي. اختر نوع المستند أدناه واملأ المعلومات المطلوبة.
      </p>

      <div className="document-generator">
        <div className="document-type-selector">
          <label htmlFor="documentType">نوع المستند</label>
          <select
            id="documentType"
            value={selectedDocType}
            onChange={handleDocTypeChange}
          >
            <option value="">اختر نوع المستند</option>
            {documentTypes.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.description}
              </option>
            ))}
          </select>
        </div>

        {selectedDocType && (
          <form onSubmit={generateDocument} className="document-form">
            {renderFormFields()}

            <button
              type="submit"
              disabled={isGenerating}
              className="generate-button"
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <FaFileDownload />
                  إنشاء المستند
                </>
              )}
            </button>
          </form>
        )}

        {generatedDoc && (
          <div className="document-ready">
            <h3>المستند جاهز!</h3>
            <p>تم إنشاء {documentTypes.find(d => d.id === selectedDocType)?.name} بنجاح.</p>
            <a
              href={generatedDoc.url}
              download={generatedDoc.name}
              className="download-button"
            >
              تحميل المستند
            </a>
            <p className="document-note">
              يمكنك أيضًا العثور على هذا المستند في لوحة التحكم إذا كنت مسجلاً الدخول.
            </p>
          </div>
        )}
      </div>

      <div className="important-notes">
        <h2>ملاحظات هامة</h2>
        <ul>
          <li>
            هذه المستندات هي نماذج وقد تحتاج إلى تخصيص لحالتك الخاصة.
          </li>
          <li>
            للمسائل القانونية المعقدة، نوصي باستشارة محام مرخص.
          </li>
          <li>
            قد يتطلب القانون المغربي توثيق أو تسجيل بعض المستندات.
          </li>
        </ul>
      </div>
    </div>
  );
}