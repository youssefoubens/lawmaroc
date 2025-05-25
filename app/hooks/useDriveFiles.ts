import { useState, useEffect } from "react";
import { GoogleDriveFile } from "../components/types";

export const useDriveFiles = () => {
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriveFiles = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        const cachedData = localStorage.getItem('driveFilesCache');
        
        if (cachedData) {
          setDriveFiles(JSON.parse(cachedData));
          setIsLoading(false);
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
        setIsLoading(false);
      }
    };
  
    fetchDriveFiles();
  }, []);

  return { driveFiles, isLoading, error };
};