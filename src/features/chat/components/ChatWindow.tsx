import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Card } from '@/shared/ui';

interface ChatWindowProps {
  ticketId: string;
  ticketNumber?: string;
  ticketCategory?: string;  // ← добавили
  className?: string;
}

export const ChatWindow = ({ 
  ticketId, 
  ticketNumber, 
  ticketCategory,  // ← добавили
  className 
}: ChatWindowProps) => {
  const {
    messages,
    isLoading,
    isConnected,
    typingUsers,
    sendMessage,
    emitTyping,
  } = useChat(ticketId);

  return (
    <Card className={cn('flex flex-col h-[600px]', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-900">Переписка</h3>
          {ticketNumber && (
            <p className="text-xs text-gray-500">Заявка {ticketNumber}</p>
          )}
        </div>

        {/* Статус подключения */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">Онлайн</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-600 font-medium">Оффлайн</span>
            </>
          )}
        </div>
      </div>

      {/* Список сообщений */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Индикатор печати */}
        {typingUsers.length > 0 && (
          <TypingIndicator userName="Оператор" />
        )}
      </div>

      {/* Поле ввода */}
      <MessageInput
        onSend={sendMessage}
        onTyping={emitTyping}
        disabled={!isConnected}
        ticketCategory={ticketCategory}  // ← передаём категорию
        placeholder={
          isConnected
            ? 'Введите сообщение...'
            : 'Подключение к чату...'
        }
      />
    </Card>
  );
};
