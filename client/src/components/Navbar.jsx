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

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
      <div className="w-full px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Bal oldali szűrők */}
          <div className="flex items-center space-x-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
                       flex items-center gap-2 group
                       ${selectedMealType === null 
                         ? 'bg-orange-100 text-orange-600' 
                         : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'}`}
              onClick={() => handleMealTypeClick(null)}
            >
              <Receipt className="w-5 h-5 transition-colors duration-200 group-hover:text-orange-600" />
              Receptek
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
                       flex items-center gap-2 group
                       ${selectedMealType === 'reggeli' 
                         ? 'bg-orange-100 text-orange-600' 
                         : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'}`}
              onClick={() => handleMealTypeClick('reggeli')}
            >
              <Coffee className="w-5 h-5 transition-colors duration-200 group-hover:text-orange-600" />
              Reggeli
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
                       flex items-center gap-2 group
                       ${selectedMealType === 'ebéd' 
                         ? 'bg-orange-100 text-orange-600' 
                         : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'}`}
              onClick={() => handleMealTypeClick('ebéd')}
            >
              <UtensilsCrossed className="w-5 h-5 transition-colors duration-200 group-hover:text-orange-600" />
              Ebéd
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
                       flex items-center gap-2 group
                       ${selectedMealType === 'desszert' 
                         ? 'bg-orange-100 text-orange-600' 
                         : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'}`}
              onClick={() => handleMealTypeClick('desszert')}
            >
              <Cake className="w-5 h-5 transition-colors duration-200 group-hover:text-orange-600" />
              Desszert
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 
                       flex items-center gap-2 group
                       ${selectedMealType === 'vacsora' 
                         ? 'bg-orange-100 text-orange-600' 
                         : 'text-gray-700 hover:bg-orange-100 hover:text-orange-600'}`}
              onClick={() => handleMealTypeClick('vacsora')}
            >
              <ChefHat className="w-5 h-5 transition-colors duration-200 group-hover:text-orange-600" />
              Vacsora
            </button>
          </div>

          {/* Jobb oldali kereső */}
          <div className="relative ml-auto group">
            <input
              type="text"
              placeholder="Keresés..."
              value={searchText}
              onChange={handleSearchChange}
              className="w-[300px] px-4 py-2 pl-10 rounded-full 
                       bg-white border-2 border-orange-500/30
                       focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
                       hover:border-orange-500 hover:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]
                       transition-all duration-200"
            />
            <Search
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 
                            text-orange-500/70 group-hover:text-orange-500
                            transition-colors duration-200"
            />
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