"use client";

import LawCard from "@/app/components/LawCard";
import TestimonialCard from "@/app/components/TestimonialCard";
import { services } from "@/app/data/services";
import { testimonials } from "@/app/data/testimonials";
import Link from "next/link";
import "@/app/styles/home.css";

export default function Home() {
  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">مساعدك القانوني الرقمي للقانون المغربي</h1>
          <p className="hero-description">
            اطلع على المعلومات القانونية، وقم بإنشاء وثائق، واحصل على استشارات مصممة وفقًا للتشريعات المغربية.
          </p>
          <div className="hero-buttons">
            <Link
              href="/consult"
              className="hero-button consultation-btn"
              aria-label="طرح سؤال قانوني"
            >
              طرح سؤال قانوني
            </Link>
            <Link
              href="/generate-document"
              className="hero-button document-btn"
              aria-label="إنشاء وثيقة قانونية"
            >
              إنشاء وثيقة
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">خدماتنا</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <LawCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">آراء مستخدمينا</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}