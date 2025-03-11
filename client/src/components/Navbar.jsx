import {
  Search,
  Receipt,
  Coffee,
  UtensilsCrossed,
  Cake,
  ChefHat,
} from "lucide-react";
import PropTypes from 'prop-types';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ selectedMealType, onMealTypeChange, onSearchChange }) => {
  const [searchText, setSearchText] = useState('');

  const handleMealTypeClick = (mealType) => {
    onMealTypeChange(mealType === selectedMealType ? null : mealType);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchChange(value);
  };

  const navButtons = [
    {
      label: "Receptek",
      value: null,
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      label: "Reggeli",
      value: "reggeli",
      icon: <Coffee className="w-5 h-5" />,
    },
    {
      label: "Ebéd",
      value: "ebéd",
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
    {
      label: "Desszert",
      value: "desszert",
      icon: <Cake className="w-5 h-5" />,
    },
    {
      label: "Vacsora",
      value: "vacsora",
      icon: <ChefHat className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-primary/80 backdrop-blur-md border-b border-orange-100 dark:border-dark-secondary">
      <div className="w-full px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Bal oldali szűrők */}
          <div className="flex items-center space-x-2">
            {navButtons.map((button) => (
              <button
                key={button.value ?? 'all'}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
                         flex items-center gap-2 group
                         ${selectedMealType === button.value 
                           ? 'bg-orange-100 text-orange-600 dark:bg-dark-secondary dark:text-dark-tertiary' 
                           : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-dark-secondary dark:hover:text-dark-tertiary'}`}
                onClick={() => handleMealTypeClick(button.value)}
              >
                <span className="transition-colors duration-200 group-hover:text-orange-600 dark:group-hover:text-dark-tertiary">
                  {button.icon}
                </span>
                {button.label}
              </button>
            ))}
          </div>

          {/* Jobb oldali keresés és témaváltó */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Keresés..."
                value={searchText}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 rounded-lg border-2 border-orange-300
                         focus:border-orange-500 focus:ring-4 focus:ring-orange-200
                         bg-white/80 font-primary w-64
                         dark:bg-dark-secondary dark:border-dark-tertiary dark:text-gray-200
                         dark:focus:ring-dark-tertiary/20
                         transition duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  selectedMealType: PropTypes.string,
  onMealTypeChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export default Navbar;