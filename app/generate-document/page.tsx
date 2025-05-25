"use client";

import { useState, useEffect } from "react";

import { useDriveFiles } from "../hooks/useDriveFiles";
import DocumentBrowser from "../components/DocumentBrowser";
import ChatbotButton from "../components/Chatbot/ChatbotButton";
import ChatbotWindow from "../components/Chatbot/ChatbotWindow";
import SearchBar from "../components/UI/SearchBar";
import ViewToggle from "../components/UI/ViewToggle";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import {  ViewMode } from "../components/types";

export default function GenerateDocumentPage() {
  const { driveFiles, isLoading, error } = useDriveFiles();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [recommendedDocId, setRecommendedDocId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

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


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <Header 
          isChatbotOpen={isChatbotOpen}
          onToggleChatbot={() => setIsChatbotOpen(!isChatbotOpen)}
        />
        
        <ChatbotWindow
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
          files={driveFiles}
          onDocumentRecommended={setRecommendedDocId}
        />

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <ViewToggle 
              currentView={viewMode}
              onViewChange={setViewMode}
            />
          </div>
        </div>

        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <DocumentBrowser
            files={filteredFiles}
            viewMode={viewMode}
            recommendedDocId={recommendedDocId}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}

        <ImportantNotes />
      </div>
    </div>
  );
}

const Header = ({ isChatbotOpen, onToggleChatbot }: { 
  isChatbotOpen: boolean; 
  onToggleChatbot: () => void 
}) => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-800">المستندات القانونية المتاحة</h1>
      <p className="text-gray-600 mt-2">
        تصفح المكتبة الكاملة للمستندات القانونية الجاهزة للاستخدام وفقًا للقانون المغربي
      </p>
    </div>
    <ChatbotButton 
      isOpen={isChatbotOpen}
      onClick={onToggleChatbot}
    />
  </div>
);

const ImportantNotes = () => (
  <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
    <h3 className="font-bold text-blue-800 mb-2">ملاحظات هامة</h3>
    <ul className="list-disc list-inside text-blue-700 space-y-1">
      <li>يمكنك معاينة المستندات قبل تحميلها بالنقر على زر معاينة</li>
      <li>استخدم مربع البحث للعثور على مستندات محددة بسرعة</li>
      <li>يمكنك التبديل بين العرض الشبكي والعرض القائمة حسب تفضيلاتك</li>
      <li>للمسائل القانونية المعقدة، نوصي باستشارة محام مرخص</li>
    </ul>
  </div>
);