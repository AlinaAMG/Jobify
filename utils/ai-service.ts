export const callAI = async (model: string, messages: any[]) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://jouwapp.nl',
        },
        body: JSON.stringify({
          model,
          messages,
          response_format: { type: 'json_object' },
        }),
      }
    );

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      console.error('OpenRouter Error Detail:', data);
      throw new Error(
        data.error?.message || 'De AI stuurde geen resultaat terug.'
      );
    }
    const rawContent = data.choices[0].message.content;

    try {
      // Stap 1: Verwijder eventuele markdown code blocks
      const cleanContent = rawContent.replace(/```json|```/g, '').trim();

      const firstBracket = cleanContent.indexOf('{');
      const lastBracket = cleanContent.lastIndexOf('}');

      if (firstBracket === -1 || lastBracket === -1) {
        throw new Error('Geen geldige JSON gevonden in AI antwoord');
      }

      const jsonString = cleanContent.substring(firstBracket, lastBracket + 1);
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON Parse Fout. Ontvangen content:', rawContent);
      throw new Error(
        'De AI gaf een ongeldig formaat terug. Probeer het nog eens.'
      );
    }
  };
  