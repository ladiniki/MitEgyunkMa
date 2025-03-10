import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import RecipieCard from "./RecipieCard";
import { Search } from "lucide-react";

/*Betölti a recepteket egy API-ból*/
const RecipieContainer = () => {
  const [recipies, setRecipies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedMealType, searchText } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTransition, setPageTransition] = useState("fade");
  // Reszponzív recipesPerPage - megtartjuk a 2x4-es elrendezést, de kisebb képernyőn kevesebb recept
  const getRecipesPerPage = () => {
    // Csak kliens oldalon működik
    if (typeof window !== "undefined") {
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
    setCurrentPage(1); // Visszaállítjuk az első oldalra, ha változik a szűrés
  }, [selectedMealType]);

  /*Loading állapot, hogy a felhasználó bejelentkezésig ne lásson semmit*/
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      </div>
    );
  }

  // Szűrjük a recepteket a keresési szöveg alapján
  const filteredRecipies = searchText
    ? recipies.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : recipies;

  // Kiszámoljuk az oldalak számát
  const totalPages = Math.ceil(filteredRecipies.length / recipesPerPage);

  // Kiszámoljuk az aktuális oldalon megjelenítendő recepteket
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipies.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  // Lapozás kezelése egyszerű fade effekttel
  const handlePageClick = pageNumber => {
    if (pageNumber !== currentPage) {
      setPageTransition("fade-out");
      setTimeout(() => {
        setCurrentPage(pageNumber);
        setPageTransition("fade-in");
      }, 200);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPageTransition("fade-out");
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setPageTransition("fade-in");
      }, 200);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPageTransition("fade-out");
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setPageTransition("fade-in");
      }, 200);
    }
  };

  /*a recipies.map()-al minden receptet a RecipieCard komponensbe jelenítjük meg
  Grid --> kártya elrendezése, görgető*/
  return (
    <div className="px-6 sm:px-10 py-6 min-h-[31.25rem] flex flex-col">
      {filteredRecipies.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm">
            <Search className="w-12 h-12 text-orange-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium mb-2">
              Nincs találat a keresési feltételekre.
            </p>
            <p className="text-gray-400 text-sm">
              Próbálkozz más kulcsszavakkal vagy szűrőkkel.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Reszponzív grid elrendezés egyszerű fade animációval */}
          <div
            className={`gap-4 sm:gap-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8 ${
              pageTransition === "fade-in"
                ? "animate-fade-in"
                : pageTransition === "fade-out"
                ? "animate-fade-out"
                : ""
            }`}
          >
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

          {/* Finomított, modern lapozó */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 mb-4">
              <div className="inline-flex items-center bg-white shadow-md rounded-full px-1 py-1">
                {/* Előző gomb */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || pageTransition === "fade-out"}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
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

                {/* Oldalszámok */}
                <div className="flex items-center px-2">
                  {/* Aktuális oldal */}
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full transition-colors mx-0.5 bg-orange-500 text-white"
                  >
                    {currentPage}
                  </button>

                  {/* Elválasztó és utolsó oldal */}
                  <div className="flex items-center ml-2 text-gray-500">
                    <span className="text-xs text-gray-400 mx-1">/</span>
                    <span>{totalPages}</span>
                  </div>
                </div>

                {/* Következő gomb */}
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage === totalPages || pageTransition === "fade-out"
                  }
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                    ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
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

      {/* CSS animációk */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        
        .animate-fade-in {
          animation: fadeIn 300ms ease-in-out forwards;
        }
        
        .animate-fade-out {
          animation: fadeOut 200ms ease-in-out forwards;
        }
      `}} />
    </div>
  );
};

export default RecipieContainer;
