import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Heart, ShoppingBag, LogOut } from "lucide-react";

const Sidebar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { label: "Receptek", route: "/recipies", icon: <Home size={20} /> },
    { label: "Kedvencek", route: "/favorites", icon: <Heart size={20} /> },
    {
      label: "Hozzávalóim",
      route: "/ingredients",
      icon: <ShoppingBag size={20} />,
    },
    { label: "Kijelentkezés", route: "/", icon: <LogOut size={20} /> },
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
    <div className="flex flex-col items-center bg-light-primary h-full pt-8">
      <span className="text-light-accent">Mit együnk ma?</span>
      <div className="flex flex-col items-start pt-20">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`mb-4 w-full text-left text-light-accent hover:text-light-tertiary hover:scale-105 transition-colors duration-200 ease-in-out flex items-center ${
              location.pathname === button.route ? "text-light-tertiary" : ""
            }`}
            onClick={() => navigate(button.route)}
          >
            <span className="mr-2">{button.icon}</span>
            {button.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center mt-auto pt-4 pb-10">
        <div className="flex justify-center items-center bg-light-accent rounded-full w-28 h-28 font-bold text-2xl text-light-primary">
          <span className="flex justify-center items-center w-full h-full text-5xl text-bold">
            {username ? username.charAt(0).toUpperCase() : "?"}
          </span>
        </div>
        <span className="mt-2 text-light-accent text-xl">
          {username || "Betöltés..."}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
