"use client";

import { useState } from "react";
import Link from "next/link";
import { FaSignInAlt, FaSpinner, FaGoogle, FaFacebook } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import "@/app/styles/signin.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="signin-container" dir="rtl">
      <h1 className="signin-title">تسجيل الدخول</h1>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="signin-form">
        <div className="form-group">
          <label htmlFor="email">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">كلمة المرور</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-options">
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">تذكرني</label>
          </div>
          <Link href="/auth/forgot-password" className="forgot-password">
            نسيت كلمة المرور؟
          </Link>
        </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? (
            <>
              <FaSpinner className="spinner-icon" />
              جاري تسجيل الدخول...
            </>
          ) : (
            <>
              <FaSignInAlt />
              تسجيل الدخول
            </>
          )}
        </button>
      </form>

      <div className="social-divider">
        <span>أو متابعة باستخدام</span>
      </div>

      <div className="social-buttons">
        <button type="button" className="social-button google">
          <FaGoogle />
          <span>جوجل</span>
        </button>
        <button type="button" className="social-button facebook">
          <FaFacebook />
          <span>فيسبوك</span>
        </button>
      </div>

      <div className="signup-link">
        ليس لديك حساب؟{" "}
        <Link href="/auth/signup">إنشاء حساب</Link>
      </div>
    </div>
  );
}