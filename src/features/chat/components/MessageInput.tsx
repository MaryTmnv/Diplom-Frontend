import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { TemplateSelector } from '@/features/templates/components/TemplateSelector';
import { Send, Paperclip, FileText, Smile } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui';

interface MessageInputProps {
  onSend: (message: string, attachmentIds?: string[]) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  ticketCategory?: string;
}

export const MessageInput = ({
  onSend,
  onTyping,
  isLoading,
  placeholder = 'Введите сообщение...',
  disabled,
  ticketCategory,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Автоувеличение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Обработка изменения текста
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Индикатор печати
    if (onTyping) {
      onTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

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

    if (onTyping) {
      onTyping(false);
    }

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

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="border-t bg-gradient-to-b from-white to-gray-50 p-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3">
        {/* Кнопка шаблонов */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowTemplates(true)}
          disabled={disabled}
          className="gap-2"
        >
          <FileText className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Шаблоны</span>
        </Button>

        {/* Кнопка прикрепления файлов */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Paperclip className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Файлы</span>
        </Button>

        {/* Эмодзи (placeholder) */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <Smile className="w-4 h-4" />
        </Button>
      </div>

      {/* Input area */}
      <div className={cn(
        'flex items-end gap-2 p-3 rounded-xl border-2 transition-all duration-200',
        isFocused 
          ? 'border-primary-500 bg-white shadow-lg ring-4 ring-primary-100' 
          : 'border-gray-300 bg-white shadow-sm'
      )}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent',
            'text-sm text-gray-900 placeholder-gray-400',
            'focus:outline-none',
            'max-h-[120px] overflow-y-auto',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          style={{ minHeight: '24px' }}
        />

        {/* Кнопка отправки */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          className={cn(
            'shrink-0 transition-all duration-200',
            canSend 
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 shadow-md hover:shadow-lg hover:scale-105' 
              : 'bg-gray-300'
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Подсказка */}
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-gray-500">
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
            Enter
          </kbd>{' '}
          — отправить,{' '}
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
            Shift + Enter
          </kbd>{' '}
          — новая строка
        </p>

        {/* Счётчик символов */}
        {message.length > 0 && (
          <span className={cn(
            'text-xs',
            message.length > 1000 ? 'text-red-600 font-semibold' : 'text-gray-500'
          )}>
            {message.length} / 2000
          </span>
        )}
      </div>

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
