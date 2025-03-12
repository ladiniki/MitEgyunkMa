import { useState, useEffect } from "react";
import IngredientsModal from "./IngredientsModal";
import RecipieCard from "../RecipieCard";
import { Plus, Search, Trash2 } from "lucide-react";

const Ingredients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTransition, setPageTransition] = useState("fade");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Reszponzív itemsPerPage - 2x4-es elrendezés
  const getItemsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 2; //Mobil: 1x2
      if (window.innerWidth < 768) return 4; //Tablet: 2x2
      if (window.innerWidth < 1024) return 6; //Kisebb desktop: 3x2
      return 8;
    }
    return 8;
  };

  const [itemsPerPage] = useState(getItemsPerPage());

  //Hozzávalók betöltése
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("Nincs bejelentkezve!");
        }

        const response = await fetch("http://localhost:5000/user/ingredients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Hiba történt a hozzávalók betöltése közben");
        }

        const data = await response.json();
        setIngredients(data.ingredients);
      } catch (err) {
        setError(err.message);
        console.error("Hiba:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleAddIngredients = async (newIngredients) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("Nincs bejelentkezve!");
      }

      //Frissítjük a meglévő hozzávalókat az újakkal
      const updatedIngredients = [...ingredients];

      newIngredients.forEach((newIng) => {
        const existingIndex = updatedIngredients.findIndex(
          (ing) => ing.name === newIng.name
        );
        if (existingIndex !== -1) {
          // Ha már létezik, frissítjük a mennyiséget
          updatedIngredients[existingIndex] = newIng;
        } else {
          // Ha még nem létezik, hozzáadjuk
          updatedIngredients.push(newIng);
        }
      });

      const response = await fetch("http://localhost:5000/user/ingredients", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: updatedIngredients,
        }),
      });

      if (!response.ok) {
        throw new Error("Hiba történt a hozzávalók mentése közben");
      }

      setIngredients(updatedIngredients);
      setIsModalOpen(false);
      setCurrentPage(1);
    } catch (err) {
      console.error("Hiba:", err);
      alert(err.message);
    }
  };

  const handleRemoveIngredient = async (name) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("Nincs bejelentkezve!");
      }

      const response = await fetch(
        "http://localhost:5000/user/ingredients/remove",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Hiba történt a hozzávaló törlése közben");
      }

      //Frissítjük a helyi állapotot
      setIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.name !== name)
      );
    } catch (err) {
      console.error("Hiba:", err);
      alert(err.message);
    }
  };

  //Mennyiség változás kezelése
  const handleQuantityChange = async (name, newQuantity) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        throw new Error("Nincs bejelentkezve!");
      }

      const updatedIngredients = ingredients.map((ing) =>
        ing.name === name ? { ...ing, quantity: newQuantity } : ing
      );

      if (newQuantity === 0) {
        await handleRemoveIngredient(name);
        return;
      }

      //Küldjük a frissített listát a szervernek
      const response = await fetch("http://localhost:5000/user/ingredients", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: updatedIngredients,
        }),
      });

      if (!response.ok) {
        throw new Error("Hiba történt a mennyiség módosítása közben");
      }

      setIngredients(updatedIngredients);
    } catch (err) {
      console.error("Hiba:", err);
      alert(err.message);
    }
  };

  //Lapozás kezelése
  const totalPages = Math.ceil(ingredients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ingredients.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPageTransition("fade-out");
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setPageTransition("fade-in");
      }, 200);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPageTransition("fade-out");
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setPageTransition("fade-in");
      }, 200);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl flex justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] relative p-4 flex flex-col">
        {ingredients.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-sm">
              <Search className="w-12 h-12 text-orange-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium mb-2">
                Még nincsenek hozzávalóid.
              </p>
              <p className="text-gray-400 text-sm">
                Adj hozzá hozzávalókat a + gomb megnyomásával!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 ${
                pageTransition === "fade-in"
                  ? "animate-fade-in"
                  : pageTransition === "fade-out"
                  ? "animate-fade-out"
                  : ""
              }`}
            >
              {currentItems.map((ingredient, index) => (
                <div key={index} className="relative group">
                  <RecipieCard
                    name={ingredient.name}
                    quantity={ingredient.quantity}
                    unit={ingredient.unit}
                    image={ingredient.image}
                    onQuantityChange={handleQuantityChange}
                  />
                  <button
                    onClick={() => handleRemoveIngredient(ingredient.name)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 backdrop-blur-sm text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white shadow-sm"
                    aria-label="Hozzávaló törlése"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Lapozó */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="inline-flex items-center bg-white dark:bg-dark-secondary shadow-md dark:shadow-dark-tertiary/10 rounded-full px-1 py-1">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1 || pageTransition === "fade-out"}
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
                    disabled={currentPage === totalPages || pageTransition === "fade-out"}
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
    </>
  );
};

export default Ingredients;
