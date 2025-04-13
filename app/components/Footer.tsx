"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaBalanceScale } from "react-icons/fa";
import "@/app/styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer" dir="rtl">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="flex items-center gap-2 mb-4">
              <FaBalanceScale className="footer-brand-icon" />
              <h3 className="footer-brand-title">المساعدة القانونية المغربية</h3>
            </div>
            <p className="footer-brand-text">
              مساعدك القانوني الرقمي للقوانين المغربية
            </p>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">روابط سريعة</h4>
            <ul className="footer-list">
              <li>
                <Link href="/" className="footer-link">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">
                  حول التطبيق
                </Link>
              </li>
              <li>
                <Link href="/consult" className="footer-link">
                  استشارة قانونية
                </Link>
              </li>
              <li>
                <Link href="/generate-document" className="footer-link">
                  إنشاء مستند
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">معلومات قانونية</h4>
            <ul className="footer-list">
              <li>
                <Link href="/privacy" className="footer-link">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  شروط الخدمة
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="footer-link">
                  إخلاء المسؤولية
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-title">اتصل بنا</h4>
            <p className="footer-contact-text">
              لديك استفسار؟ تواصل معنا
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link">
                <FaFacebook />
              </a>
              <a href="#" className="footer-social-link">
                <FaTwitter />
              </a>
              <a href="#" className="footer-social-link">
                <FaLinkedin />
              </a>
              <a href="mailto:contact@moroccanlegalhelp.com" className="footer-social-link">
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} المساعدة القانونية المغربية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;