"use client";

import "@/app/styles/testimonialcard.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating?: number;
}

const TestimonialCard = ({ quote, author, role, rating = 5 }: TestimonialCardProps) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p className="testimonial-quote">{quote}</p>
        <div className="testimonial-rating">{renderStars()}</div>
      </div>
      <div className="testimonial-author">
        <h4 className="author-name">{author}</h4>
        <p className="author-role">{role}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;