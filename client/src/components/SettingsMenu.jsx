import { Settings, Moon, Sun, LogOut } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SettingsMenu = () => {
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    //Kezdeti téma beállítása
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    //Kattintás figyelése a dokumentumon a menü bezárásához
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-colors duration-200
                text-gray-700 hover:bg-orange-100 hover:text-orange-600
                dark:text-gray-300 dark:hover:bg-dark-secondary dark:hover:text-dark-tertiary"
        aria-label="Beállítások"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-dark-primary border border-orange-100 dark:border-dark-secondary overflow-hidden z-50 animate-fade-in">
          <div className="py-1">
            <button
              onClick={toggleTheme}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-dark-secondary flex items-center gap-2"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-orange-500 dark:text-dark-tertiary" />
                  <span>Világos mód</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-orange-500 dark:text-dark-tertiary" />
                  <span>Sötét mód</span>
                </>
              )}
            </button>
            <div className="border-t border-orange-100 dark:border-dark-secondary"></div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Kijelentkezés</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;
