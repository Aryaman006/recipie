export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("Prompt received:", prompt);

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 seconds

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.1-24b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000, // Reduced tokens
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter Error:', errorText);

      return new Response(
        JSON.stringify({ error: `OpenRouter Error: ${errorText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const errorText = await response.text();
      throw new Error(`Unexpected response format: ${errorText}`);
    }

    console.log("AI Response:", data);

    const result = data.choices?.[0]?.message?.content;
    if (!result) {
      throw new Error('Empty response from AI');
    }

    const formattedResult = result.split('\n').filter(line => line.trim() !== '');

    return new Response(
      JSON.stringify({ result: formattedResult }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API Error:', error.message);

    return new Response(
      JSON.stringify({ error: `Server Error: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
