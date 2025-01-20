import "./index.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import App from "./App";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </Router>
);
