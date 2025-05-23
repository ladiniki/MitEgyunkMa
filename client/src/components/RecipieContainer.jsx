import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import RecipieCard from "./RecipieCard";
import { Search, ChefHat, Utensils, Trophy } from "lucide-react";

/*Betölti a recepteket egy API-ból*/
const RecipieContainer = () => {
  const [recipies, setRecipies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedMealType, searchText } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTransition, setPageTransition] = useState("fade-in");
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  
  //Reszponzív recipesPerPage - 2x4-es elrendezés
  const getRecipesPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 768) return 4;
      if (window.innerWidth < 1024) return 6;
      return 8;
    }
    return 8;
  };

  const [recipesPerPage, setRecipesPerPage] = useState(getRecipesPerPage());

  //Ablakméret változás figyelése
  useEffect(() => {
    const handleResize = () => {
      setRecipesPerPage(getRecipesPerPage());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    setCurrentPage(1);
  }, [selectedMealType]);

  // Nehézségi szint szűrő komponens
  const DifficultyFilter = () => (
    <div className="flex items-center justify-center gap-2 mb-4">
      <button
        onClick={() => setSelectedDifficulty(selectedDifficulty === "könnyű" ? null : "könnyű")}
        className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
          selectedDifficulty === "könnyű"
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : "bg-white dark:bg-dark-secondary text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20"
        }`}
      >
        <ChefHat size={16} className="mr-1" />
        Könnyű
      </button>
      <button
        onClick={() => setSelectedDifficulty(selectedDifficulty === "közepes" ? null : "közepes")}
        className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
          selectedDifficulty === "közepes"
            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
            : "bg-white dark:bg-dark-secondary text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
        }`}
      >
        <Utensils size={16} className="mr-1" />
        Közepes
      </button>
      <button
        onClick={() => setSelectedDifficulty(selectedDifficulty === "haladó" ? null : "haladó")}
        className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
          selectedDifficulty === "haladó"
            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            : "bg-white dark:bg-dark-secondary text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        }`}
      >
        <Trophy size={16} className="mr-1" />
        Haladó
      </button>
    </div>
  );

  //Loading állapot, hogy a felhasználó bejelentkezésig ne lásson semmit
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 dark:border-dark-tertiary"></div>
        </div>
      </div>
    );
  }

  //Szűrjük a recepteket a keresési szöveg és nehézség alapján
  const filteredRecipies = recipies.filter(recipe => {
    const matchesSearch = searchText
      ? recipe.name.toLowerCase().includes(searchText.toLowerCase())
      : true;
    const matchesDifficulty = selectedDifficulty
      ? recipe.difficulty === selectedDifficulty
      : true;
    return matchesSearch && matchesDifficulty;
  });

  //Kiszámoljuk az oldalak számát
  const totalPages = Math.ceil(filteredRecipies.length / recipesPerPage);

  //Kiszámoljuk az aktuális oldalon megjelenítendő recepteket
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipies.slice(
    Math.max(0, indexOfFirstRecipe),
    Math.min(filteredRecipies.length, indexOfLastRecipe)
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPageTransition("fade-out");
      setTimeout(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        setPageTransition("fade-in");
      }, 200);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPageTransition("fade-out");
      setTimeout(() => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
        setPageTransition("fade-in");
      }, 200);
    }
  };

  /*a recipies.map()-al minden receptet a RecipieCard komponensbe jelenítjük meg
  Grid --> kártya elrendezése, görgető*/
  return (
    <div className="px-6 sm:px-10 py-6 min-h-[31.25rem] flex flex-col">
      <DifficultyFilter />
      {filteredRecipies.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center p-8 rounded-2xl bg-white/50 dark:bg-dark-secondary/50 backdrop-blur-sm shadow-sm">
            <Search className="w-12 h-12 text-orange-300 dark:text-dark-tertiary mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-2">
              Nincs találat a keresési feltételekre.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Próbálkozz más kulcsszavakkal vagy szűrőkkel.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`gap-4 sm:gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8 ${pageTransition}`}
          >
            {currentRecipes.map((recipe, index) => (
              <div
                key={`${currentPage}-${index}`}
                className="animate-fade-in-down opacity-0"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <RecipieCard
                  name={recipe.name}
                  cookingTime={recipe.cookingTime}
                  image={recipe.image}
                  mealType={recipe.mealType}
                  difficulty={recipe.difficulty}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 mb-4">
              <div className="inline-flex items-center bg-white dark:bg-dark-secondary shadow-md dark:shadow-dark-tertiary/10 rounded-full px-1 py-1">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    ${
                      currentPage === 1
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-primary"
                    }`}
                  aria-label="Előző oldal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div className="flex items-center px-2">
                  <button className="w-8 h-8 flex items-center justify-center rounded-full transition-colors mx-0.5 bg-orange-500 dark:bg-dark-tertiary text-white">
                    {currentPage}
                  </button>

                  <div className="flex items-center ml-2 text-gray-500 dark:text-gray-400">
                    <span className="text-xs text-gray-400 dark:text-gray-500 mx-1">
                      /
                    </span>
                    <span>{totalPages}</span>
                  </div>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    ${
                      currentPage === totalPages
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-primary"
                    }`}
                  aria-label="Következő oldal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lapozó animáció */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.4s ease-out forwards;
        }

        .fade-in {
          opacity: 1;
          transition: opacity 0.2s ease-in;
        }

        .fade-out {
          opacity: 0;
          transition: opacity 0.2s ease-out;
        }
      `,
        }}
      />
    </div>
  );
};

export default RecipieContainer;
