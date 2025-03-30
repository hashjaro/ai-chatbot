'use client';

import { Message } from '@/types';
import { ChatMessage } from './chat-message';

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="w-full max-w-2xl h-[calc(100vh-200px)] overflow-y-auto p-4 bg-white rounded-md shadow-md">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
}