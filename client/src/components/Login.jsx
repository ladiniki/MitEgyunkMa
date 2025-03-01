import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = async (data) => {
    try {
      /*Fetch --> Az API hívást kezeli a POST metódussal*/
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      /*Hibaellenőrzés*/
      if (!response.ok) {
        throw new Error("Login failed");
      }

      /*Ha a hibaellenőrzés sikeres --> kiolvassuk a token értékét*/
      const { access_token } = await response.json();
      localStorage.setItem("jwt", access_token);
      navigate("/recipies");
    } catch (error) {
      console.error(error.message);
      alert("Hiba történt a bejelentkezés során");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(249,115,22,0.1)] p-8 space-y-6 border border-orange-200">
        <div className="text-center">
          <img src="/mit-egyunk-ma2.png" alt="Mit együnk ma?" className="mx-auto w-64" />
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-primary text-gray-700 mb-1">
              Felhasználónév
            </label>
            <input
              type="text"
              id="username"
              {...register("username", { required: "Felhasználónév szükséges" })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300
                       focus:border-orange-500 focus:ring-4 focus:ring-orange-200
                       bg-white/80 font-primary
                       transition duration-200"
              placeholder="Felhasználónév"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-primary text-gray-700 mb-1">
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Jelszó szükséges" })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300
                       focus:border-orange-500 focus:ring-4 focus:ring-orange-200
                       bg-white/80 font-primary
                       transition duration-200"
              placeholder="Jelszó"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600
                     hover:from-orange-600 hover:to-orange-700
                     text-white font-primary rounded-xl
                     shadow-[0_4px_20px_rgb(249,115,22,0.3)]
                     transform transition duration-200 hover:scale-[1.02]
                     active:scale-[0.98]"
          >
            Bejelentkezés
          </button>

          <div className="text-center">
            <Link
              to="/register"
              className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-primary"
            >
              <span
                className="relative after:absolute after:bottom-0 after:left-0 
                           after:h-[1px] after:w-full after:bg-orange-500 after:scale-x-0 
                           hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                Még nem regisztráltál?
              </span>
            </Link>
          </div>
        </form>

        {errors.root && (
          <div className="p-4 text-red-600 bg-red-50 rounded-xl text-center text-sm font-primary border border-red-100">
            {errors.root.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
