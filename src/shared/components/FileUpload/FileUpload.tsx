import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, FileText, Loader2, Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { formatFileSize } from '@/shared/lib/utils/formatters';
import { validateFile } from '@/shared/lib/utils/validators';
import toast from 'react-hot-toast';
import axios from 'axios';
import { env } from '@/shared/config/env';

// Типизация ответа от сервера
interface UploadedFileResponse {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
}

interface FileUploadProps {
  onUpload: (fileIds: string[]) => void;
  maxSize?: number;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  className?: string;
}

interface UploadedFileInfo {
  id: string;
  file: File;
  preview?: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

export const FileUpload = ({
  onUpload,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  accept = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  multiple = true,
  className,
}: FileUploadProps) => {
  const [files, setFiles] = useState<UploadedFileInfo[]>([]);

  // Загрузка файлов на сервер
  const uploadToServer = async (filesToUpload: File[]): Promise<string[]> => {
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await axios.post<UploadedFileResponse[]>(  // ← типизация
        `${env.apiUrl}/files/upload-multiple`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.map((file) => file.id);  // ← теперь типизировано
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Проверяем лимит файлов
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`Максимум ${maxFiles} файлов`);
        return;
      }

      // Валидация каждого файла
      const validFiles: File[] = [];

      acceptedFiles.forEach((file) => {
        const validation = validateFile(file);

        if (!validation.valid) {
          toast.error(`${file.name}: ${validation.error}`);
          return;
        }

        validFiles.push(file);
      });

      if (validFiles.length === 0) return;

      // Добавляем файлы в состояние как "загружаются"
      const newFiles: UploadedFileInfo[] = validFiles.map((file) => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        uploading: true,
        uploaded: false,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Загружаем на сервер
      try {
        const uploadedIds = await uploadToServer(validFiles);

        // Обновляем статус файлов
        setFiles((prev) => {
          const updated = [...prev];
          const startIndex = prev.length - validFiles.length;
          
          validFiles.forEach((_, index) => {
            const fileIndex = startIndex + index;
            if (updated[fileIndex]) {
              updated[fileIndex] = {
                ...updated[fileIndex],
                id: uploadedIds[index],
                uploading: false,
                uploaded: true,
              };
            }
          });
          
          return updated;
        });

        // Возвращаем все загруженные ID
        const allUploadedIds = files
          .filter((f) => f.uploaded)
          .map((f) => f.id)
          .concat(uploadedIds);
        
        onUpload(allUploadedIds);

        toast.success(`Загружено файлов: ${validFiles.length}`);
      } catch (error) {
        // Удаляем файлы при ошибке
        setFiles((prev) =>
          prev.filter((f) => !newFiles.find((nf) => nf.id === f.id))
        );
        toast.error('Ошибка загрузки файлов');
      }
    },
    [files, maxFiles, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    const uploadedIds = newFiles.filter((f) => f.uploaded).map((f) => f.id);
    onUpload(uploadedIds);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type === 'application/pdf') return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className={className}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        )}
      >
        <input {...getInputProps()} />

        <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />

        {isDragActive ? (
          <p className="text-sm text-primary-600 font-medium">
            Отпустите файлы здесь...
          </p>
        ) : (
          <div>
            <p className="text-sm text-gray-700 font-medium mb-1">
              Перетащите файлы сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-500">
              Максимум {maxFiles} файлов, до {formatFileSize(maxSize)} каждый
            </p>
          </div>
        )}
      </div>

      {/* Список загруженных файлов */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((uploadedFile, index) => (
            <div
              key={uploadedFile.id}
              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              {/* Preview или иконка */}
              {uploadedFile.preview ? (
                <img
                  src={uploadedFile.preview}
                  alt={uploadedFile.file.name}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded text-gray-500">
                  {getFileIcon(uploadedFile.file)}
                </div>
              )}

              {/* Информация о файле */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {uploadedFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(uploadedFile.file.size)}
                </p>
              </div>

              {/* Статус загрузки */}
              {uploadedFile.uploading && (
                <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
              )}

              {uploadedFile.uploaded && (
                <div className="text-green-600">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {uploadedFile.error && (
                <span className="text-xs text-red-600">{uploadedFile.error}</span>
              )}

              {/* Кнопка удаления */}
              {!uploadedFile.uploading && (
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Удалить файл"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
