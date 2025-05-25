import { FaRobot, FaTimes } from "react-icons/fa";

interface ChatbotButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatbotButton({ isOpen, onClick }: ChatbotButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-green-500 hover:bg-green-600 text-white'
      }`}
      aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <>
          <FaTimes /> إغلاق المساعد
        </>
      ) : (
        <>
          <FaRobot /> مساعدة
        </>
      )}
    </button>
  );
}