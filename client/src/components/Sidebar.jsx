import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import PropTypes from "prop-types";

const Sidebar = ({ onCompactChange }) => {
  const [username, setUsername] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
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
      icon: <Home size={20} />,
    },
    {
      label: "Kedvencek",
      route: "/favorites",
      icon: <Heart size={20} />,
    },
    {
      label: "Hozzávalóim",
      route: "/ingredients",
      icon: <ShoppingBag size={20} />,
    },
    {
      label: "Receptkönyv",
      route: "/new-recipe",
      icon: <PlusCircle size={20} />,
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

        const response = await fetch("http://localhost:5000/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        } else {
          console.error("Hiba történt a felhasználó adatainak lekérésekor.");
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
        className={`flex flex-col items-center w-full pt-8 pb-8 border-b border-orange-100/50 dark:border-dark-secondary/50 ${
          isCompact ? "px-2" : "px-4"
        }`}
      >
        <div
          className="flex justify-center items-center bg-gradient-to-br from-orange-500 to-orange-400 dark:from-dark-tertiary dark:to-orange-500 
                     rounded-full w-16 h-16 shadow-lg shadow-orange-500/20 dark:shadow-dark-tertiary/20 
                     transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-md
                     group"
        >
          <span className="flex justify-center items-center w-full h-full text-2xl font-bold text-white transition-all duration-300">
            {username ? username.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        {!isCompact && (
          <div className="mt-4 text-center">
            <span className="text-gray-700 dark:text-gray-200 text-lg font-medium">
              {username || "Betöltés..."}
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Felhasználó
            </p>
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
                      flex items-center gap-3 group hover:scale-105
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
                className={`transition-transform duration-300 ${
                  location.pathname === button.route ? "font-medium" : ""
                }`}
              >
                {button.label}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-start w-full mt-auto">
        {/* Logo az alján */}
        {!isCompact && (
          <div
            className={`w-full px-4 pb-6 transition-opacity duration-300 hover:opacity-90 flex justify-center`}
          >
            <img
              src="/mit-egyunk-ma2.png"
              alt="Mit együnk ma?"
              className="w-40"
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
