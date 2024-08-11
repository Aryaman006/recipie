import { useState } from 'react';
import fetchRecipes from './Fetch';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);

  const searchRecipes = async () => {
    const results = await fetchRecipes(query);
    setRecipes(results);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Recipe Finder</h1>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a recipe..."
          className="border-2 border-gray-300 p-3 rounded-lg w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={searchRecipes}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg ml-3 hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={recipe.recipe.image} alt={recipe.recipe.label} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-800">{recipe.recipe.label}</h2>
              <p className="text-gray-600 mt-2">Calories: {Math.round(recipe.recipe.calories)}</p>
              <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer" className="block mt-4 text-blue-600 hover:underline">
                View Recipe
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
