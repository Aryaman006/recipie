// src/hooks/useAI.js
const askAI = async (prompt) => {
    try {
      const response = await fetch('/api/askAI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('AI Error:', error);
      return 'Failed to generate response.';
    }
  };
  
  export default askAI;
  