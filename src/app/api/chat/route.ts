import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/xai';
import { Message } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 }
      );
    }

    const aiResponse = await getAIResponse(messages as Message[]);
    return NextResponse.json({ content: aiResponse });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}