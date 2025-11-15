
// Type guards для проверки типов в runtime
import { TicketCategory, TicketPriority, TicketStatus } from "../../../features/tickets/types/tycket.types";
import { UserRole } from "../../types/user.types";

export const isTicketStatus = (value: unknown): value is TicketStatus => {
  return Object.values(TicketStatus).includes(value as TicketStatus);
};

export const isTicketPriority = (value: unknown): value is TicketPriority => {
  return Object.values(TicketPriority).includes(value as TicketPriority);
};

export const isTicketCategory = (value: unknown): value is TicketCategory => {
  return Object.values(TicketCategory).includes(value as TicketCategory);
};

export const isUserRole = (value: unknown): value is UserRole => {
  return Object.values(UserRole).includes(value as UserRole);
};


export const getEnumKeys = <T extends Record<string, string>>(
  enumObj: T
): (keyof T)[] => {
  return Object.keys(enumObj) as (keyof T)[];
};
