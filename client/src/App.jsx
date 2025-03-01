import { Routes, Route, Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Register from "./components/pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipieContainer from "./components/RecipieContainer";
import Ingredients from "./components/pages/Ingredients";

const AuthenticatedLayout = () => {
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [searchText, setSearchText] = useState('');

  return (
    <div className="flex h-screen font-primary bg-light-background">

      <div className="fixed top-0 left-0 w-[15%] h-screen bg-light-background">
        <Sidebar />
      </div>

      {/* Main content area with background */}
      <div className="ml-[15%] flex flex-col w-[85%] h-screen overflow-hidden">
        <div className="sticky top-0 z-50 bg-light-background">
          <Navbar 
            selectedMealType={selectedMealType} 
            onMealTypeChange={setSelectedMealType} 
            onSearchChange={setSearchText}
          />
        </div>
        <div className="flex-1 overflow-y-auto bg-light-background">
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
        <Route path="/ingredients" element={<ProtectedRoute><Ingredients /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;