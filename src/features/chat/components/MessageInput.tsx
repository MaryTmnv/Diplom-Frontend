import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { TemplateSelector } from '@/features/templates/components/TemplateSelector';  // ← добавили
import { Send, Paperclip, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui';

interface MessageInputProps {
  onSend: (message: string, attachmentIds?: string[]) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  ticketCategory?: string;  // ← добавили для шаблонов
}

export const MessageInput = ({
  onSend,
  onTyping,
  isLoading,
  placeholder = 'Введите сообщение...',
  disabled,
  ticketCategory,  // ← добавили
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);  // ← добавили
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Автоувеличение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Обработка изменения текста
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Индикатор печати
    if (onTyping) {
      onTyping(true);

      // Сбрасываем таймер
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Убираем индикатор через 1 секунду после остановки печати
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  // Отправка сообщения
  const handleSend = () => {
    if (!message.trim() || isLoading || disabled) return;

    onSend(message.trim());
    setMessage('');

    // Убираем индикатор печати
    if (onTyping) {
      onTyping(false);
    }

    // Фокус обратно на textarea
    textareaRef.current?.focus();
  };

  // Обработка Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Вставка шаблона
  const handleTemplateSelect = (content: string) => {
    setMessage(content);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-2">
        {/* Кнопка шаблонов */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setShowTemplates(true)}
          disabled={disabled}
          title="Шаблоны ответов"
        >
          <FileText className="w-5 h-5" />
        </Button>

        {/* Кнопка прикрепления файлов */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          disabled={disabled}
          title="Прикрепить файл"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-2.5',
            'text-sm text-gray-900 placeholder-gray-400',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            'max-h-32 overflow-y-auto'
          )}
          style={{ minHeight: '42px' }}
        />

        {/* Кнопка отправки */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading || disabled}
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Подсказка */}
      <p className="text-xs text-gray-500 mt-2 px-1">
        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
          Enter
        </kbd>{' '}
        — отправить,{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
          Shift + Enter
        </kbd>{' '}
        — новая строка
      </p>

      {/* Модальное окно шаблонов */}
      {showTemplates && (
        <TemplateSelector
          category={ticketCategory}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};
