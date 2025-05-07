import { useState, useEffect } from 'react';

export const useGoogleDriveDocuments = () => {
  const [files, setFiles] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/n8n/google-drive');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch');
        setFiles(data.files);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return { files, loading, error };
};