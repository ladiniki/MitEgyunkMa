import { useState, useEffect } from "react";
import { Heart, ChefHat, Flame, Utensils, Trophy } from "lucide-react"; //A BELÉPETT FELHASZNÁLÓ KEDVENCEIT MENTSE EL

/* eslint-disable react/prop-types */
const RecipieCard = ({ name, cookingTime, image, difficulty }) => {
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
      updatedFavorites = [...savedFavorites, { name, cookingTime, image, difficulty }];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  // Nehézségi szint megjelenítése
  const renderDifficulty = () => {
    if (!difficulty) return null;

    let color, icon, label;
    
    switch(difficulty) {
      case "könnyű":
        color = "bg-green-100 text-green-700";
        icon = <ChefHat size={14} className="mr-1" />;
        label = "Könnyű";
        break;
      case "közepes":
        color = "bg-yellow-100 text-yellow-700";
        icon = <Utensils size={14} className="mr-1" />;
        label = "Közepes";
        break;
      case "haladó":
        color = "bg-red-100 text-red-700";
        icon = <Trophy size={14} className="mr-1" />;
        label = "Haladó";
        break;
      default:
        return null;
    }
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color} transition-all duration-300 hover:shadow-sm`}>
        {icon}
        {label}
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl overflow-hidden relative transform-gpu hover:scale-[1.02] transition-all duration-300 hover:shadow-xl h-full flex flex-col">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-44 sm:h-48 md:h-52 object-cover"
        />
        <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{name}</h3>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-orange-600 text-sm">{cookingTime} perc</span>
            {renderDifficulty()}
          </div>
        </div>
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200" onClick={toggleFavorite}>
          <Heart className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} w-5 h-5`} />
        </button>
      </div>
    </div>
  );
};

export default RecipieCard;
