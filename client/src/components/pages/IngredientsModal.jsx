import { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const IngredientsModal = ({ isOpen, onClose, onAdd }) => {
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchIngredients();
    }
  }, [isOpen]);

  const fetchIngredients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5000/ingredients${searchTerm ? `?search=${searchTerm}` : ''}`);
      if (!response.ok) {
        throw new Error('Hiba történt a hozzávalók betöltése közben');
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-[500px] h-[600px] shadow-xl relative flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex-shrink-0 p-6 flex flex-col items-center border-b border-orange-100">
          <img
            src="/mit-egyunk-ma2.png"
            alt="Mit együnk ma?"
            className="w-28 sm:w-40 mb-4"
          />

          <h2 className="text-base sm:text-lg mb-5 text-center px-2">
            Adja meg a rendelkezésre álló hozzávalóit!
          </h2>

          <div className="w-full relative mb-2">
            <input
              type="text"
              placeholder="Hozzávaló keresése..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-orange-200 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-orange-200 
                       focus:border-orange-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          ) : ingredients.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient.name}
                  className="flex items-center justify-between gap-3 px-6 py-2.5"
                >
                  <span className="text-gray-700 text-sm sm:text-base">
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
                             border border-orange-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-orange-200 
                             focus:border-orange-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">
                Nincs találat a keresési feltételeknek megfelelően.
              </p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-6 border-t border-orange-100">
          <button
            className="w-full bg-orange-500 text-white py-3 rounded-lg
                     hover:bg-orange-600 hover:scale-105 transition-all duration-200
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
