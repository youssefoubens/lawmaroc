// app/components/LawCard.tsx
"use client";

import Link from "next/link";
import "@/app/styles/lawcard.css";

interface LawCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: "primary" | "secondary" | "accent";
}

const LawCard = ({ title, description, icon, href, color = "primary" }: LawCardProps) => {
  return (
    <Link href={href} className={`law-card ${color}`}>
      <div className="card-content">
        <div className="card-icon">{icon}</div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </Link>
  );
};

export default LawCard;