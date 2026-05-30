import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Login from "./pages/Login";
import BackToTop from "./components/common/BackToTop";
import Categories from "./pages/Categories";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Contact from "./pages/Contact";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./context/ProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import BlogDetails from "./pages/BlogDetails";

import Overview from "./pages/admin/Overview";
import Posts from "./pages/admin/Posts";
import UsersPage from "./pages/admin/Users";
import Comments from "./pages/admin/Comments";
import Chatbot from "./components/Chatboat";
import Blog from "./pages/Blog";

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" || location.pathname.startsWith("/admin");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="posts" element={<Posts />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="comments" element={<Comments />} />
          </Route>

          {/* Redirect everything else */}
          <Route
            path="*"
            element={<Navigate to={user ? "/admin" : "/login"} />}
          />

          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>
      {!hideLayout && <About />}
      {!hideLayout && <Categories />}
      {!hideLayout && <Contact />}
      {!hideLayout && <Footer />}
      {!hideLayout && <Chatbot />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout />
        <BackToTop />
      </Router>
    </AuthProvider>
  );
};

export default App;
