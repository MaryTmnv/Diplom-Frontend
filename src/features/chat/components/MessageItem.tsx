import { Message } from '../types/message.types';
import { formatRelativeTime } from '@/shared/lib/utils/formatters';
import { Check, CheckCheck, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Avatar } from '@/shared/ui';
import { AvatarImage, AvatarFallback } from '@/shared/ui/Avatar';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

export const MessageItem = ({ message, isOwn, showAvatar = true }: MessageItemProps) => {
  const isRead = !!message.readAt;

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Аватар */}
      {showAvatar && (
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={message.author.avatar || undefined} />
          <AvatarFallback className={cn(
            isOwn ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          )}>
            {message.author.firstName[0]}{message.author.lastName[0]}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Сообщение */}
      <div className={cn('flex flex-col max-w-[70%]', isOwn && 'items-end')}>
        {/* Имя автора */}
        {!isOwn && (
          <span className="text-xs text-gray-500 mb-1 px-1">
            {message.author.firstName} {message.author.lastName}
          </span>
        )}

        {/* Контент */}
        <div
          className={cn(
            'px-4 py-2.5 rounded-2xl',
            isOwn
              ? 'bg-primary-600 text-white rounded-tr-sm'
              : 'bg-gray-100 text-gray-900 rounded-tl-sm'
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Вложения */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {message.attachments.map((file) => (
                <a
                  key={file.id}
                  href={`http://localhost:3000${file.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-2 p-2 rounded text-xs',
                    isOwn
                      ? 'bg-primary-700 hover:bg-primary-800'
                      : 'bg-gray-200 hover:bg-gray-300'
                  )}
                >
                  <FileText className="w-3 h-3" />
                  <span className="truncate">{file.fileName}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Время и статус прочтения */}
        <div className={cn(
          'flex items-center gap-1 mt-1 px-1',
          isOwn ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(message.createdAt)}
          </span>
          
          {isOwn && (
            <span className={cn('text-xs', isRead ? 'text-blue-600' : 'text-gray-400')}>
              {isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
