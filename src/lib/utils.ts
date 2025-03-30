import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createNewMessage(role: 'user' | 'assistant' | 'system', content: string): Message {
  return {
    id: uuidv4(),
    role,
    content,
    createdAt: new Date(),
  };
}