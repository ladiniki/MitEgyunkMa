import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

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
    <div className="flex justify-center items-center bg-light-secondary h-[100vh] font-primary">
      <div className="flex flex-col border-2 bg-light-primary p-8 border-light-accent rounded-3xl w-[33vw] h-[33vh]">
        <span className="text-2xl text-light-accent">Bejelentkezés</span>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <input
            {...register("username", { required: "Felhasználónév szükséges" })}
            placeholder="Felhasználónév"
            className="border-2 focus:border-[3px] focus:outline-none bg-light-secondary mt-4 p-4 border-light-accent focus:border-light-accent rounded-2xl w-full text-light-accent placeholder-light-accent"
          />
          {errors.username && (
            <span className="text-red-500 text-sm">
              {errors.username.message}
            </span>
          )}

          <input
            {...register("password", { required: "Jelszó szükséges" })}
            type="password"
            placeholder="Jelszó"
            className="border-2 focus:border-[3px] focus:outline-none bg-light-secondary mt-4 p-4 border-light-accent focus:border-light-accent rounded-2xl w-full text-light-accent placeholder-light-accent"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}

          <div className="flex justify-center mt-4 w-full">
            <button
              type="submit"
              className="border-2 bg-light-accent p-4 border-light-accent rounded-2xl w-[66%] text-light-primary text-xl transition-transform duration-200 ease-in-out hover:scale-110"
            >
              <span>Bejelentkezés</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
