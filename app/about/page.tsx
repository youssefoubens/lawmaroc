"use client";

import { FaBalanceScale, FaUsers, FaGlobeAfrica, FaHandshake, FaEnvelope, FaPhone } from "react-icons/fa";
import "@/app/styles/about.css";

export default function AboutPage() {
  return (
    <div className="about-page" dir="rtl">
      {/* Hero Section */}
      <section className="about-hero">
        <h1 className="about-title">عن المساعدة القانونية المغربية</h1>
        <p className="about-description">
          المساعدة القانونية المغربية هي منصة رقمية تهدف إلى جعل المعلومات والخدمات القانونية في متناول الجميع في المغرب. نؤمن بأن فهم حقوقك والتزاماتك القانونية لا يجب أن يكون معقدًا أو مكلفًا.
        </p>
        <p className="about-description">
          مهمتنا هي توفير الوصول إلى المعرفة والأدوات القانونية، مساعدة الأفراد والشركات على التعامل مع القانون المغربي بثقة.
        </p>
      </section>

      {/* Values Section */}
      <section className="about-section">
        <h2 className="section-title">قيمنا</h2>
        <div className="values-grid">
          {[
            {
              icon: <FaBalanceScale className="value-icon" />,
              title: "الدقة",
              description: "نحرص على أن تكون معلوماتنا القانونية دقيقة ومواكبة للتشريعات المغربية.",
              color: "accent"
            },
            {
              icon: <FaUsers className="value-icon" />,
              title: "السهولة",
              description: "نجعل المعلومات القانونية مفهومة للجميع، وليس فقط للمحامين.",
              color: "secondary"
            },
            {
              icon: <FaGlobeAfrica className="value-icon" />,
              title: "التركيز المحلي",
              description: "نختص بالقانون المغربي، معالجا الاحتياجات الفريدة لمجتمعنا.",
              color: "primary"
            },
            {
              icon: <FaHandshake className="value-icon" />,
              title: "النزاهة",
              description: "نلتزم بالمعايير الأخلاقية والشفافية في كل ما نقوم به.",
              color: "accent"
            },
          ].map((value, index) => (
            <div key={index} className={`value-card ${value.color}`}>
              {value.icon}
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section">
        <h2 className="section-title">فريقنا</h2>
        <p className="about-description">
          تأسست المساعدة القانونية المغربية بواسطة فريق من المحامين المتخصصين وخبراء التكنولوجيا الذين رأوا الحاجة إلى تحسين الوصول إلى الخدمات القانونية في المغرب. نحن فريق صغير ولكننا متحمسون لإحداث تأثير كبير.
        </p>
        <p className="about-description">
          نتعاون مع محامين مغاربة مرخصين لضمان جودة ودقة محتوانا وخدماتنا.
        </p>
      </section>

      {/* Contact Section */}
      <section className="about-section">
        <h2 className="section-title">اتصل بنا</h2>
        <p className="about-description">
          لديك أسئلة أو ملاحظات؟ نحن نرحب بتواصلك معنا.
        </p>
        <div className="contact-info">
          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <span>contact@moroccanlegalhelp.com :البريد الإلكتروني</span>
          </div>
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <span>+212 XXX-XXXXXX :الهاتف</span>
          </div>
        </div>
      </section>
    </div>
  );
}