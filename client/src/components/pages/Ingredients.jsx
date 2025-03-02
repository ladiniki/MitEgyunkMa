import { useState } from "react";
import IngredientsModal from "./IngredientsModal";
import RecipieCard from "../RecipieCard";
import { Plus } from "lucide-react";

const Ingredients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const handleAddIngredients = (newIngredients) => {
    setIngredients(newIngredients);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="h-[calc(100vh-4rem)] relative p-4">
        {ingredients.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">
              Jelenleg üres a hozzávalóid listája.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ingredients.map((ingredient, index) => (
              <RecipieCard
                key={index}
                name={ingredient.name}
                quantity={ingredient.quantity}
                unit={ingredient.unit}
                image={`/src/assets/${ingredient.image}`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-8 right-8">
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
