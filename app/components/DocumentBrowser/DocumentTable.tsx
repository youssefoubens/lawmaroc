import DocumentRow from "./DocumentRow";
import { GoogleDriveFile } from "../types";
import Pagination from "../UI/Pagination";

interface DocumentTableProps {
  files: GoogleDriveFile[];
  recommendedDocId: string | null;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function DocumentTable({
  files,
  recommendedDocId,
  currentPage,
  itemsPerPage,
  onPageChange
}: DocumentTableProps) {
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleFiles = files.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              اسم الملف
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              النوع
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visibleFiles.map(file => (
            <DocumentRow 
              key={file.id}
              file={file}
              isRecommended={recommendedDocId === file.id}
            />
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}