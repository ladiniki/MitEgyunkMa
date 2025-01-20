import { Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex justify-between h-screen font-primary">
      <div className="pr-2 basis-[15%]">
        <Sidebar />
      </div>
      <div className="pl-2 basis-[85%]">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
