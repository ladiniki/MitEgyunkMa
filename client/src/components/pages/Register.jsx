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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-orange-100">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(249,115,22,0.1)] p-8 space-y-6 border border-orange-200">
        <div className="text-center">
          <img 
            src="/mit-egyunk-ma2.png" 
            alt="Mit együnk ma?" 
            className="mx-auto w-64" 
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-primary text-gray-700 mb-1">
              Felhasználónév
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300
                       focus:border-orange-500 focus:ring-4 focus:ring-orange-200
                       bg-white/80 font-primary
                       transition duration-200"
              placeholder="Felhasználónév"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-primary text-gray-700 mb-1">
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300
                       focus:border-orange-500 focus:ring-4 focus:ring-orange-200
                       bg-white/80 font-primary
                       transition duration-200"
              placeholder="Jelszó"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-primary text-gray-700 mb-1">
              Jelszó megerősítése
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border-2 border-orange-300
                       focus:border-orange-500 focus:ring-4 focus:ring-orange-200
                       bg-white/80 font-primary
                       transition duration-200"
              placeholder="Jelszó megerősítése"
              autoComplete="new-password"
            />
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
            Regisztráció
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/"
            className="text-orange-600 hover:text-orange-700 font-primary transition duration-200
                     hover:underline underline-offset-4"
          >
            Már van fiókod? Jelentkezz be!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
