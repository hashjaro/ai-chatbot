import { Message } from '@/types';
export async function getAIResponse(messages: Message[]) {
    try {
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  
      const response = await fetch('https://api.xai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.XAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'xai-model',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling xAI API:', error);
      return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
    }
  }