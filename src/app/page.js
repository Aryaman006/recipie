'use client';

import { useState } from 'react';
import fetchRecipes from '@/api/fetchRecipes';
import Loading from '@/components/Loading';
import AIResponse from '@/components/AIResponse';
import RecipeCard from '@/components/recipeCrad';

const Home = () => {
  const [query, setQuery] = useState('');
  const [servings, setServings] = useState(4);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState([]);

  // 🔎 Fetch recipes from Edamam API
  const handleSearch = async () => {
    if (!query) return;
    try {
      setLoading(true);
      const results = await fetchRecipes(query);
      setRecipes(results);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      alert('Failed to fetch recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 💡 Ask AI for dynamic recipe details
  const handleAskAI = async () => {
    if (!query) return;
    try {
      const response = await fetch('/api/askAI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `How to make ${query} for ${servings} people? Include ingredients, instructions, and calories.`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      setAiResponse(data.result); // ✅ Store AI response
    } catch (error) {
      console.error('AI Error:', error);
      alert('Failed to get AI response. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* 🏷️ Heading */}
      <h1 className="text-4xl font-bold text-center mb-8">Recipe Finder</h1>

      {/* ✅ Search & AI Prompt */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a recipe..."
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none"
        />
        <input
          type="number"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          placeholder="Servings"
          className="border border-gray-300 p-3 rounded-lg w-24 focus:outline-none"
          min="1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
        <button
          onClick={handleAskAI}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Ask AI
        </button>
      </div>

      {/* ✅ Render AI Response */}
      {aiResponse.length > 0 && <AIResponse response={aiResponse} />}

      {/* ✅ Render Recipe Results */}
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe.recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
