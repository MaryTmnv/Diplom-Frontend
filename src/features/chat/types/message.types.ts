import { Attachment } from "@/features/tickets/types/tickets.types";

export interface Message {
  id: string;
  ticketId: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    role: string;
  };
  content: string;
  isInternal: boolean;
  createdAt: string;
  readAt?: string | null;
  attachments: Attachment[];
}

export interface SendMessageDto {
  content: string;
  attachmentIds?: string[];
  isInternal?: boolean;
}

export interface TypingEvent {
  userId: string;
  ticketId: string;
  isTyping: boolean;
}

export interface MessageReadEvent {
  messageId: string;
  readAt: string;
  readBy: string;
}
