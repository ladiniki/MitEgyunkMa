import { useState, useEffect } from "react";
import { Heart, ChefHat, Utensils, Trophy } from "lucide-react"; //A BELÉPETT FELHASZNÁLÓ KEDVENCEIT MENTSE EL
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const RecipieCard = ({ name, cookingTime, image, difficulty, quantity, unit }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // Kedvenc státusz lekérése
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        const response = await fetch("http://localhost:5000/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.favorites.some(recipe => recipe.name === name));
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [name]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        navigate("/login");
        return;
      }

      const endpoint = isFavorite ? "/favorites/remove" : "/favorites/add";
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipeName: name, // A recept nevét küldjük azonosítóként
        }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Error toggling favorite status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Recept részletes oldalára navigálás
  const handleCardClick = () => {
    // Csak akkor navigálunk a recept oldalára, ha van cookingTime (tehát recept, nem hozzávaló)
    if (cookingTime) {
      navigate(`/recipe/${encodeURIComponent(name)}`);
    }
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

  // Meghatározzuk, hogy mit jelenítsünk meg a bal alsó sarokban
  const renderLeftInfo = () => {
    // Ha van mennyiség és mértékegység (hozzávaló esetén)
    if (quantity && unit) {
      return (
        <span className="text-orange-600 text-xs">{quantity} {unit}</span>
      );
    }
    // Ha van elkészítési idő (recept esetén)
    else if (cookingTime) {
      return (
        <span className="text-orange-600 text-xs">{cookingTime} perc</span>
      );
    }
    // Ha egyik sincs
    return null;
  };

  return (
    <div className="h-full">
      <div 
        className={`bg-white rounded-xl overflow-hidden relative transform-gpu hover:scale-[1.02] transition-all duration-300 hover:shadow-xl h-full flex flex-col ${cookingTime ? 'cursor-pointer' : ''}`}
        onClick={handleCardClick}
      >
        <img 
          src={image} 
          alt={name} 
          className="w-full h-24 xs:h-28 sm:h-32 md:h-36 object-cover"
        />
        <div className="p-1 xs:p-1.5 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base line-clamp-1">{name}</h3>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            {renderLeftInfo()}
            {renderDifficulty()}
          </div>
        </div>
        <button 
          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-200" 
          onClick={toggleFavorite}
        >
          <Heart className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} w-3.5 h-3.5`} />
        </button>
      </div>
    </div>
  );
};

export default RecipieCard;
