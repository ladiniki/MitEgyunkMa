import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import RecipieCard from "./RecipieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*Betölti a recepteket egy API-ból*/
const RecipieContainer = () => {
  const [recipies, setRecipies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedMealType, searchText } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  // Reszponzív recipesPerPage - megtartjuk a 2x4-es elrendezést, de kisebb képernyőn kevesebb recept
  const getRecipesPerPage = () => {
    // Csak kliens oldalon működik
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2; // Mobil: 1x2
      if (window.innerWidth < 768) return 4; // Tablet: 2x2
      if (window.innerWidth < 1024) return 6; // Kisebb desktop: 3x2
      return 8; // Nagy képernyő: 4x2
    }
    return 8; // Alapértelmezett
  };
  
  const [recipesPerPage, setRecipesPerPage] = useState(getRecipesPerPage());

  // Ablakméret változás figyelése
  useEffect(() => {
    const handleResize = () => {
      setRecipesPerPage(getRecipesPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchRecipies = async () => {
      try {
        const url = selectedMealType 
          ? `http://localhost:5000/recipies?mealType=${selectedMealType}`
          : "http://localhost:5000/recipies";
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipies:", error);
        setLoading(false);
      }
    };

    fetchRecipies();
    setCurrentPage(1); // Visszaállítjuk az első oldalra, ha változik a szűrés
  }, [selectedMealType]);

  /*Loading állapot, hogy a felhasználó bejelentkezésig ne lásson semmit*/
  if (loading) {
    return (
      <div className="px-6 sm:px-10 py-6 min-h-[500px] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  // Szűrjük a recepteket a keresési szöveg alapján
  const filteredRecipies = searchText
    ? recipies.filter(recipe => 
        recipe.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : recipies;

  // Kiszámoljuk az oldalak számát
  const totalPages = Math.ceil(filteredRecipies.length / recipesPerPage);
  
  // Kiszámoljuk az aktuális oldalon megjelenítendő recepteket
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipies.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // Lapozás kezelése
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  /*a recipies.map()-al minden receptet a RecipieCard komponensbe jelenítjük meg
  Grid --> kártya elrendezése, görgető*/
  return (
    <div className="px-6 sm:px-10 py-6 min-h-[500px] flex flex-col">
      {filteredRecipies.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Nincs találat a keresési feltételekre.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Nyilak a konténer szélein, de nem lógnak rá a kártyákra */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center absolute w-full top-1/2 -translate-y-1/2 px-4 pointer-events-none">
              <button 
                onClick={handlePrevPage} 
                disabled={currentPage === 1}
                className={`pointer-events-auto z-10 ${currentPage === 1 ? 'opacity-0' : 'opacity-90 hover:opacity-100'}
                  w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center
                  transition-all duration-300 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300`}
                aria-label="Előző oldal"
              >
                <ChevronLeft size={18} className={`${currentPage === 1 ? 'text-gray-300' : 'text-orange-500'}`} />
              </button>
              
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages}
                className={`pointer-events-auto z-10 ${currentPage === totalPages ? 'opacity-0' : 'opacity-90 hover:opacity-100'}
                  w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center
                  transition-all duration-300 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300`}
                aria-label="Következő oldal"
              >
                <ChevronRight size={18} className={`${currentPage === totalPages ? 'text-gray-300' : 'text-orange-500'}`} />
              </button>
            </div>
          )}

          {/* Reszponzív grid elrendezés - nagyobb térközzel */}
          <div className="gap-4 sm:gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
            {currentRecipes.map((recipe, index) => (
              <RecipieCard
                key={index}
                name={recipe.name}
                cookingTime={recipe.cookingTime}
                image={recipe.image}
                mealType={recipe.mealType}
                difficulty={recipe.difficulty}
              />
            ))}
          </div>
          
          {/* Modernebb lapozó navigáció középen alul */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-2 mb-2">
              <div className="bg-white shadow-md rounded-full px-3 py-1 text-sm text-gray-600 flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      currentPage === i + 1
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-orange-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipieContainer;
