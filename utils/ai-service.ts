export const callAI = async (model: string, messages: any[]) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://jouwapp.nl', // Optioneel voor OpenRouter rankings
      },
      body: JSON.stringify({
        model,
        messages,
        response_format: { type: 'json_object' },
      }),
    });
    
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content.replace(/```json|```/g, ''));
  };
  