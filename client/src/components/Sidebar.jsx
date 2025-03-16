import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ScrollText,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Clock,
  Sparkles,
  Flame,
} from "lucide-react";
import PropTypes from "prop-types";

const Sidebar = ({ onCompactChange }) => {
  const [username, setUsername] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [lastRecipe, setLastRecipe] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCompact = () => {
    const newCompactState = !isCompact;
    setIsCompact(newCompactState);
    onCompactChange?.(newCompactState);
  };

  const buttons = [
    {
      label: "Receptek",
      route: "/recipies",
      icon: <ScrollText size={20} />,
    },
    {
      label: "Kedvencek",
      route: "/favorites",
      icon: <Heart size={20} />,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      label: "Hozzávalóim",
      route: "/ingredients",
      icon: <ShoppingCart size={20} />,
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          navigate("/");
          return;
        }

        const [userResponse, favoritesResponse] = await Promise.all([
          fetch("http://localhost:5000/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:5000/favorites", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUsername(userData.username);
        } else {
          console.error("Hiba történt a felhasználó adatainak lekérésekor.");
        }

        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          setFavoritesCount(favoritesData.favorites?.length || 0);
          // Beállítjuk az utolsó kedvenc receptet, ha van
          if (favoritesData.favorites?.length > 0) {
            setLastRecipe(favoritesData.favorites[0]);
          }
        } else {
          console.error("Hiba történt a kedvencek lekérésekor.");
        }
      } catch (error) {
        console.error("Hiba történt a kérés során:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      className={`flex flex-col items-center bg-white/90 dark:bg-dark-primary/90 backdrop-blur-lg h-full border-r border-orange-100/50 dark:border-dark-secondary/50 shadow-lg transition-all duration-300 ${
        isCompact ? "w-20" : "w-full"
      } relative`}
    >
      {/* Admin profil rész */}
      <div
        className={`flex flex-col items-center w-full pt-6 pb-6 border-b border-orange-100/50 dark:border-dark-secondary/50 ${
          isCompact ? "px-2" : "px-4"
        }`}
      >
        <div className="relative">
          <div
            className="flex justify-center items-center bg-gradient-to-br from-orange-500 to-orange-400 dark:from-dark-tertiary dark:to-orange-500 
                     rounded-full w-14 h-14 shadow-lg shadow-orange-500/20 dark:shadow-dark-tertiary/20 
                     transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <span className="text-2xl font-bold text-white">
              {username ? username.charAt(0).toUpperCase() : "?"}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 
            border-2 border-white dark:border-dark-primary shadow-sm animate-pulse" />
        </div>
        
        {!isCompact && (
          <div className="mt-3 text-center">
            <div className="font-medium text-gray-700 dark:text-gray-200 group">
              <span className="relative">
                {username || "Betöltés..."}
                <div className="absolute -top-1 -right-4">
                  <Coffee size={14} className="text-orange-500 dark:text-dark-tertiary animate-bounce" />
                </div>
              </span>
            </div>
            <div className="mt-1 text-xs text-orange-500 dark:text-orange-400 font-medium">
              Konyhatündér
            </div>
          </div>
        )}
      </div>

      {/* Navigációs gombok */}
      <div
        className={`flex flex-col items-start w-full pt-4 ${
          isCompact ? "px-2" : "px-4"
        } space-y-0.5`}
      >
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300
                      flex items-center gap-3 group hover:scale-105 relative
                      ${
                        location.pathname === button.route
                          ? "bg-gradient-to-br from-orange-500 to-orange-400 dark:from-dark-tertiary dark:to-orange-500 text-white shadow-lg shadow-orange-500/20 dark:shadow-dark-tertiary/20"
                          : "text-gray-700 dark:text-gray-300 hover:bg-orange-100/50 dark:hover:bg-dark-secondary/50 hover:text-orange-600 dark:hover:text-dark-tertiary"
                      }`}
            onClick={() => navigate(button.route)}
            title={isCompact ? button.label : undefined}
          >
            <span
              className={`transition-all duration-300 ${
                location.pathname === button.route
                  ? "text-white scale-110"
                  : "group-hover:scale-110"
              }`}
            >
              {button.icon}
            </span>
            {!isCompact && (
              <span
                className={`transition-transform duration-300 flex-grow ${
                  location.pathname === button.route ? "font-medium" : ""
                }`}
              >
                {button.label}
              </span>
            )}
            {button.badge && (
              <div className={`
                ${isCompact ? 'absolute -top-1 -right-1' : 'relative ml-auto'}
                min-w-[20px] h-5 px-1 flex items-center justify-center
                rounded-full text-xs font-medium
                ${location.pathname === button.route 
                  ? 'bg-white text-orange-500' 
                  : 'bg-orange-100 dark:bg-dark-tertiary/20 text-orange-600 dark:text-orange-400'}
              `}>
                {button.badge}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Utolsó kedvenc recept */}
      {!isCompact && lastRecipe && (
        <div className="w-full px-4 mt-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-dark-secondary/50 dark:to-dark-tertiary/10 border border-orange-100/50 dark:border-dark-tertiary/20">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
              <Clock size={12} />
              <span>Utoljára kedvelt recept</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 dark:from-dark-tertiary dark:to-orange-500 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-medium text-gray-700 dark:text-gray-200 truncate">
                  {lastRecipe.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Sparkles size={12} className="text-yellow-500" />
                  <span>{lastRecipe.difficulty || "Közepes"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-start w-full mt-auto">
        {/* Logo az alján */}
        {!isCompact && (
          <div
            className={`w-full px-4 pb-6 transition-opacity duration-300 hover:opacity-90 flex justify-center`}
          >
            <img
              src="/mit-egyunk-ma2.png"
              alt="Mit együnk ma?"
              className="w-40 transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Toggle gomb fix pozícióban */}
      <button
        onClick={toggleCompact}
        className="absolute -right-3 bottom-28 transform bg-white dark:bg-dark-primary rounded-xl p-2 
                 shadow-lg shadow-orange-500/10 dark:shadow-dark-tertiary/10 border border-orange-100/50 dark:border-dark-secondary/50 
                 hover:bg-orange-50 dark:hover:bg-dark-secondary transition-all duration-300 hover:scale-110 
                 hover:shadow-xl hover:shadow-orange-500/20 dark:hover:shadow-dark-tertiary/20 group"
      >
        {isCompact ? (
          <ChevronRight
            size={16}
            className="text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:translate-x-0.5"
          />
        ) : (
          <ChevronLeft
            size={16}
            className="text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:-translate-x-0.5"
          />
        )}
      </button>
    </div>
  );
};

Sidebar.propTypes = {
  onCompactChange: PropTypes.func,
};

export default Sidebar;
