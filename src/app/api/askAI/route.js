export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("Prompt received:", prompt);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.1-24b-instruct:free', // ✅ Correct model ID
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000, // ✅ Lowered to avoid token limit issues
      }),
    });

    // ✅ Better error handling
    if (!response.ok) {
      const errorText = await response.text(); // Read response as text for debugging
      console.error('OpenRouter Error:', errorText);

      return new Response(
        JSON.stringify({ error: `OpenRouter Error: ${errorText}` }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log("AI Response:", data);

    const result = data.choices[0]?.message?.content;

    if (!result) {
      throw new Error('Empty response from AI');
    }

    // ✅ Convert the result into an array (split by newlines)
    const formattedResult = result.split('\n').filter(line => line.trim() !== '');

    return new Response(
      JSON.stringify({ result: formattedResult }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API Error:', error.message);

    return new Response(
      JSON.stringify({ error: `Server Error: ${error.message}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
