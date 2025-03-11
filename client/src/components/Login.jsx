import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import FoodBackground from "./FoodBackground";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { access_token } = await response.json();
      localStorage.setItem("jwt", access_token);
      navigate("/recipies");
    } catch (error) {
      console.error(error.message);
      alert("Hiba történt a bejelentkezés során");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 dark:from-dark-background dark:via-dark-primary dark:to-dark-background overflow-hidden">
      <FoodBackground />
      
      <div className="relative z-10 max-w-md w-full bg-white/90 dark:bg-dark-primary/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(249,115,22,0.1)] dark:shadow-[0_8px_30px_rgba(255,139,62,0.1)] p-8 space-y-6 border border-orange-200 dark:border-dark-secondary">
        <div className="text-center">
          <img src="/mit-egyunk-ma2.png" alt="Mit együnk ma?" className="mx-auto w-64" />
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-primary text-gray-700 dark:text-gray-300 mb-1">
              Felhasználónév
            </label>
            <input
              type="text"
              id="username"
              {...register("username", { required: "Felhasználónév szükséges" })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300 dark:border-dark-tertiary
                       focus:border-orange-500 dark:focus:border-dark-tertiary focus:ring-4 focus:ring-orange-200 dark:focus:ring-dark-tertiary/20
                       bg-white/80 dark:bg-dark-secondary/80 font-primary dark:text-gray-200
                       transition duration-200"
              placeholder="Felhasználónév"
            />
            {errors.username && (
              <span className="text-red-500 dark:text-red-400 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-primary text-gray-700 dark:text-gray-300 mb-1">
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Jelszó szükséges" })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300 dark:border-dark-tertiary
                       focus:border-orange-500 dark:focus:border-dark-tertiary focus:ring-4 focus:ring-orange-200 dark:focus:ring-dark-tertiary/20
                       bg-white/80 dark:bg-dark-secondary/80 font-primary dark:text-gray-200
                       transition duration-200"
              placeholder="Jelszó"
            />
            {errors.password && (
              <span className="text-red-500 dark:text-red-400 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-dark-tertiary dark:to-orange-600
                     hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-600 dark:hover:to-orange-700
                     text-white font-primary rounded-xl
                     shadow-[0_4px_20px_rgb(249,115,22,0.3)] dark:shadow-[0_4px_20px_rgba(255,139,62,0.2)]
                     transform transition duration-200 hover:scale-[1.02]
                     active:scale-[0.98]"
          >
            Bejelentkezés
          </button>

          <div className="text-center">
            <Link
              to="/register"
              className="mt-4 text-orange-500 dark:text-dark-tertiary hover:text-orange-600 dark:hover:text-orange-500 text-sm font-primary"
            >
              <span
                className="relative after:absolute after:bottom-0 after:left-0 
                           after:h-[1px] after:w-full after:bg-orange-500 dark:after:bg-dark-tertiary after:scale-x-0 
                           hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                Még nem regisztráltál?
              </span>
            </Link>
          </div>
        </form>

        {errors.root && (
          <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl text-center text-sm font-primary border border-red-100 dark:border-red-800">
            {errors.root.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
