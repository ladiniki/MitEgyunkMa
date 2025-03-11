import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import PropTypes from "prop-types";

const IngredientsModal = ({ isOpen, onClose, onAdd }) => {
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Meglévő hozzávalók betöltése
  useEffect(() => {
    const loadExistingIngredients = async () => {
      if (!isOpen) return;

      try {
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
        //Beállítjuk a mennyiségeket a meglévő hozzávalók alapján
        const existingQuantities = {};
        data.ingredients.forEach((ing) => {
          existingQuantities[ing.name] = ing.quantity;
        });
        setQuantities(existingQuantities);
      } catch (err) {
        console.error("Hiba:", err);
      }
    };

    loadExistingIngredients();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
    }
  }, [isOpen]);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:5000/ingredients${
          searchTerm ? `?search=${searchTerm}` : ""
        }`
      );
      if (!response.ok) {
        throw new Error("Hiba történt a hozzávalók betöltése közben");
      }
      const data = await response.json();
      setIngredients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (isOpen) {
        fetchIngredients();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  const handleQuantityChange = (ingredientName, value) => {
    if ((!quantities[ingredientName] && value) || Number(value) < 1) {
      setQuantities((prev) => ({
        ...prev,
        [ingredientName]: "1",
      }));
    } else {
      setQuantities((prev) => ({
        ...prev,
        [ingredientName]: value,
      }));
    }
  };

  const handleSubmit = () => {
    const selectedIngredients = ingredients
      .filter((ing) => quantities[ing.name])
      .map((ing) => ({
        name: ing.name,
        quantity: quantities[ing.name],
        unit: ing.unit,
        image: ing.image,
      }));

    onAdd(selectedIngredients);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-dark-primary w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[80vh]">
        {/* Fejléc */}
        <div className="flex items-center justify-between p-6 border-b border-orange-100 dark:border-dark-secondary">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Hozzávalók hozzáadása
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-50 dark:hover:bg-dark-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Kereső */}
        <div className="p-6 border-b border-orange-100 dark:border-dark-secondary">
          <div className="relative">
            <input
              type="text"
              placeholder="Keresés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 
                       border-orange-300 dark:border-dark-tertiary
                       focus:border-orange-500 dark:focus:border-dark-tertiary 
                       focus:ring-4 focus:ring-orange-200 dark:focus:ring-dark-tertiary/20
                       bg-white dark:bg-dark-secondary text-gray-800 dark:text-gray-200"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 dark:border-dark-tertiary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 dark:text-red-400 text-center">
                {error}
              </p>
            </div>
          ) : ingredients.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-dark-secondary">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.name}
                  className="flex items-center justify-between gap-3 px-6 py-2.5"
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    {ingredient.name} ({ingredient.unit})
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={quantities[ingredient.name] || ""}
                    onChange={(e) =>
                      handleQuantityChange(ingredient.name, e.target.value)
                    }
                    className="w-16 sm:w-20 px-2 py-1.5 
                             border border-orange-200 dark:border-dark-tertiary rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-dark-tertiary/20
                             focus:border-orange-500 dark:focus:border-dark-tertiary
                             bg-white dark:bg-dark-secondary text-gray-800 dark:text-gray-200"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Nincs találat a keresési feltételeknek megfelelően.
              </p>
            </div>
          )}
        </div>

        {/* Lábléc */}
        <div className="flex-shrink-0 p-6 border-t border-orange-100 dark:border-dark-secondary">
          <button
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-dark-tertiary dark:to-orange-600
                     hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-700
                     text-white py-3 rounded-lg
                     hover:scale-105 transition-all duration-200
                     text-sm sm:text-base font-medium"
            onClick={handleSubmit}
          >
            Hozzáadás
          </button>
        </div>
      </div>
    </div>
  );
};

IngredientsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default IngredientsModal;
