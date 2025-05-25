import { useEffect, useRef } from "react";
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';
import { GoogleDriveFile } from "../types";
import { FaTimes } from "react-icons/fa";

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
  files: GoogleDriveFile[];
  onDocumentRecommended: (docId: string) => void;
}

export default function ChatbotWindow({
  isOpen,
  onClose,
  files,
  onDocumentRecommended
}: ChatbotWindowProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
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
            documents: files,
          },
        },
        hooks: {
          onMessageReceived: (message: { documentId: string }) => {
            if (message.documentId) {
              onDocumentRecommended(message.documentId);
            }
          },
        },
      });

      return () => {
        chat.unmount();
      };
    }
  }, [isOpen, files, onDocumentRecommended]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
      <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">مساعد المستندات القانونية</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <FaTimes />
        </button>
      </div>
      <div ref={chatContainerRef} className="h-96"></div>
    </div>
  );
}