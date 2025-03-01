import { useState } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const ingredientsList = [
  { name: "Bors", unit: "csomag", image: "fekete-bors-egesz.webp" },
  { name: "Krumpli", unit: "db", image: "krumpli.jpg" },
  { name: "Kukorica", unit: "db", image: "kukorica.jpg" },
  { name: "Káposzta", unit: "db", image: "tukortojás.jpg" },
  { name: "Liszt", unit: "dkg", image: "csokitorta.jpeg" },
];

const IngredientsModal = ({ isOpen, onClose, onAdd }) => {
  const [quantities, setQuantities] = useState({});

  if (!isOpen) return null;

  const handleQuantityChange = (ingredientName, value) => {
    // Ha a mező üres volt és most kap először értéket, vagy
    // ha az érték kisebb mint 1, akkor 1-et állítunk be
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
    const ingredients = ingredientsList
      .filter((ing) => quantities[ing.name])
      .map((ing) => ({
        name: ing.name,
        quantity: quantities[ing.name],
        unit: ing.unit,
        image: ing.image,
      }));

    onAdd(ingredients);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-4 sm:p-6 w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="flex flex-col items-center">
          <img
            src="/mit-egyunk-ma2.png"
            alt="Mit együnk ma?"
            className="w-28 sm:w-40 mb-3 sm:mb-5"
          />

          <h2 className="text-base sm:text-lg mb-4 text-center px-2">
            Adja meg a rendelkezésre álló hozzávalóit!
          </h2>

          <div className="w-full space-y-2.5 sm:space-y-3 px-2">
            {ingredientsList.map((ingredient) => (
              <div
                key={ingredient.name}
                className="flex items-center justify-between gap-3"
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

          <button
            className="w-full mt-5 sm:mt-6 bg-orange-500 text-white py-2 sm:py-2.5 rounded-lg
                     hover:bg-orange-600 hover:scale-105 transition-all duration-200
                     text-sm sm:text-base"
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
