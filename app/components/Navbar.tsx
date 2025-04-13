"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBalanceScale, FaFileAlt, FaQuestion, FaUser, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import "@/app/styles/navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [isLoggedIn] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/", label: "الصفحة الرئيسية", icon: <FaBalanceScale /> },
    { href: "/about", label: "حول التطبيق", icon: <FaQuestion /> },
    { href: "/consult", label: "استشارة قانونية", icon: <FaQuestion /> },
    { href: "/generate-document", label: "إنشاء مستند", icon: <FaFileAlt /> },
  ];

  return (
    <nav className="navbar" dir="rtl">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <FaBalanceScale className="navbar-icon" />
          <span>المساعدة القانونية المغربية</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}

          {isLoggedIn ? (
            <Link href="/dashboard" className="navbar-button dashboard-btn">
              <FaUser />
              <span>لوحة التحكم</span>
            </Link>
          ) : (
            <Link href="/auth/signin" className="navbar-button signin-btn">
              <FaSignInAlt />
              <span>تسجيل الدخول</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={toggleMenu} className="navbar-toggle">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="navbar-mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-mobile-link ${pathname === link.href ? "active" : ""}`}
                onClick={toggleMenu}
              >
                <div className="flex items-center gap-2">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
              </Link>
            ))}

            <div className="navbar-mobile-auth">
              {isLoggedIn ? (
                <Link href="/dashboard" className="navbar-button dashboard-btn" onClick={toggleMenu}>
                  <FaUser />
                  <span>لوحة التحكم</span>
                </Link>
              ) : (
                <Link href="/auth/signin" className="navbar-button signin-btn" onClick={toggleMenu}>
                  <FaSignInAlt />
                  <span>تسجيل الدخول</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;