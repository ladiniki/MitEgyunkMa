import { useState, useEffect } from "react";
import { Heart, ChefHat, Utensils, Trophy, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const RecipieCard = ({
  name,
  cookingTime,
  image,
  difficulty,
  quantity,
  unit,
  onQuantityChange,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Thumbnail verzió generálása
  const getThumbnailUrl = (url) => {
    // Ha már thumbnail URL-t kaptunk, ne módosítsuk tovább
    if (url.includes("quality=") || url.includes("w=")) return url;
    
    // Lista nézet esetén kisebb, gyengébb minőségű képet használunk
    return `${url}?quality=40&w=300`;
  };

  // Nagy kép URL generálása
  const getFullImageUrl = (url) => {
    // Ha már módosított URL-t kaptunk, ne módosítsuk tovább
    if (url.includes("quality=") || url.includes("w=")) return url;
    
    // Jobb minőségű, de még mindig optimalizált kép
    return `${url}?quality=70&w=600`;
  };

  //Kedvenc státusz és hozzávaló egyezés lekérése
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        //Kedvencek és match percentage párhuzamos lekérése
        const promises = [
          fetch("http://localhost:5000/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ];

        if (cookingTime) {
          promises.push(
            fetch(
              `http://localhost:5000/recipe/${encodeURIComponent(name)}/match`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
          );
        }

        const [favResponse, matchResponse] = await Promise.all(promises);

        if (!isMounted) return;

        if (favResponse.ok) {
          const data = await favResponse.json();
          setIsFavorite(data.favorites.some((recipe) => recipe.name === name));
        }

        if (cookingTime && matchResponse?.ok) {
          const matchData = await matchResponse.json();
          setMatchPercentage(matchData.match_percentage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []); //Csak egyszer fut le, amikor a komponens betöltődik

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
          recipeName: name, //A recept nevét küldjük azonosítóként
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

  const handleCardClick = () => {
    if (cookingTime) {
      navigate(`/recipe/${encodeURIComponent(name)}`);
    }
  };

  //Nehézségi szint megjelenítése
  const renderDifficulty = () => {
    if (!difficulty) return null;

    let color, icon, label;

    switch (difficulty) {
      case "könnyű":
        color =
          "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
        icon = <ChefHat size={14} className="mr-1" />;
        label = "Könnyű";
        break;
      case "közepes":
        color =
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
        icon = <Utensils size={14} className="mr-1" />;
        label = "Közepes";
        break;
      case "haladó":
        color = "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
        icon = <Trophy size={14} className="mr-1" />;
        label = "Haladó";
        break;
      default:
        return null;
    }

    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color} transition-all duration-300 hover:shadow-sm`}
      >
        {icon}
        {label}
      </div>
    );
  };

  //Mennyiség módosítása
  const handleQuantityChange = (amount) => {
    if (onQuantityChange) {
      const newQuantity = Math.max(0, Number(quantity) + amount);
      onQuantityChange(name, newQuantity);
    }
  };

  const renderLeftInfo = () => {
    //Ha van mennyiség és mértékegység (hozzávaló esetén)
    if (quantity !== undefined && unit) {
      return (
        <div className="flex items-center justify-between w-full">
          <span className="text-orange-600 dark:text-dark-tertiary text-xs min-w-[2rem]">
            {quantity} {unit}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(-1);
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 dark:bg-dark-secondary text-orange-600 dark:text-dark-tertiary hover:bg-orange-200 dark:hover:bg-dark-primary transition-colors"
              disabled={quantity <= 0}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(1);
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 dark:bg-dark-secondary text-orange-600 dark:text-dark-tertiary hover:bg-orange-200 dark:hover:bg-dark-primary transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      );
    }
    //Ha van elkészítési idő (recept esetén)
    else if (cookingTime) {
      return (
        <span className="text-orange-600 dark:text-dark-tertiary text-xs">
          {cookingTime} perc
        </span>
      );
    }
    return null;
  };

  return (
    <div className="h-full">
      <div
        className={`bg-white dark:bg-dark-secondary rounded-xl overflow-hidden relative transform-gpu hover:scale-[1.02] transition-all duration-300 hover:shadow-xl dark:hover:shadow-dark-tertiary/10 h-full flex flex-col ${
          cookingTime ? "cursor-pointer" : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="relative">
          {/* Placeholder és háttér elmosás */}
          <div 
            className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 ${
              imageLoaded ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-300`}
          >
            <div className="w-full h-full animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
          </div>
          
          {/* Kis méretű thumbnail először */}
          <img
            src={getThumbnailUrl(image)}
            alt=""
            aria-hidden="true"
            className={`w-full h-24 xs:h-28 sm:h-32 md:h-36 object-cover absolute inset-0 ${
              imageLoaded ? 'opacity-0' : 'opacity-100 blur-sm scale-105'
            } transition-all duration-300`}
            loading="lazy"
          />
          
          {/* Nagy felbontású kép */}
          <img
            src={getFullImageUrl(image)}
            alt={name}
            className={`w-full h-24 xs:h-28 sm:h-32 md:h-36 object-cover relative ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageError(true);
              e.target.onerror = null;
              e.target.src = image; // Fallback az eredeti képre
            }}
          />
          {cookingTime && typeof matchPercentage === "number" && (
            <>
              {/* Háttér sáv (szürke) */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm" />
              {/* Színes progress sáv */}
              <div
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-500 backdrop-blur-sm
                  ${
                    matchPercentage >= 80
                      ? "bg-green-500/90 dark:bg-green-400/90"
                      : matchPercentage >= 50
                      ? "bg-yellow-500/90 dark:bg-yellow-400/90"
                      : "bg-red-500/90 dark:bg-red-400/90"
                  }`}
                style={{ width: `${matchPercentage}%` }}
              />
            </>
          )}
        </div>
        <div className="p-1 xs:p-1.5 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-xs xs:text-sm sm:text-base line-clamp-1">
              {name}
            </h3>
          </div>
          <div className="flex justify-between items-center mt-0.5">
            {renderLeftInfo()}
            {renderDifficulty()}
          </div>
        </div>
        {cookingTime && (
          <button
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-white/80 dark:bg-dark-primary/80 backdrop-blur-sm hover:bg-white dark:hover:bg-dark-secondary hover:shadow-md transition-all duration-200"
            onClick={toggleFavorite}
          >
            <Heart
              className={`${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 dark:text-gray-400"
              } w-5 h-5`}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipieCard;
