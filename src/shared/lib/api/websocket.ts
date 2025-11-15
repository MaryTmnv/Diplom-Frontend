import { io, Socket } from 'socket.io-client';
import { env } from '@/shared/config/env';

let chatSocket: Socket | null = null;
let notificationsSocket: Socket | null = null;

// ========== CHAT SOCKET ==========
export const initChatSocket = (token: string): Socket => {
  if (chatSocket?.connected) {
    return chatSocket;
  }

  chatSocket = io(`${env.wsUrl}/chat`, {  // ← добавлен /chat namespace
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  chatSocket.on('connect', () => {
    console.log('✅ Chat WebSocket connected');
  });

  chatSocket.on('disconnect', (reason) => {
    console.log('❌ Chat WebSocket disconnected:', reason);
  });

  chatSocket.on('connect_error', (error) => {
    console.error('🔴 Chat WebSocket connection error:', error);
  });

  chatSocket.on('error', (error) => {
    console.error('🔴 Chat WebSocket error:', error);
  });

  return chatSocket;
};

export const disconnectChatSocket = (): void => {
  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
    console.log('🔌 Chat WebSocket disconnected manually');
  }
};

export const getChatSocket = (): Socket | null => chatSocket;

// ========== NOTIFICATIONS SOCKET ==========
export const initNotificationsSocket = (token: string): Socket => {
  if (notificationsSocket?.connected) {
    return notificationsSocket;
  }

  notificationsSocket = io(`${env.wsUrl}/notifications`, {  // ← добавлен /notifications namespace
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  notificationsSocket.on('connect', () => {
    console.log('✅ Notifications WebSocket connected');
    // Автоматически подписываемся
    notificationsSocket?.emit('subscribe');
  });

  notificationsSocket.on('disconnect', (reason) => {
    console.log('❌ Notifications WebSocket disconnected:', reason);
  });

  return notificationsSocket;
};

export const disconnectNotificationsSocket = (): void => {
  if (notificationsSocket) {
    notificationsSocket.disconnect();
    notificationsSocket = null;
    console.log('🔌 Notifications WebSocket disconnected manually');
  }
};

export const getNotificationsSocket = (): Socket | null => notificationsSocket;

// ========== УТИЛИТЫ ==========

// Присоединиться к заявке
export const joinTicket = (ticketId: string): void => {
  chatSocket?.emit('join-ticket', { ticketId });
};

// Покинуть заявку
export const leaveTicket = (ticketId: string): void => {
  chatSocket?.emit('leave-ticket', { ticketId });
};

// Индикатор печати
export const emitTyping = (ticketId: string, isTyping: boolean): void => {
  chatSocket?.emit('typing', { ticketId, isTyping });
};
