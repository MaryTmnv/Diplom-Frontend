import { TicketCategory } from '@/features/tickets/types/tickets.types';
import { z } from 'zod';

export const createTicketSchema = z.object({
  title: z
    .string()
    .min(5, 'Минимум 5 символов')
    .max(200, 'Максимум 200 символов'),
  
  description: z
    .string()
    .min(10, 'Минимум 10 символов')
    .max(5000, 'Максимум 5000 символов'),
  
  category: z
    .nativeEnum(TicketCategory)
    .refine((val) => Object.values(TicketCategory).includes(val), {
      message: 'Выберите категорию',
    }),
  
  attachmentIds: z.array(z.string()).optional(),
  
  contextData: z.record(z.string(), z.any()).optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
