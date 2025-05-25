import { GoogleDriveFile, ViewMode } from "../types";
import DocumentGrid from "./DocumentGrid";
import DocumentTable from "./DocumentTable";

interface DocumentBrowserProps {
  files: GoogleDriveFile[];
  viewMode: ViewMode;
  recommendedDocId: string | null;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function DocumentBrowser({
  files,
  viewMode,
  recommendedDocId,
  currentPage,
  itemsPerPage,
  onPageChange
}: DocumentBrowserProps) {
  return (
    <div className="space-y-8">
      {viewMode === "grid" ? (
        <DocumentGrid 
          files={files}
          recommendedDocId={recommendedDocId}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      ) : (
        <DocumentTable 
          files={files}
          recommendedDocId={recommendedDocId}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}