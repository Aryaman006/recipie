import { useState } from 'react';
import fetchRecipes from './Fetch';
import Loading from './Loading';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  const searchRecipes = async () => {
    setLoading(true);
    const results = await fetchRecipes(query);
    setRecipes(results);
    setLoading(false);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

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
        {currentRecipes.map((recipe, index) => (
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

      <div className="flex justify-center mt-6 space-x-2">
  <button
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
    className={`py-2 px-4 rounded-lg ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 transition'}`}
  >
    <FaArrowLeft/>
  </button>
  
  {[...Array(Math.ceil(recipes.length / recipesPerPage)).keys()].map(number => (
    <button
      key={number + 1}
      onClick={() => paginate(number + 1)}
      className={`py-2 px-4 rounded-lg`}
    >
      {number + 1}
    </button>
  ))}
  
  <button
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === Math.ceil(recipes.length / recipesPerPage)}
    className={`py-2 px-4 rounded-lg ${currentPage === Math.ceil(recipes.length / recipesPerPage) ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 transition'}`}
  >
    <FaArrowRight/>
  </button>
</div>
     
    </div>
  );
}

export default App;
