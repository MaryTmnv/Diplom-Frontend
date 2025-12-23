import { ReactNode, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, FileText, Loader2, Check, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { formatFileSize } from '@/shared/lib/utils/formatters';
import { validateFile } from '@/shared/lib/utils/validators';
import toast from 'react-hot-toast';
import axios from 'axios';
import { env } from '@/shared/config/env';
import { Button } from '@/shared/ui';

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
  progress: ReactNode;
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
        progress: 0,
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

  const clearAllFiles = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  event.stopPropagation();
  
  // Очищаем все файлы
  setFiles([]);
  
  // Опционально: показать уведомление
  // toast.success('Все файлы удалены');
};

  return (
    <div className={className}>
  {/* Dropzone */}
  <div
    {...getRootProps()}
    className={cn(
      'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 overflow-hidden',
      isDragActive
        ? 'border-[#0077b6] bg-gradient-to-br from-[#caf0f8]/50 to-[#ade8f4]/30 scale-[1.02]'
        : 'border-[#90e0ef] hover:border-[#48cae4] bg-gradient-to-br from-[#caf0f8]/20 to-[#ade8f4]/10 hover:bg-[#caf0f8]/30'
    )}
  >
    <input {...getInputProps()} />

    {/* Decorative background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0077b6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

    {/* Icon */}
    <div className={cn(
      'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300',
      isDragActive
        ? 'bg-gradient-to-br from-[#0077b6] to-[#023e8a] shadow-lg scale-110'
        : 'bg-[#90e0ef]/30'
    )}>
      <Upload className={cn(
        'w-8 h-8 transition-colors',
        isDragActive ? 'text-white' : 'text-[#0077b6]'
      )} />
    </div>

    {isDragActive ? (
      <div>
        <p className="text-base font-bold text-[#0077b6] mb-1">
          Отпустите файлы здесь
        </p>
        <p className="text-sm text-[#023e8a]/60">
          Файлы будут загружены автоматически
        </p>
      </div>
    ) : (
      <div>
        <p className="text-base font-semibold text-[#03045e] mb-2">
          Перетащите файлы сюда или нажмите для выбора
        </p>
        <p className="text-sm text-[#023e8a]/60 mb-1">
          Максимум {maxFiles} {maxFiles === 1 ? 'файл' : 'файлов'}, до {formatFileSize(maxSize)} каждый
        </p>
        <p className="text-xs text-[#023e8a]/40">
          Поддерживаются: изображения, документы, архивы
        </p>
      </div>
    )}
  </div>

  {/* Список загруженных файлов */}
  {files.length > 0 && (
    <div className="mt-5 space-y-3">
      <div className="flex items-center justify-between px-2">
        <p className="text-sm font-semibold text-[#03045e]">
          Загружено файлов: {files.length}
        </p>
        {files.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFiles}
            className="h-7 text-xs text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Удалить все
          </Button>
        )}
      </div>

      {files.map((uploadedFile, index) => (
        <div
          key={uploadedFile.id}
          className={cn(
            'group flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200',
            uploadedFile.error
              ? 'bg-red-50 border-red-200'
              : uploadedFile.uploaded
              ? 'bg-green-50 border-green-200'
              : 'bg-white border-[#90e0ef]/30 hover:border-[#48cae4] hover:shadow-md'
          )}
        >
          {/* Preview или иконка */}
          {uploadedFile.preview ? (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md shrink-0">
              <img
                src={uploadedFile.preview}
                alt={uploadedFile.file.name}
                className="w-full h-full object-cover"
              />
              {uploadedFile.uploaded && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
          ) : (
            <div className={cn(
              'w-12 h-12 flex items-center justify-center rounded-xl shadow-md shrink-0',
              uploadedFile.error
                ? 'bg-red-100'
                : uploadedFile.uploaded
                ? 'bg-green-100'
                : 'bg-[#90e0ef]/30'
            )}>
              {getFileIcon(uploadedFile.file)}
            </div>
          )}

          {/* Информация о файле */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#03045e] truncate mb-1">
              {uploadedFile.file.name}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-[#023e8a]/60">
                {formatFileSize(uploadedFile.file.size)}
              </p>
              
              {uploadedFile.uploading && (
                <>
                  <span className="text-xs text-[#023e8a]/40">•</span>
                  <p className="text-xs text-[#0077b6] font-medium">
                    Загрузка... {uploadedFile.progress}%
                  </p>
                </>
              )}
              
              {uploadedFile.uploaded && (
                <>
                  <span className="text-xs text-[#023e8a]/40">•</span>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Загружено
                  </p>
                </>
              )}
            </div>

            {/* Progress bar */}
            {uploadedFile.uploading && (
              <div className="mt-2 h-1.5 bg-[#90e0ef]/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0077b6] to-[#00b4d8] transition-all duration-300"
                  style={{ width: `${uploadedFile.progress || 0}%` }}
                />
              </div>
            )}

            {/* Error message */}
            {uploadedFile.error && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {uploadedFile.error}
              </p>
            )}
          </div>

          {/* Статус и действия */}
          <div className="flex items-center gap-2 shrink-0">
            {uploadedFile.uploading && (
              <Loader2 className="w-5 h-5 text-[#0077b6] animate-spin" />
            )}

            {uploadedFile.uploaded && !uploadedFile.error && (
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
            )}

            {/* Кнопка удаления */}
            {!uploadedFile.uploading && (
              <button
                onClick={() => removeFile(index)}
                className="w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Удалить файл"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};
