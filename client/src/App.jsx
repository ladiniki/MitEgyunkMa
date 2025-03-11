import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Register from "./components/pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipieContainer from "./components/RecipieContainer";
import Ingredients from "./components/pages/Ingredients";
import RecipeDetail from "./components/pages/RecipeDetail";
import Favorites from "./components/pages/Favorites";

const AuthenticatedLayout = () => {
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isSidebarCompact, setIsSidebarCompact] = useState(false);

  return (
    <div className="flex h-screen font-primary bg-light-background dark:bg-dark-background">
      <div className={`fixed top-0 left-0 h-screen bg-light-background dark:bg-dark-background transition-all duration-300 ${isSidebarCompact ? 'w-20' : 'w-[15%]'}`}>
        <Sidebar onCompactChange={setIsSidebarCompact} />
      </div>

      {/* Main content area with background */}
      <div className={`transition-all duration-300 ${isSidebarCompact ? 'ml-20' : 'ml-[15%]'} flex flex-col w-full h-screen overflow-hidden`}>
        <div className="sticky top-0 z-50 bg-light-background dark:bg-dark-background">
          <Navbar 
            selectedMealType={selectedMealType} 
            onMealTypeChange={setSelectedMealType} 
            onSearchChange={setSearchText}
          />
        </div>
        <div className="flex-1 overflow-y-auto bg-light-background dark:bg-dark-background">
          <Outlet context={{ selectedMealType, searchText }} />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AuthenticatedLayout />}>
        <Route path="/recipies" element={<ProtectedRoute><RecipieContainer /></ProtectedRoute>} />
        <Route path="/recipe/:recipeName" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
        <Route path="/ingredients" element={<ProtectedRoute><Ingredients /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;