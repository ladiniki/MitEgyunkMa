import {
  NotebookText,
  EggFried,
  CookingPot,
  CakeSlice,
  Soup,
  Search,
} from "lucide-react";

const Navbar = () => {
  const buttons = [
    {
      label: "Receptek",
      icon: <NotebookText size={20} />,
    },
    {
      label: "Reggeli",
      icon: <EggFried size={20} />,
    },
    {
      label: "Ebéd",
      icon: <CookingPot size={20} />,
    },
    {
      label: "Desszert",
      icon: <CakeSlice size={20} />,
    },
    {
      label: "Vacsora",
      icon: <Soup size={20} />,
    },
  ];

  return (
    <div className="flex items-center bg-light-background w-full h-[10vh]">
      <div className="mt-2">
        <div className="flex items-start pt-4 w-full">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="flex flex-col items-center mb-4 w-full text-left text-light-accent hover:text-light-tertiary transition-colors duration-200 ease-in-out p-4 rounded-3xl"
              onClick={() => console.log(`Navigating to ${button.label}`)}
            >
              <span>{button.icon}</span>
              <span>{button.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="pl-2 ml-auto flex justify-between">
        <div className="flex items-center rounded-3xl border-2 p-2 bg-light-tertiary border-light-accent mr-2">
          <span className="mr-28">Kereső</span> <Search size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
