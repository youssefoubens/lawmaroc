import { FaSpinner } from "react-icons/fa";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center gap-2">
        <FaSpinner 
          className="animate-spin text-4xl text-green-500" 
          aria-hidden="true"
        />
        <p className="text-gray-600">جاري تحميل المستندات...</p>
      </div>
    </div>
  );
}