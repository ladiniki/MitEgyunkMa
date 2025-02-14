import { useState, useEffect } from "react";
import { Heart } from "lucide-react"; //A BELÉPETT FELHASZNÁLÓ KEDVENCEIT MENTSE EL

/* eslint-disable react/prop-types */
const RecipieCard = ({ name, cookingTime, image }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(savedFavorites.some((recipe) => recipe.name === name));
  }, [name]);

  const toggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = savedFavorites.filter(
        (recipe) => recipe.name !== name
      );
    } else {
      updatedFavorites = [...savedFavorites, { name, cookingTime, image }];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="p-3">
      <div className="bg-white rounded-xl overflow-hidden relative transform-gpu hover:scale-[1.02] transition-all duration-300 hover:shadow-xl">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <span className="text-orange-600 text-sm">{cookingTime} perc</span>
        </div>
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200" onClick={toggleFavorite}>
          <Heart className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
    </div>
  );
};

export default RecipieCard;
