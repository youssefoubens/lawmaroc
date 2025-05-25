import DocumentCard from "./DocumentCard";
import { GoogleDriveFile } from "../types";
import Pagination from "../UI/Pagination";

interface DocumentGridProps {
  files: GoogleDriveFile[];
  recommendedDocId: string | null;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function DocumentGrid({
  files,
  recommendedDocId,
  currentPage,
  itemsPerPage,
  onPageChange
}: DocumentGridProps) {
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleFiles = files.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {visibleFiles.map(file => (
          <DocumentCard 
            key={file.id}
            file={file}
            isRecommended={recommendedDocId === file.id}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}