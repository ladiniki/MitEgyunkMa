import { useState } from "react";
import IngredientsModal from "./IngredientsModal";
import RecipieCard from "../RecipieCard";

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

        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <button
            className="px-6 py-3 bg-orange-500 text-white rounded-lg 
                       hover:bg-orange-600 hover:scale-105
                       transition-all duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            Szerkesztés
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
