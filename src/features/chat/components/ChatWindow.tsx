import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { Wifi, WifiOff, Users } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Card } from '@/shared/ui';

interface ChatWindowProps {
  ticketId: string;
  ticketNumber?: string;
  ticketCategory?: string;
  className?: string;
}

export const ChatWindow = ({ 
  ticketId, 
  ticketNumber, 
  ticketCategory,
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
    <Card className={cn('flex flex-col overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Переписка
          </h3>
          {ticketNumber && (
            <p className="text-xs text-gray-500 mt-0.5">
              Заявка {ticketNumber}
            </p>
          )}
        </div>

        {/* Статус подключения */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
          isConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        )}>
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Онлайн</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Оффлайн</span>
            </>
          )}
        </div>
      </div>

      {/* Список сообщений */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Индикатор печати */}
        {typingUsers.length > 0 && (
          <div className="px-4 pb-2">
            <TypingIndicator userName="Оператор" />
          </div>
        )}
      </div>

      {/* Поле ввода */}
      <MessageInput
        onSend={sendMessage}
        onTyping={emitTyping}
        disabled={!isConnected}
        ticketCategory={ticketCategory}
        placeholder={
          isConnected
            ? 'Введите сообщение...'
            : 'Подключение к чату...'
        }
      />
    </Card>
  );
};
