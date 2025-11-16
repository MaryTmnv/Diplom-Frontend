import { Message } from '../types/message.types';
import { formatRelativeTime } from '@/shared/lib/utils/formatters';
import { Check, CheckCheck, FileText, Download } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Avatar } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  isFirstInGroup?: boolean;
}

export const MessageItem = ({ 
  message, 
  isOwn, 
  showAvatar = true,
  isFirstInGroup = true 
}: MessageItemProps) => {
  const isRead = !!message.readAt;

  return (
    <div
      className={cn(
        'flex gap-3 mb-1 animate-slide-up',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Аватар */}
      {showAvatar ? (
        <Avatar className="w-8 h-8 shrink-0 shadow-sm">
          <AvatarImage src={message.author.avatar || undefined} />
          <AvatarFallback className={cn(
            'font-semibold text-xs',
            isOwn 
              ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
              : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700'
          )}>
            {message.author.firstName[0]}{message.author.lastName[0]}
          </AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-8 shrink-0" /> // Пустое место для выравнивания
      )}

      {/* Сообщение */}
      <div className={cn('flex flex-col max-w-[75%]', isOwn && 'items-end')}>
        {/* Имя автора */}
        {!isOwn && isFirstInGroup && (
          <span className="text-xs font-medium text-gray-600 mb-1 px-1">
            {message.author.firstName} {message.author.lastName}
            <span className="text-gray-400 ml-1">• {message.author.role}</span>
          </span>
        )}

        {/* Контент */}
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl shadow-sm',
            'transition-all duration-200',
            isOwn
              ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-tr-md'
              : 'bg-white text-gray-900 border border-gray-200 rounded-tl-md hover:shadow-md'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>

          {/* Вложения */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((file) => (
                <a
                  key={file.id}
                  href={`http://localhost:3000${file.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-lg text-xs group',
                    'transition-all duration-200',
                    isOwn
                      ? 'bg-primary-700/50 hover:bg-primary-700'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate flex-1 font-medium">{file.fileName}</span>
                  <Download className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Время и статус прочтения */}
        <div className={cn(
          'flex items-center gap-1.5 mt-1 px-1',
          isOwn ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(message.createdAt)}
          </span>
          
          {isOwn && (
            <span className={cn(
              'flex items-center',
              isRead ? 'text-primary-600' : 'text-gray-400'
            )}>
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
