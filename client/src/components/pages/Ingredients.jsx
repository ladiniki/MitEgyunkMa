import { useState } from "react";

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const addIngredient = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newIngredient = formData.get("ingredient").trim();

    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients([...ingredients, newIngredient]);
    }
    event.target.reset();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hozzávalóim</h1>
      <form onSubmit={addIngredient} className="mb-4">
        <input
          type="text"
          name="ingredient"
          placeholder="Adj hozzá egy hozzávalót"
          className="border p-2 mr-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Hozzáadás
        </button>
      </form>
      <ul className="list-disc pl-5">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="mb-2">
            {ingredient}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ingredients;
