import { createClient } from '@supabase/supabase-js';
import { Message, ChatSession } from '@/types';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveMessage(sessionId: string, message: Message) {
  const { error } = await supabase
    .from('messages')
    .insert({
      id: message.id,
      session_id: sessionId,
      role: message.role,
      content: message.content,
      created_at: message.createdAt.toISOString(),
    });

  if (error) {
    console.error('Error saving message:', error);
  }
}

export async function saveSession(session: ChatSession) {
  const { error } = await supabase
    .from('sessions')
    .insert({
      id: session.id,
      title: session.title,
      created_at: session.createdAt.toISOString(),
    });

  if (error) {
    console.error('Error saving session:', error);
  }
}

export async function getSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }

  return data;
}

export async function getSessionMessages(sessionId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
  
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  
    return data.map((msg) => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant' | 'system', // Type assertion
      content: msg.content,
      createdAt: new Date(msg.created_at),
    }));
  }