import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex justify-between h-screen font-primary bg-light-background">
      <div className="basis-[15%]">
        <Sidebar />
      </div>
      <div className="basis-[85%]">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
