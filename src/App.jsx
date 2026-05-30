import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Login from "./pages/Login";
import BackToTop from "./components/common/BackToTop";
import Categories from "./pages/Categories";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

const Layout = () => {
  const location = useLocation();

  const hideLayout = location.pathname === "/login";

  return (
    <div className="bg-gray-50">
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
      {!hideLayout && <About />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      {" "}
      <div>
        <Router>
          <Layout />
        </Router>
        <BackToTop />
      </div>
    </AuthProvider>
  );
};

export default App;
