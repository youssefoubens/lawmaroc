import { 
    FaFilePdf, 
    FaFileWord, 
    FaFileExcel, 
    FaFileImage, 
    FaFileAlt 
  } from "react-icons/fa";
  
  interface FileIconProps {
    fileName: string;
    className?: string;
  }
  
  export default function FileIcon({ fileName, className = "" }: FileIconProps) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === "pdf") return <FaFilePdf className={`text-red-500 ${className}`} />;
    if (extension === "doc" || extension === "docx") return <FaFileWord className={`text-blue-600 ${className}`} />;
    if (extension === "xls" || extension === "xlsx") return <FaFileExcel className={`text-green-600 ${className}`} />;
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) return <FaFileImage className={`text-yellow-500 ${className}`} />;
    return <FaFileAlt className={`text-gray-500 ${className}`} />;
  }