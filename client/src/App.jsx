import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import RecipieContainer from "./components/RecipieContainer";

const AuthenticatedLayout = () => {
  return (
    <div className="flex justify-between h-screen font-primary bg-light-background">
      <div className="basis-[15%]">
        <Sidebar />
      </div>
      <div className="basis-[85%]">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RecipieContainer />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/*" element={<AuthenticatedLayout />} />
    </Routes>
  );
}

export default App;
