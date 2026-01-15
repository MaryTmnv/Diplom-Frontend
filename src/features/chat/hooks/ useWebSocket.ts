import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/features/auth/store/authStore';

// Убираем /api из URL для WebSocket
const WEBSOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace('/api', '');

export const useWebSocket = (ticketId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken || !ticketId) {
      console.warn('⚠️ WebSocket: No token or ticketId');
      return;
    }

    // Подключаемся к namespace /chat
    const socketUrl = `${WEBSOCKET_URL}/chat`;
    console.log('🔌 WebSocket: Connecting to', socketUrl);

    const newSocket = io(socketUrl, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;

    // События подключения
    newSocket.on('connect', () => {
      console.log('✅ WebSocket: Connected', newSocket.id);
      setIsConnected(true);

      // Присоединяемся к комнате заявки (правильный формат!)
      newSocket.emit('join-ticket', { ticketId });
      console.log(`📥 WebSocket: Joining ticket room ${ticketId}`);
    });

    newSocket.on('connected', (data) => {
      console.log('✅ WebSocket: Server confirmed connection', data);
    });

    newSocket.on('joined-ticket', (data) => {
      console.log('✅ WebSocket: Joined ticket room', data);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket: Disconnected', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 WebSocket: Connection error', error);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 WebSocket: Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      
      // Повторно присоединяемся к комнате (правильный формат!)
      newSocket.emit('join-ticket', { ticketId });
    });

    newSocket.on('error', (error) => {
      console.error('🔴 WebSocket: Error', error);
    });

    // Cleanup
    return () => {
      console.log('🔌 WebSocket: Disconnecting...');
      if (socketRef.current) {
        socketRef.current.emit('leave-ticket', { ticketId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken, ticketId]);

  return {
    socket: socketRef.current,
    isConnected,
  };
};
