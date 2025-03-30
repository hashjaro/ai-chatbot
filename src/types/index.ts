export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date;
  }
  
  export interface ChatSession {
    id: string;
    title: string;
    createdAt: Date;
    messages: Message[];
  }