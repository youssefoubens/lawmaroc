import { FaTh, FaList } from "react-icons/fa";
import { ViewMode } from "../types";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => onViewChange("grid")}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
          currentView === "grid" 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
        aria-label="Grid view"
      >
        <FaTh /> عرض شبكي
      </button>
      <button 
        onClick={() => onViewChange("list")}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
          currentView === "list" 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
        aria-label="List view"
      >
        <FaList /> عرض قائمة
      </button>
    </div>
  );
}