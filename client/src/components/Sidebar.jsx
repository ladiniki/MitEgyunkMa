import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Heart, ShoppingBag, LogOut } from "lucide-react";

const Sidebar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    { label: "Hozzávalóim",
      route: "/ingredients",
      icon: <ShoppingBag size={20} />
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
    <div className="flex flex-col items-center bg-white/80 backdrop-blur-md h-full border-r border-orange-100">
      {/* Admin profil rész */}
      <div className="flex flex-col items-center w-full pt-6 pb-6 border-b border-orange-100">
        <div className="flex justify-center items-center bg-orange-500 rounded-full w-20 h-20 
                      shadow-lg shadow-orange-100 transition-transform hover:scale-105">
          <span className="flex justify-center items-center w-full h-full text-3xl font-bold text-white">
            {username ? username.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        <span className="mt-3 text-gray-700 text-lg font-medium">
          {username || "Betöltés..."}
        </span>
      </div>

      {/* Navigációs gombok */}
      <div className="flex flex-col items-start w-full px-4 pt-6">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`mb-3 w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200
                      flex items-center gap-3 hover:bg-orange-50
                      ${
                        location.pathname === button.route
                          ? "text-orange-600 font-medium bg-orange-50"
                          : "text-gray-700 hover:text-orange-600"
                      }`}
            onClick={() => navigate(button.route)}
          >
            <span className="transition-colors duration-200">{button.icon}</span>
            {button.label}
          </button>
        ))}
      </div>

      {/* Logo az alján */}
      <div className="mt-auto pb-6 hover:opacity-95 transition-opacity">
        <img src="/mit-egyunk-ma2.png" alt="Mit együnk ma?" className="w-48" />
      </div>
    </div>
  );
};

export default Sidebar;
