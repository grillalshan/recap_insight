import { DailyLog } from '@/types';

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const generateWeeklySummary = async (logs: DailyLog[], apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  if (logs.length === 0) {
    throw new Error('No logs available for summary generation');
  }

  const logsText = logs.map(log => 
    `${log.date}: ${log.content}`
  ).join('\n\n');

  const prompt = `Summarize the following employee work logs into a concise, professional weekly report for a manager. Focus on key achievements, progress made, and important activities. Keep it clear and business-appropriate.

Work Logs:
${logsText}

Please provide a structured summary that highlights the most important work completed during this week.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional assistant that creates clear, concise weekly work summaries for managers. Focus on achievements, progress, and key activities.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from OpenAI');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
    throw new Error('Failed to generate summary: Unknown error');
  }
};