import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Heart, ShoppingBag, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from 'prop-types';

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
      label: "Kijelentkezés",
      route: "/",
      icon: <LogOut size={20} />,
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
    <div className={`flex flex-col items-center bg-white/80 dark:bg-dark-primary/80 backdrop-blur-md h-full border-r border-orange-100 dark:border-dark-secondary transition-all duration-300 ${isCompact ? 'w-20' : 'w-full'} relative`}>
      {/* Admin profil rész */}
      <div className={`flex flex-col items-center w-full pt-6 pb-6 border-b border-orange-100 dark:border-dark-secondary ${isCompact ? 'px-2' : 'px-4'}`}>
        <div
          className="flex justify-center items-center bg-orange-500 dark:bg-dark-tertiary rounded-full w-16 h-16 
                      shadow-lg shadow-orange-100 dark:shadow-dark-tertiary/20 transition-transform hover:scale-105"
        >
          <span className="flex justify-center items-center w-full h-full text-2xl font-bold text-white">
            {username ? username.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        {!isCompact && (
          <span className="mt-3 text-gray-700 dark:text-gray-200 text-lg font-medium">
            {username || "Betöltés..."}
          </span>
        )}
      </div>

      {/* Toggle gomb */}
      <button
        onClick={toggleCompact}
        className="absolute right-0 top-[140px] transform translate-x-1/2 bg-white dark:bg-dark-primary rounded-full p-1.5 shadow-md border border-orange-100 dark:border-dark-secondary hover:bg-orange-50 dark:hover:bg-dark-secondary transition-colors"
      >
        {isCompact ? <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" /> : <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />}
      </button>

      {/* Navigációs gombok */}
      <div className={`flex flex-col items-start w-full pt-6 ${isCompact ? 'px-2' : 'px-4'}`}>
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`mb-3 w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200
                      flex items-center gap-3 hover:bg-orange-50 dark:hover:bg-dark-secondary
                      ${location.pathname === button.route
                ? "text-orange-600 dark:text-dark-tertiary font-medium bg-orange-50 dark:bg-dark-secondary"
                : "text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-dark-tertiary"
              }`}
            onClick={() => navigate(button.route)}
            title={isCompact ? button.label : undefined}
          >
            <span className="transition-colors duration-200">
              {button.icon}
            </span>
            {!isCompact && button.label}
          </button>
        ))}
      </div>

      {/* Logo az alján */}
      {!isCompact && (
        <div className="mt-auto pb-6 hover:opacity-95 transition-opacity">
          <img src="/mit-egyunk-ma2.png" alt="Mit együnk ma?" className="w-40" />
        </div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  onCompactChange: PropTypes.func
};

export default Sidebar;
