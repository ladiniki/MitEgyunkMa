import {
  Search,
  MenuSquare,
  Coffee,
  UtensilsCrossed,
  Cake,
  ChefHat,
  Utensils,
  Croissant,
  Soup,
  IceCream
} from "lucide-react";
import PropTypes from 'prop-types';
import { useState } from 'react';
import SettingsMenu from './SettingsMenu';

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
      label: "Összes",
      value: null,
      icon: <MenuSquare className="w-5 h-5" />,
    },
    {
      label: "Reggeli",
      value: "reggeli",
      icon: <Croissant className="w-5 h-5" />,
    },
    {
      label: "Ebéd",
      value: "ebéd",
      icon: <Soup className="w-5 h-5" />,
    },
    {
      label: "Desszert",
      value: "desszert",
      icon: <IceCream className="w-5 h-5" />,
    },
    {
      label: "Vacsora",
      value: "vacsora",
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-dark-primary/90 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Felső sor: Cím és keresés */}
          <div className="flex items-center justify-between mb-3 md:mb-0">
            {/* Oldal címe */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 dark:from-dark-tertiary dark:to-orange-500 text-transparent bg-clip-text transform transition-all duration-300 hover:scale-105">
              <h1 className="text-2xl font-bold flex items-center">
                <Utensils className="w-6 h-6 mr-2 text-orange-500 dark:text-dark-tertiary animate-pulse" />
                <span className="bg-gradient-to-r from-orange-500 to-orange-400 dark:from-dark-tertiary dark:to-orange-500 text-transparent bg-clip-text">
                  Mit együnk ma?
                </span>
              </h1>
            </div>
            
            {/* Keresés és beállítások - mobilon látható */}
            <div className="flex md:hidden items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Keresés..."
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-32 pl-9 pr-2 py-2 rounded-lg text-sm border border-orange-200/50 dark:border-dark-tertiary/20"
                />
              </div>
              <SettingsMenu />
            </div>
          </div>
          
          {/* Alsó sor: Szűrők és keresés (asztali nézeten) */}
          <div className="flex items-center justify-between">
            {/* Szűrő gombok */}
            <div className="flex items-center space-x-1 overflow-x-auto">
              {navButtons.map((button) => (
                <button
                  key={button.value ?? 'all'}
                  className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 
                           flex items-center gap-1.5 text-sm md:text-base
                           ${selectedMealType === button.value 
                             ? 'bg-gradient-to-br from-orange-500 to-orange-400 dark:from-dark-tertiary dark:to-orange-500 text-white shadow-lg shadow-orange-500/20 dark:shadow-dark-tertiary/20' 
                             : 'text-gray-700 hover:bg-orange-100/50 hover:text-orange-600 dark:text-gray-300 dark:hover:bg-dark-secondary/50 dark:hover:text-dark-tertiary'}`}
                  onClick={() => handleMealTypeClick(button.value)}
                >
                  <span className={`transition-transform duration-300 ${selectedMealType === button.value ? 'text-white' : ''}`}>
                    {button.icon}
                  </span>
                  <span className="font-medium">{button.label}</span>
                </button>
              ))}
            </div>
            
            {/* Keresés és beállítások - asztali nézeten látható */}
            <div className="hidden md:flex items-center gap-4 ml-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`w-5 h-5 transition-colors duration-300 ${searchText ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Keresés..."
                  value={searchText}
                  onChange={handleSearchChange}
                  className={`w-56 pl-11 pr-4 py-2.5 rounded-xl font-medium transition-all duration-300
                            ${searchText 
                              ? 'bg-gradient-to-br from-orange-500 to-orange-400 dark:from-dark-tertiary dark:to-orange-500 text-white placeholder-white/70 shadow-lg shadow-orange-500/20 dark:shadow-dark-tertiary/20' 
                              : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-orange-100/50 hover:text-orange-600 dark:hover:bg-dark-secondary/50 dark:hover:text-dark-tertiary'} 
                            border border-orange-200/50 dark:border-dark-tertiary/20
                            focus:border-orange-500/50 dark:focus:border-dark-tertiary/50
                            focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-dark-tertiary/20
                            hover:scale-105`}
                />
              </div>
              <SettingsMenu />
            </div>
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