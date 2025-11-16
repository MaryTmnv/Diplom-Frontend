import { useEffect, useRef } from 'react';
import { Message } from '../types/message.types';
import { MessageItem } from './MessageItem';
import { useAuthStore } from '@/features/auth/store/authStore';
import { cn } from '@/shared/lib/utils/cn';
import { Skeleton } from '@/shared/ui';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  // Автоскролл к последнему сообщению
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Проверяем, был ли пользователь внизу списка
    const isScrolledToBottom = 
      container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

    if (isScrolledToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={cn('flex gap-3', i % 2 === 0 ? 'flex-row-reverse' : 'flex-row')}>
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-2 flex-1 max-w-[70%]">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div className="max-w-sm">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Начните переписку
          </p>
          <p className="text-sm text-gray-600">
            Отправьте первое сообщение, и оператор скоро ответит
          </p>
        </div>
      </div>
    );
  }

  // Группировка сообщений по дате
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div ref={messagesContainerRef} className="h-full overflow-y-auto chat-scrollbar">
      <div className="p-4 space-y-6">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* Разделитель по дате */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                {date}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Сообщения */}
            <div className="space-y-1">
              {msgs.map((message, index) => {
                const isOwn = message.authorId === user?.id;
                const prevMessage = msgs[index - 1];
                const nextMessage = msgs[index + 1];
                
                // Проверяем, нужно ли показывать аватар
                const showAvatar = !nextMessage || nextMessage.authorId !== message.authorId;
                const isFirstInGroup = !prevMessage || prevMessage.authorId !== message.authorId;

                return (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isOwn={isOwn}
                    showAvatar={showAvatar}
                    isFirstInGroup={isFirstInGroup}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Якорь для автоскролла */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
