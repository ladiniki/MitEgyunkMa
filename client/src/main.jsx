import "./index.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import RecipieContainer from "./components/RecipieContainer";
import Ingredients from "./components/pages/Ingredients";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/recipies" element={<RecipieContainer />} />
        <Route path="/ingredients" element={<Ingredients />} />
      </Route>
    </Routes>
  </Router>
);
