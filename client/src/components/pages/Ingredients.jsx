import { useState } from "react";
import IngredientsModal from "./IngredientsModal";
import RecipieCard from "../RecipieCard";
import { Plus } from "lucide-react";

const Ingredients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTransition, setPageTransition] = useState('fade');

  // Reszponzív itemsPerPage - megtartjuk a 2x4-es elrendezést
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2; // Mobil: 1x2
      if (window.innerWidth < 768) return 4; // Tablet: 2x2
      if (window.innerWidth < 1024) return 6; // Kisebb desktop: 3x2
      return 8; // Nagy képernyő: 4x2
    }
    return 8; // Alapértelmezett
  };

  const [itemsPerPage] = useState(getItemsPerPage());

  const handleAddIngredients = (newIngredients) => {
    setIngredients(newIngredients);
    setIsModalOpen(false);
    setCurrentPage(1); // Visszaállítjuk az első oldalra új hozzávalók hozzáadásakor
  };

  // Lapozás kezelése
  const totalPages = Math.ceil(ingredients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ingredients.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPageTransition('fade-out');
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setPageTransition('fade-in');
      }, 200);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPageTransition('fade-out');
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setPageTransition('fade-in');
      }, 200);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] relative p-4 flex flex-col">
        {ingredients.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-600">
              Jelenleg üres a hozzávalóid listája.
            </p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 ${pageTransition === 'fade-in' ? 'animate-fade-in' : pageTransition === 'fade-out' ? 'animate-fade-out' : ''}`}>
              {currentItems.map((ingredient, index) => (
                <RecipieCard
                  key={index}
                  name={ingredient.name}
                  quantity={ingredient.quantity}
                  unit={ingredient.unit}
                  image={ingredient.image}
                />
              ))}
            </div>

            {/* Lapozó */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center py-4">
                <div className="inline-flex items-center bg-white shadow-md rounded-full px-1 py-1">
                  {/* Előző gomb */}
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || pageTransition === 'fade-out'}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                      ${currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="Előző oldal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Oldalszámok */}
                  <div className="flex items-center px-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-medium">
                      {currentPage}
                    </div>
                    <div className="flex items-center ml-2 text-gray-500">
                      <span className="text-xs text-gray-400 mx-1">/</span>
                      <span>{totalPages}</span>
                    </div>
                  </div>
                  
                  {/* Következő gomb */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || pageTransition === 'fade-out'}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors
                      ${currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'}`}
                    aria-label="Következő oldal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="fixed bottom-8 right-8">
          <button
            className="w-14 h-14 bg-orange-500 text-white rounded-full 
                       hover:bg-orange-600 hover:scale-105 shadow-lg
                       transition-all duration-200 flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
            aria-label="Hozzávalók hozzáadása"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <IngredientsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddIngredients}
      />

      {/* CSS animációk */}
      <style jsx>{`
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
      `}</style>
    </>
  );
};

export default Ingredients;
