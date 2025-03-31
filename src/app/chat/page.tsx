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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('sessionId') || uuidv4();
    setSessionId(id);

    const loadSession = async () => {
      try {
        // Always save the session to ensure it exists
        const newSession: ChatSession = {
          id,
          title: 'New Chat',
          createdAt: new Date(),
          messages: [],
        };
        await saveSession(newSession);

        // Load existing messages
        const savedMessages = await getSessionMessages(id);
        if (savedMessages.length > 0) {
          setMessages(savedMessages);
        }
      } catch (error) {
        console.error('Error loading session or messages:', error);
        // Optionally redirect to an error page or show a message to the user
      }
    };

    loadSession();
  }, [searchParams]);

  const handleSendMessage = async (content: string) => {
    const userMessage = createNewMessage('user', content);
    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(sessionId, userMessage);

    try {
      const aiResponse = await getAIResponse([...messages, userMessage]);
      const aiMessage = createNewMessage('assistant', aiResponse);
      setMessages((prev) => [...prev, aiMessage]);
      await saveMessage(sessionId, aiMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = createNewMessage(
        'assistant',
        "I'm sorry, I couldn't process your request at the moment. Please try again later."
      );
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessage(sessionId, errorMessage);
    }
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