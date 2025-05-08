"use client";

import { useEffect } from 'react';
import LawCard from "@/app/components/LawCard";
import TestimonialCard from "@/app/components/TestimonialCard";
import { services } from "@/app/data/services";
import { testimonials } from "@/app/data/testimonials";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useInView } from 'react-intersection-observer';

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-right" dir="rtl">
      {/* Hero Section */}
<section className="relative bg-gradient-to-br from-indigo-500 to-purple-700 text-white py-20 md:py-32 overflow-hidden">

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.svg')] bg-cover" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 max-w-6xl relative z-10"
        >
          <div className="flex flex-col items-start space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              مساعدك القانوني الرقمي <span className="text-yellow-300">للقانون المغربي</span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl">
              اطلع على المعلومات القانونية، وقم بإنشاء وثائق، واحصل على استشارات مصممة وفقًا للتشريعات المغربية.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/consult"
                  className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  aria-label="طرح سؤال قانوني"
                >
                  طرح سؤال قانوني
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/generate-document"
                  className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-20 px-8 py-3 rounded-lg font-medium text-lg transition-all duration-300"
                  aria-label="إنشاء وثيقة قانونية"
                >
                  إنشاء وثيقة
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              خدماتنا <span className="text-indigo-600">المتميزة</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
          </motion.div>
          
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <LawCard {...service} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              آراء <span className="text-indigo-600">مستخدمينا</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اكتشف ما يقوله عملاؤنا عن تجربتهم مع منصتنا القانونية
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              مستعد لبدء <span className="text-yellow-300">رحلتك القانونية</span>؟
            </h3>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              انضم إلى الآلاف الذين وجدوا الحلول القانونية التي يحتاجونها
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="/consult"
                className="inline-block bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3 rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                ابدأ الآن مجانًا
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}