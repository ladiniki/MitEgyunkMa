import { useState, useEffect } from "react";
import RecipieCard from "./RecipieCard";

/*Betölti a recepteket egy API-ból*/
const RecipieContainer = () => {
  const [recipies, setRecipies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipies = async () => {
      try {
        const response = await fetch("http://localhost:5000/recipies");
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
  }, []);

  /*Loading állapot, hogy a felhasználó bejelentkezésig ne lásson semmit*/
  if (loading) {
    return <div>Loading...</div>;
  }

  /*a recipies.map()-al minden receptet a RecipieCard komponensbe jelenítjük meg
  Grid --> kártya elrendezése, görgető*/
  return (
    <div className="m-4">
      <div className="gap-4 grid grid-cols-4 mt-4 mb-4">
        {recipies.map((recipe, index) => (
          <RecipieCard
            key={index}
            name={recipe.name}
            cookingTime={recipe.cookingTime}
            image={`data:image/jpeg;base64,${recipe.image}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipieContainer;
