export interface UploadedFileResponse {
  id: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  mimeType: string;
  extension: string;
  isImage: boolean;
  url: string;
  createdAt: string;
}
