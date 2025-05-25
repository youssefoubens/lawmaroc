import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center p-4 border-t border-gray-200">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 mx-1 rounded border border-gray-300 disabled:opacity-50"
        aria-label="Previous page"
      >
        <FaChevronRight />
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === number 
              ? 'bg-green-500 text-white' 
              : 'border border-gray-300'
          }`}
          aria-current={currentPage === number ? "page" : undefined}
        >
          {number}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 mx-1 rounded border border-gray-300 disabled:opacity-50"
        aria-label="Next page"
      >
        <FaChevronLeft />
      </button>
    </div>
  );
}