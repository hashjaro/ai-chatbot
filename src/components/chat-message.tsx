'use client';

import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        'p-3 my-2 rounded-md max-w-[80%]',
        message.role === 'user'
          ? 'bg-primary text-primary-foreground ml-auto'
          : 'bg-muted text-muted-foreground'
      )}
    >
      <p>{message.content}</p>
      <span className="text-xs opacity-70">
        {message.createdAt.toLocaleTimeString()}
      </span>
    </div>
  );
}