import FileIcon from "./FileIcon";
import { GoogleDriveFile } from "../types";
import { FaFileDownload } from "react-icons/fa";

interface DocumentRowProps {
  file: GoogleDriveFile;
  isRecommended: boolean;
}

export default function DocumentRow({ file, isRecommended }: DocumentRowProps) {
  return (
    <tr 
      id={`doc-${file.id}`}
      className={`hover:bg-gray-50 ${isRecommended ? 'bg-green-50' : ''}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <FileIcon fileName={file.name} />
          <span className="text-sm font-medium text-gray-900">
            {file.name}
            {isRecommended && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                موصى به
              </span>
            )}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {file.mimeType?.split('/')[1] || 'غير معروف'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-2">
          <a
            href={`https://drive.google.com/file/d/${file.id}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-900"
          >
            معاينة
          </a>
          <span>|</span>
          <a
            href={`https://drive.google.com/uc?export=download&id=${file.id}`}
            download={file.name}
            className="text-green-600 hover:text-green-900 flex items-center gap-1"
          >
            <FaFileDownload size={14} /> تحميل
          </a>
        </div>
      </td>
    </tr>
  );
}