import { io, Socket } from 'socket.io-client';
import { env } from '../../config/env';


let socket: Socket | null = null;

export const initWebSocket = (token: string): Socket => {
  // Если уже подключены - возвращаем существующий сокет
  if (socket?.connected) {
    return socket;
  }

  // Создаём новое подключение
  socket = io(env.wsUrl, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  // Обработчики событий
  socket.on('connect', () => {
    console.log('✅ WebSocket connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('🔴 WebSocket connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('🔴 WebSocket error:', error);
  });

  return socket;
};

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 WebSocket disconnected manually');
  }
};

export const getSocket = (): Socket | null => socket;

// Утилиты для работы с комнатами
export const joinRoom = (roomId: string): void => {
  socket?.emit('join-room', roomId);
};

export const leaveRoom = (roomId: string): void => {
  socket?.emit('leave-room', roomId);
};
