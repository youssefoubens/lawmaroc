export interface GoogleDriveFile {
    id: string;
    name: string;
    mimeType?: string;
    webContentLink?: string;
    webViewLink?: string;
  }
  
  export type ViewMode = "grid" | "list";