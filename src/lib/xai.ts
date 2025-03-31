import { Message } from '@/types';

export async function getAIResponse(messages: Message[]): Promise<string> {
  const apiKey = process.env.XAI_API_KEY;
  console.log('Attempting to read XAI_API_KEY:', apiKey); // Log the API key (for debugging; remove in production)

  if (!apiKey) {
    throw new Error('XAI_API_KEY is not set in environment variables');
  }

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-2-1212',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`xAI API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from xAI API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('xAI API error:', error);
    throw error;
  }
}