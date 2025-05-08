"use client";

import { useState, useEffect, useRef } from "react";
import { FaFileDownload, FaSpinner, FaRobot, FaTimes, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt, FaSearch, FaTh, FaList, FaChevronRight, FaChevronLeft } from "react-icons/fa";

const documentTypes = [
  {
    id: "rental",
    name: "عقد إيجار",
    description: "عقد إيجار قياسي للممتلكات السكنية أو التجارية",
  },
  {
    id: "employment",
    name: "عقد عمل",
    description: "اتفاق بين صاحب العمل والموظف",
  },
  {
    id: "service",
    name: "عقد خدمة",
    description: "للمقاولين المستقلين أو مقدمي الخدمات",
  },
  {
    id: "sales",
    name: "عقد بيع",
    description: "لشراء/بيع البضائع أو العقارات",
  },
  {
    id: "nda",
    name: "اتفاقية عدم إفصاح",
    description: "اتفاقية سرية بين الأطراف",
  },
];

interface GoogleDriveFile {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink: string;
  mimeType: string;
}

export default function GenerateDocumentPage() {
  const [selectedDocType, setSelectedDocType] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<null | {
    url: string;
    name: string;
  }>(null);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{sender: string, text: string}>>([]);
  const [userInput, setUserInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedDocId, setRecommendedDocId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 8 items per page for grid view
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDriveFiles = async () => {
      try {
        const response = await fetch('/api/drive');
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDriveFiles(data.files);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب المستندات');
      } finally {
        setIsLoadingFiles(false);
      }
    };

    fetchDriveFiles();
  }, []);

  useEffect(() => {
    if (isChatbotOpen && chatMessages.length === 0) {
      setChatMessages([{
        sender: "bot",
        text: "مرحبًا! أنا مساعدك للعثور على المستندات القانونية. يمكنك أن تسألني عن أنواع المستندات المتاحة أو طلب المساعدة في اختيار المستند المناسب لك."
      }]);
    }
  }, [chatMessages.length, isChatbotOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const filteredFiles = driveFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFiles = filteredFiles.reduce((acc, file) => {
    const type = file.mimeType.split('/')[0];
    if (!acc[type]) acc[type] = [];
    acc[type].push(file);
    return acc;
  }, {} as Record<string, GoogleDriveFile[]>);

  // Pagination logic
  const getCurrentItems = (files: GoogleDriveFile[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return files.slice(startIndex, endIndex);
  };

  const totalPages = (files: GoogleDriveFile[]) => {
    return Math.ceil(files.length / itemsPerPage);
  };

  const paginate = (pageNumber: number, files: GoogleDriveFile[]) => {
    if (pageNumber > 0 && pageNumber <= totalPages(files)) {
      setCurrentPage(pageNumber);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FaFilePdf className="text-red-500 text-2xl" />;
    if (mimeType.includes("word")) return <FaFileWord className="text-blue-600 text-2xl" />;
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return <FaFileExcel className="text-green-600 text-2xl" />;
    if (mimeType.includes("image")) return <FaFileImage className="text-yellow-500 text-2xl" />;
    return <FaFileAlt className="text-gray-500 text-2xl" />;
  };

  const handleDocTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const docType = e.target.value;
    setSelectedDocType(docType);
    setGeneratedDoc(null);
    setCurrentPage(1); // Reset to first page when document type changes
  };

  const generateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    
    try {
      const template = driveFiles.find(file => 
        file.name.toLowerCase().includes(selectedDocType.toLowerCase()) && 
        file.mimeType === 'application/pdf'
      );

      if (template) {
        setGeneratedDoc({
          url: template.webContentLink || template.webViewLink,
          name: template.name,
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setGeneratedDoc({
          url: "#",
          name: `${selectedDocType}_agreement_${new Date().toISOString().slice(0, 10)}.pdf`,
        });
        setError('لم يتم العثور على قالب جاهز، تم إنشاء مستند افتراضي');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إنشاء المستند');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { sender: "user", text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");
    setIsBotTyping(true);
    setRecommendedDocId(null);

    try {
    
      const response = await fetch('/api/ai', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      setChatMessages(prev => [...prev, { 
        sender: "bot", 
        text: data.response 
      }]);

      if (data.documentId) {
        setRecommendedDocId(data.documentId);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { 
        sender: "bot", 
        text: "عذرًا، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى." 
      }]);
    } finally {
      setIsBotTyping(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">المستندات القانونية المتاحة</h1>
            <p className="text-gray-600 mt-2">
              تصفح المكتبة الكاملة للمستندات القانونية الجاهزة للاستخدام وفقًا للقانون المغربي
            </p>
          </div>
          
          {/* Chatbot Toggle */}
          <button 
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isChatbotOpen ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {isChatbotOpen ? (
              <>
                <FaTimes /> إغلاق المساعد
              </>
            ) : (
              <>
                <FaRobot /> مساعدة
              </>
            )}
          </button>
        </div>

        {/* Chatbot Panel */}
        {isChatbotOpen && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
              <h3 className="font-bold">مساعد المستندات القانونية</h3>
              <button 
                onClick={() => setIsChatbotOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            <div className="h-64 overflow-y-auto p-4">
              {chatMessages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-3 ${message.sender === 'bot' ? 'text-left' : 'text-right'}`}
                >
                  <div className={`inline-block px-4 py-2 rounded-lg ${message.sender === 'bot' ? 'bg-gray-100 text-gray-800' : 'bg-blue-500 text-white'}`}>
                    {message.text.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="text-left mb-3">
                  <div className="inline-block px-4 py-2 rounded-lg bg-gray-100">
                    <FaSpinner className="animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleChatSubmit} className="p-3 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="اكتب استفسارك هنا..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  dir="rtl"
                />
                <button 
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  إرسال
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and View Controls */}
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

        {/* Loading and Error States */}
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

        {/* Documents Display */}
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
                      {getCurrentItems(files).map((file) => {
                        const isRecommended = file.name.toLowerCase().includes(recommendedDocId || '');
                        return (
                          <div 
                            key={file.id} 
                            id={`doc-${file.id}`}
                            className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${isRecommended ? 'bg-green-50' : ''}`}
                          >
                            <div className="flex justify-center mb-3">
                              {getFileIcon(file.mimeType)}
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
                                href={file.webContentLink || file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                              >
                                معاينة
                              </a>
                              <a
                                href={file.webContentLink || file.webViewLink}
                                download={file.name}
                                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center gap-1"
                              >
                                {isGenerating && file.name.includes(selectedDocType) ? (
                                  <FaSpinner className="animate-spin" size={14} />
                                ) : (
                                  <FaFileDownload size={14} />
                                )} تحميل
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Pagination for grid view */}
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
                        {getCurrentItems(files).map((file) => {
                          const isRecommended = file.name.toLowerCase().includes(recommendedDocId || '');
                          return (
                            <tr 
                              key={file.id} 
                              id={`doc-${file.id}`}
                              className={`hover:bg-gray-50 ${isRecommended ? 'bg-green-50' : ''}`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  {getFileIcon(file.mimeType)}
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
                                {file.mimeType.split('/')[1] || file.mimeType}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex gap-2">
                                  <a
                                    href={file.webContentLink || file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    معاينة
                                  </a>
                                  <span>|</span>
                                  <a
                                    href={file.webContentLink || file.webViewLink}
                                    download={file.name}
                                    className="text-green-600 hover:text-green-900 flex items-center gap-1"
                                  >
                                    <FaFileDownload size={14} /> تحميل
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {/* Pagination for list view */}
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Generated Document Section */}
        {generatedDoc && (
          <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h3 className="font-bold text-green-800 mb-2">المستند الذي تم إنشاؤه</h3>
            <div className="flex items-center gap-4">
              <FaFilePdf className="text-red-500 text-2xl" />
              <span className="font-medium">{generatedDoc.name}</span>
              <a 
                href={generatedDoc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-auto px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
              >
                <FaFileDownload /> تحميل المستند
              </a>
            </div>
          </div>
        )}

        {/* Important Notes */}
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