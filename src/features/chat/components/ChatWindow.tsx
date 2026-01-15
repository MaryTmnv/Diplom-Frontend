import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { chatApi } from '../api/chatApi';
import toast from 'react-hot-toast';
import { Wifi, WifiOff, Hash } from 'lucide-react';
import { getCategoryLabel, getCategoryIcon } from '@/features/tickets/utils/ticketHelpers';
import type { TicketCategory } from '@/features/tickets/types/tickets.types';
import { cn } from '@/shared/lib/utils/cn';

interface ChatWindowProps {
  ticketId: string;
  currentUserId: string;
  ticketNumber?: string; 
  ticketCategory?: TicketCategory; 
  className?: string; 
  title?: string
}

export const ChatWindow = ({ 
  ticketId, 
  currentUserId,
  ticketNumber,
  ticketCategory,
  className,
  title = 'Чат с клиентом'
}: ChatWindowProps) => {
  const { 
    messages, 
    isLoading, 
    isConnected, 
    typingUsers,
    sendMessage, 
    isSending,
    emitTyping,
  } = useChat(ticketId);

  const handleSendMessage = async (content: string, files?: File[]) => {
    try {
      // 1. Загружаем файлы (если есть)
      let attachmentIds: string[] = [];
      
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => chatApi.uploadAttachment(file));
        const uploadedFiles = await Promise.all(uploadPromises);
        attachmentIds = uploadedFiles.map((f) => f.id);
      }

      // 2. Отправляем сообщение с ID вложений
      sendMessage({
        content,
        attachmentIds:  attachmentIds ? attachmentIds : undefined,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Ошибка отправки сообщения');
    }
  };

  const CategoryIcon = ticketCategory ? getCategoryIcon(ticketCategory) : null;

  return (
    <div className={cn(
      "flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden border border-[#90e0ef]/30",
      className
    )}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0077b6] to-[#023e8a] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg">{title}</h3>
              
              {/* Номер заявки */}
              {ticketNumber && (
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
                  <Hash className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">{ticketNumber}</span>
                </div>
              )}

              {/* Категория */}
              {ticketCategory && CategoryIcon && (
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg">
                  <CategoryIcon/>
                  <span className="text-sm">{getCategoryLabel(ticketCategory)}</span>
                </div>
              )}
            </div>

            {/* Индикатор "печатает" */}
            {typingUsers.length > 0 && (
              <p className="text-xs text-white/70 mt-2 flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                {typingUsers.join(', ')} печатает...
              </p>
            )}
          </div>

          {/* Статус подключения */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-sm">Онлайн</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-sm">Офлайн</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages || []}
          currentUserId={currentUserId}
          isLoading={isLoading}
        />
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSendMessage}
        onTyping={emitTyping}
        isLoading={isSending}
        disabled={!isConnected}
      />
    </div>
  );
};
