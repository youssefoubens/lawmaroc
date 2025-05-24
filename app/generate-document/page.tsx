"use client";

import { useState, useEffect, useRef } from "react";
import { FaFileDownload, FaSpinner, FaRobot, FaTimes, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt, FaSearch, FaTh, FaList, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType?: string;
  webContentLink?: string;
  webViewLink?: string;
}

export default function GenerateDocumentPage() {
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [recommendedDocId, setRecommendedDocId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDriveFiles = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        const cachedData = localStorage.getItem('driveFilesCache');
        
        if (cachedData) {
          setDriveFiles(JSON.parse(cachedData));
          setIsLoadingFiles(false);
          return;
        }
        
        const response = await fetch('/api/n8n');
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        
        const data = await response.json();
        const files = Array.isArray(data) ? data : data.files || [];
        
        localStorage.setItem('driveFilesCache', JSON.stringify(files));
        setDriveFiles(files);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب المستندات');
      } finally {
        setIsLoadingFiles(false);
      }
    };
  
    fetchDriveFiles();
  }, []);

  useEffect(() => {
    if (isChatbotOpen && chatContainerRef.current) {
      const chat = createChat({
        webhookUrl: 'https://benziad.app.n8n.cloud/webhook/e9adfc1e-b514-4eef-996b-1fa6d6e14053/chat',
        container: chatContainerRef.current,
        config: {
          theme: {
            primaryColor: '#10B981',
            headerColor: '#10B981',
            headerTextColor: '#FFFFFF',
          },
          context: {
            documents: driveFiles,
          },
        },
        hooks: {
          onMessageReceived: (message) => {
            if (message.documentId) {
              setRecommendedDocId(message.documentId);
            }
          },
        },
      });

      return () => {
        chat.destroy();
      };
    }
  }, [isChatbotOpen, driveFiles]);

  useEffect(() => {
    if (recommendedDocId) {
      const element = document.getElementById(`doc-${recommendedDocId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('animate-pulse', 'ring-2', 'ring-green-500');
        setTimeout(() => {
          element.classList.remove('animate-pulse', 'ring-2', 'ring-green-500');
        }, 3000);
      }
    }
  }, [recommendedDocId]);

  const filteredFiles = driveFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFiles = filteredFiles.reduce((acc, file) => {
    const type = file.mimeType?.split('/')[0] || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(file);
    return acc;
  }, {} as Record<string, GoogleDriveFile[]>);

  const getCurrentItems = (files: GoogleDriveFile[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return files.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (files: GoogleDriveFile[]) => Math.ceil(files.length / itemsPerPage);

  const paginate = (pageNumber: number, files: GoogleDriveFile[]) => {
    const pages = totalPages(files);
    if (pageNumber > 0 && pageNumber <= pages) {
      setCurrentPage(pageNumber);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === "pdf") return <FaFilePdf className="text-red-500 text-2xl" />;
    if (extension === "doc" || extension === "docx") return <FaFileWord className="text-blue-600 text-2xl" />;
    if (extension === "xls" || extension === "xlsx") return <FaFileExcel className="text-green-600 text-2xl" />;
    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) return <FaFileImage className="text-yellow-500 text-2xl" />;
    return <FaFileAlt className="text-gray-500 text-2xl" />;
  };

  const renderDocumentCard = (file: GoogleDriveFile) => {
    const isRecommended = recommendedDocId === file.id;
    return (
      <div 
        key={file.id} 
        id={`doc-${file.id}`}
        className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${isRecommended ? 'bg-green-50' : ''}`}
      >
        <div className="flex justify-center mb-3">
          {getFileIcon(file.name)}
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
  };

  const renderDocumentRow = (file: GoogleDriveFile) => {
    const isRecommended = recommendedDocId === file.id;
    return (
      <tr 
        key={file.id} 
        id={`doc-${file.id}`}
        className={`hover:bg-gray-50 ${isRecommended ? 'bg-green-50' : ''}`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            {getFileIcon(file.name)}
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
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">المستندات القانونية المتاحة</h1>
            <p className="text-gray-600 mt-2">
              تصفح المكتبة الكاملة للمستندات القانونية الجاهزة للاستخدام وفقًا للقانون المغربي
            </p>
          </div>
          
          <button 
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isChatbotOpen ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {isChatbotOpen ? <><FaTimes /> إغلاق المساعد</> : <><FaRobot /> مساعدة</>}
          </button>
        </div>

        {isChatbotOpen && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
              <h3 className="font-bold">مساعد المستندات القانونية</h3>
              <button onClick={() => setIsChatbotOpen(false)} className="text-white hover:text-gray-200">
                <FaTimes />
              </button>
            </div>
            <div ref={chatContainerRef} className="h-96"></div>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن مستند..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                dir="rtl"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === "grid" ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FaTh /> عرض شبكي
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === "list" ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FaList /> عرض قائمة
              </button>
            </div>
          </div>
        </div>

        {isLoadingFiles && (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center gap-2">
              <FaSpinner className="animate-spin text-4xl text-green-500" />
              <p className="text-gray-600">جاري تحميل المستندات...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {!isLoadingFiles && !error && (
          <div className="space-y-8">
            {Object.entries(groupedFiles).map(([type, files]) => (
              <div key={type} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">
                    {type === "application" ? "مستندات" : 
                     type === "image" ? "صور" : 
                     type === "video" ? "فيديوهات" : 
                     "ملفات أخرى"}
                  </h3>
                </div>
                
                {viewMode === "grid" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                      {getCurrentItems(files).map(renderDocumentCard)}
                    </div>
                    {totalPages(files) > 1 && (
                      <div className="flex justify-center items-center p-4 border-t border-gray-200">
                        <button
                          onClick={() => paginate(currentPage - 1, files)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 mx-1 rounded border border-gray-300 disabled:opacity-50"
                        >
                          <FaChevronRight />
                        </button>
                        {Array.from({ length: totalPages(files) }, (_, i) => i + 1).map(number => (
                          <button
                            key={number}
                            onClick={() => paginate(number, files)}
                            className={`px-3 py-1 mx-1 rounded ${currentPage === number ? 'bg-green-500 text-white' : 'border border-gray-300'}`}
                          >
                            {number}
                          </button>
                        ))}
                        <button
                          onClick={() => paginate(currentPage + 1, files)}
                          disabled={currentPage === totalPages(files)}
                          className="px-3 py-1 mx-1 rounded border border-gray-300 disabled:opacity-50"
                        >
                          <FaChevronLeft />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
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
                        {getCurrentItems(files).map(renderDocumentRow)}
                      </tbody>
                    </table>
                    {totalPages(files) > 1 && (
                      <div className="flex justify-center items-center p-4 border-t border-gray-200">
                        {/* Pagination controls same as grid view */}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold text-blue-800 mb-2">ملاحظات هامة</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>يمكنك معاينة المستندات قبل تحميلها بالنقر على زر معاينة</li>
            <li>استخدم مربع البحث للعثور على مستندات محددة بسرعة</li>
            <li>يمكنك التبديل بين العرض الشبكي والعرض القائمة حسب تفضيلاتك</li>
            <li>للمسائل القانونية المعقدة، نوصي باستشارة محام مرخص</li>
          </ul>
        </div>
      </div>
    </div>
  );
}