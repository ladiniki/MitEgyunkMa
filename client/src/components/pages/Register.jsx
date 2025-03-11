import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log("Registration data:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100 dark:from-dark-background dark:via-dark-primary dark:to-dark-background">
      <div className="max-w-md w-full bg-white/90 dark:bg-dark-primary/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(249,115,22,0.1)] dark:shadow-[0_8px_30px_rgba(255,139,62,0.1)] p-8 space-y-6 border border-orange-200 dark:border-dark-secondary">
        <div className="text-center">
          <img src="/mit-egyunk-ma2.png" alt="Mit együnk ma?" className="mx-auto w-64" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-primary text-gray-700 dark:text-gray-300 mb-1">
              Felhasználónév
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300 dark:border-dark-tertiary
                       focus:border-orange-500 dark:focus:border-dark-tertiary focus:ring-4 focus:ring-orange-200 dark:focus:ring-dark-tertiary/20
                       bg-white/80 dark:bg-dark-secondary/80 font-primary dark:text-gray-200
                       transition duration-200"
              placeholder="Felhasználónév"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-primary text-gray-700 dark:text-gray-300 mb-1">
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300 dark:border-dark-tertiary
                       focus:border-orange-500 dark:focus:border-dark-tertiary focus:ring-4 focus:ring-orange-200 dark:focus:ring-dark-tertiary/20
                       bg-white/80 dark:bg-dark-secondary/80 font-primary dark:text-gray-200
                       transition duration-200"
              placeholder="Jelszó"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-primary text-gray-700 dark:text-gray-300 mb-1">
              Jelszó megerősítése
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300 dark:border-dark-tertiary
                       focus:border-orange-500 dark:focus:border-dark-tertiary focus:ring-4 focus:ring-orange-200 dark:focus:ring-dark-tertiary/20
                       bg-white/80 dark:bg-dark-secondary/80 font-primary dark:text-gray-200
                       transition duration-200"
              placeholder="Jelszó megerősítése"
            />
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
            Regisztráció
          </button>

          <div className="text-center">
            <Link
              to="/"
              className="mt-4 text-orange-500 dark:text-dark-tertiary hover:text-orange-600 dark:hover:text-orange-500 text-sm font-primary"
            >
              <span
                className="relative after:absolute after:bottom-0 after:left-0 
                           after:h-[1px] after:w-full after:bg-orange-500 dark:after:bg-dark-tertiary after:scale-x-0 
                           hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                Már van fiókod? Jelentkezz be!
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
