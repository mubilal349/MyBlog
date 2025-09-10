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

const Layout = () => {
  const location = useLocation(); // Triggered the current URL/location of your app

  // Hide Navbar + About only on /login
  const hideLayout = location.pathname === "/login";

  return (
    <div className="bg-gray-50">
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {!hideLayout && <About />}
    </div>
  );
};

const App = () => {
  return (
    <>
      <div>
        <Router>
          <Layout />
        </Router>
        <BackToTop />
      </div>
    </>
  );
};

export default App;
