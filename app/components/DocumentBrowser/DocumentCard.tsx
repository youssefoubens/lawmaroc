import { FaFileDownload } from "react-icons/fa";
import FileIcon from "./FileIcon";
import { GoogleDriveFile } from "../types";

interface DocumentCardProps {
  file: GoogleDriveFile;
  isRecommended: boolean;
}

export default function DocumentCard({ file, isRecommended }: DocumentCardProps) {
  return (
    <div 
      id={`doc-${file.id}`}
      className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        isRecommended ? 'bg-green-50' : ''
      }`}
    >
      <div className="flex justify-center mb-3">
        <FileIcon fileName={file.name} className="text-2xl" />
        {isRecommended && (
          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            موصى به
          </span>
        )}
      </div>
      <h4 className="font-medium text-gray-800 text-center mb-3 truncate" title={file.name}>
        {file.name}
      </h4>
      <div className="flex justify-center gap-2">
        <a
          href={`https://drive.google.com/file/d/${file.id}/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          معاينة
        </a>
        <a
          href={`https://drive.google.com/uc?export=download&id=${file.id}`}
          download={file.name}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center gap-1"
        >
          <FaFileDownload size={14} /> تحميل
        </a>
      </div>
    </div>
  );
}