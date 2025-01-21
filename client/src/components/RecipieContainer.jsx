import { useState, useEffect } from "react";
import RecipieCard from "./RecipieCard";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-4">
      <div className="gap-4 grid grid-cols-4 mt-4 mb-4 h-[85vh] overflow-y-auto">
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
