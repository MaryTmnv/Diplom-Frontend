import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { Paperclip, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Template } from '@/features/templates/types/template.types';

interface MessageInputProps {
  onSend: (message: string, files?: File[]) => void;
  onTyping?: () => void; // ← Добавили!
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onTemplateSelect?: (template: Template) => void;
}

export const MessageInput = ({
  onSend,
  onTyping, // ← Добавили!
  isLoading = false,
  placeholder = 'Введите сообщение...',
  disabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Автоувеличение высоты textarea
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
    
    // Вызываем onTyping при вводе текста
    if (onTyping && e.target.value.trim()) {
      onTyping();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Валидация файлов
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize) {
        toast.error(`Файл "${file.name}" слишком большой (максимум 10MB)`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Тип файла "${file.name}" не поддерживается`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!message.trim() && files.length === 0) || isLoading || disabled) {
      return;
    }

    try {
      // Отправляем сообщение с файлами
      onSend(message.trim(), files);
      
      // Очищаем поля
      setMessage('');
      setFiles([]);
      
      // Сбрасываем высоту textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Ошибка отправки сообщения');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[#90e0ef]/30 bg-white p-4">
      {/* Превью файлов */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-[#caf0f8]/30 text-[#023e8a] px-3 py-2 rounded-lg text-sm border border-[#90e0ef]/30"
            >
              <Paperclip className="w-4 h-4" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-[#023e8a]/50 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Поле ввода */}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="w-full resize-none rounded-xl border border-[#90e0ef] bg-white px-4 py-3 pr-12 text-[#03045e] placeholder-[#023e8a]/40 focus:border-[#0077b6] focus:ring-2 focus:ring-[#0077b6]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '48px', maxHeight: '200px' }}
          />
          
          {/* Кнопка прикрепления файла */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="absolute right-3 bottom-3 text-[#023e8a]/50 hover:text-[#0077b6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/jpeg,image/png,image/gif,application/pdf,text/plain"
          />
        </div>

        {/* Кнопка отправки */}
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && files.length === 0) || isLoading || disabled}
          className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] hover:from-[#0096c7] hover:to-[#0077b6] text-white rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Подсказка */}
      <p className="text-xs text-[#023e8a]/50 mt-2">
        <kbd className="px-1.5 py-0.5 bg-[#caf0f8]/30 rounded text-[#0077b6] font-mono">Enter</kbd> — отправить, 
        <kbd className="px-1.5 py-0.5 bg-[#caf0f8]/30 rounded text-[#0077b6] font-mono ml-1">Shift+Enter</kbd> — новая строка
      </p>
    </div>
  );
};
