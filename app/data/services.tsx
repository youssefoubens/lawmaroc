// app/data/services.ts
import { FaBalanceScale, FaGavel, FaBook } from "react-icons/fa";

export const services = [
  {
    title: "القانون المدني",
    description: "اللوائح الأساسية المنظمة للحقوق والعلاقات بين الأفراد",
    icon: <FaBalanceScale />,
    href: "/civil-law",
    color: "primary",
  },
  {
    title: "القانون الجنائي",
    description: "تعرف على القوانين المتعلقة بالجرائم والعقوبات",
    icon: <FaGavel />,
    href: "/criminal-law",
    color: "secondary",
  },
  {
    title: "القانون الدستوري",
    description: "فهم المبادئ الأساسية للحكومة والنظام السياسي",
    icon: <FaBook />,
    href: "/constitutional-law",
    color: "secondary",
  },
  {
    title: "قانون العقود",
    description: "القواعد المنظمة للاتفاقيات بين الأطراف",
    icon: <FaBalanceScale />,
    href: "/contract-law",
    color: "primary",
  },
  // ... يمكن إضافة المزيد من الخدمات
];