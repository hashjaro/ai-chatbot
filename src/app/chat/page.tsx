'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChatWindow } from '@/components/chat-window';
import { ChatInput } from '@/components/chat-input';
import { Message, ChatSession } from '@/types';
import { createNewMessage } from '@/lib/utils';
import { getAIResponse } from '@/lib/xai';
import { saveMessage, saveSession, getSessionMessages } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('sessionId') || uuidv4();
    setSessionId(id);

    const loadMessages = async () => {
      const savedMessages = await getSessionMessages(id);
      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        const newSession: ChatSession = {
          id,
          title: 'New Chat',
          createdAt: new Date(),
          messages: [],
        };
        await saveSession(newSession);
      }
    };

    loadMessages();
  }, [searchParams]);

  const handleSendMessage = async (content: string) => {
    const userMessage = createNewMessage('user', content);
    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(sessionId, userMessage);

    const aiResponse = await getAIResponse([...messages, userMessage]);
    const aiMessage = createNewMessage('assistant', aiResponse);
    setMessages((prev) => [...prev, aiMessage]);
    await saveMessage(sessionId, aiMessage);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Chat</h1>
      <ChatWindow messages={messages} />
      <div className="w-full max-w-2xl mt-4">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}