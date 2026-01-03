import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, FileText, X, Loader2 } from 'lucide-react';
import { Button, Textarea } from '@/shared/ui';
import { useAuthStore } from '@/features/auth/store/authStore';
import { UserRole } from '@/shared/types/user.types';
import toast from 'react-hot-toast';
import { TemplateSelector } from '@/features/templates/components/TemplateSelector';

// Тип для шаблона
interface Template {
  id: string;
  title: string;
  content: string;
  category?: string;
  usageCount?: number;
}

interface MessageInputProps {
  onSend: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onTemplateSelect?: (template: Template) => void;
}

export const MessageInput = ({
  onSend,
  isLoading = false,
  placeholder = 'Введите сообщение...',
  disabled = false,
  onTemplateSelect,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Получаем роль пользователя с правильной типизацией
  const { user } = useAuthStore();
  const isOperator = 
    user?.role === UserRole.OPERATOR || 
    user?.role === UserRole.SPECIALIST ||
    user?.role === UserRole.MANAGER;

  const handleSend = () => {
    if (!message.trim() && files.length === 0) return;
    if (disabled || isLoading) return;

    onSend(message.trim(), files.length > 0 ? files : undefined);
    setMessage('');
    setFiles([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      // Максимум 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Файл ${file.name} слишком большой (макс. 10MB)`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles].slice(0, 5)); // Максимум 5 файлов
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t bg-gradient-to-b from-white to-gray-50 p-4">
      {/* Toolbar - показываем только для операторов */}
      {isOperator && (
        <div className="flex items-center gap-2 mb-3">
          {/* Кнопка шаблонов */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(true)}
            disabled={disabled}
            className="gap-2 text-[#0077b6] hover:bg-[#caf0f8]/50"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Шаблоны</span>
          </Button>
        </div>
      )}

      {/* Превью прикреплённых файлов */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-[#caf0f8] text-[#0077b6] px-3 py-1.5 rounded-lg text-sm"
            >
              <Paperclip className="w-3 h-3" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="hover:bg-[#ade8f4] rounded p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Поле ввода */}
      <div className="flex items-end gap-2">
        {/* Textarea */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="min-h-[44px] max-h-[200px] resize-none border-[#90e0ef]/30 focus:border-[#0077b6] focus:ring-[#0077b6]/20"
            rows={1}
          />
        </div>

        {/* Кнопка прикрепления файлов */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading || files.length >= 5}
          className="shrink-0 text-[#023e8a] hover:bg-[#caf0f8]/50 hover:text-[#0077b6]"
          title="Прикрепить файл"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Кнопка отправки */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={disabled || isLoading || (!message.trim() && files.length === 0)}
          className="shrink-0 bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#023e8a] hover:to-[#03045e]"
          title="Отправить сообщение"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Подсказка */}
      <p className="text-xs text-[#023e8a]/60 mt-2">
        <kbd className="px-1.5 py-0.5 bg-[#caf0f8]/30 rounded text-xs">Enter</kbd> для отправки,{' '}
        <kbd className="px-1.5 py-0.5 bg-[#caf0f8]/30 rounded text-xs">Shift + Enter</kbd> для новой строки
      </p>

      {/* Модалка с шаблонами (только для операторов) */}
      {isOperator && showTemplates && (
        <TemplateSelector
          onSelect={(template: Template) => {
            setMessage(template.content);
            setShowTemplates(false);
            onTemplateSelect?.(template);
            textareaRef.current?.focus();
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};
