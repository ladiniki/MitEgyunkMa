import { Home, Heart, ShoppingBag, LogOut } from "lucide-react";

const Sidebar = () => {
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
    {
      label: "Hozzávalóim",
      route: "/ingredients",
      icon: <ShoppingBag size={20} />,
    },
    {
      label: "Kijelentkezés",
      route: "/logout",
      icon: <LogOut size={20} />,
    },
  ];

  const username = "Niki";

  return (
    <div className="flex flex-col items-center bg-light-primary h-full pt-5">
      <span className="text-light-accent">Mit együnk ma?</span>
      <div className="flex flex-col items-start pt-10">
        {buttons.map((button, index) => (
          <button
            key={index}
            className="mb-4 w-full text-left text-light-accent hover:text-light-tertiary transition-colors duration-200 ease-in-out flex items-center"
            onClick={() => console.log(`Navigating to ${button.route}`)}
          >
            <span className="mr-2">{button.icon}</span>
            {button.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center mt-auto pt-4 pb-10">
        <div className="flex justify-center items-center bg-light-accent rounded-full w-28 h-28 font-bold text-2xl text-light-primary">
          <span className="flex justify-center items-center w-full h-full text-5xl text-bold">
            {username.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="mt-2 text-light-accent text-xl">{username}</span>
      </div>
    </div>
  );
};

export default Sidebar;
