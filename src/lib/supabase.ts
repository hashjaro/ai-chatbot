import { createClient } from '@supabase/supabase-js';
import { Message, ChatSession } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveSession(session: ChatSession) {
  const { error } = await supabase.from('sessions').upsert({
    id: session.id,
    title: session.title,
    created_at: session.createdAt.toISOString(),
  });

  if (error) {
    console.error('Error saving session:', error);
  }
}

export async function saveMessage(sessionId: string, message: Message) {
  const { error } = await supabase.from('messages').insert({
    session_id: sessionId,
    role: message.role,
    content: message.content,
  });

  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }
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
  
    return data.map((msg: any) => ({
      id: msg.id.toString(),
      role: msg.role,
      content: msg.content,
      createdAt: new Date(msg.created_at),
    }));
  }