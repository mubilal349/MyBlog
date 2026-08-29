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
import Blog from "./pages/Blog";

import Overview from "./pages/admin/Overview";
import Posts from "./pages/admin/Posts";
import UsersPage from "./pages/admin/Users";
import Comments from "./pages/admin/Comments";
import Settings from "./pages/admin/Settings";

import Chatbot from "./components/Chatboat";
import Privacy_policy from "./pages/Privacy_policy";
import Terms from "./pages/Terms";

/* ==========================================
   MAIN LAYOUT
   ========================================== */

const Layout = () => {
  const { user } = useAuth();

  const location = useLocation();

  /*
    Hide the public website layout
    when the user is inside admin pages.
  */
  const hideLayout =
    location.pathname === "/login" || location.pathname.startsWith("/admin");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* ==========================================
          PUBLIC NAVBAR
          ========================================== */}

      {!hideLayout && <Navbar />}

      {/* ==========================================
          MAIN CONTENT
          ========================================== */}

      <main className="flex-grow">
        <Routes>
          {/* ==========================================
              PUBLIC ROUTES
              ========================================== */}

          <Route path="/" element={<Hero />} />

          <Route path="/login" element={<Login />} />

          <Route path="/categories" element={<Categories />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/about" element={<About />} />

          <Route path="/blog" element={<Blog />} />

          <Route path="/blog/:slug" element={<BlogDetails />} />

          <Route path="/privacy-policy" element={<Privacy_policy />} />

          <Route path="/terms" element={<Terms />} />

          {/* ==========================================
              ADMIN ROUTES
              ========================================== */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "editor"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            {/* /admin */}
            <Route index element={<Navigate to="/admin/overview" replace />} />

            {/* /admin/overview */}
            <Route path="overview" element={<Overview />} />

            {/* /admin/posts */}
            <Route path="posts" element={<Posts />} />

            {/* /admin/users */}
            <Route path="users" element={<UsersPage />} />

            {/* /admin/comments */}
            <Route path="comments" element={<Comments />} />

            {/* /admin/settings */}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* ==========================================
              UNAUTHORIZED
              ========================================== */}

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ==========================================
              UNKNOWN ROUTES
              ========================================== */}

          <Route
            path="*"
            element={
              <Navigate to={user ? "/admin/overview" : "/login"} replace />
            }
          />
        </Routes>
      </main>

      {/* ==========================================
          PUBLIC FOOTER CONTENT
          ========================================== */}

      {/* Homepage sections */}
      {!hideLayout && location.pathname === "/" && (
        <>
          <About />
          <Categories />
          <Contact />
        </>
      )}

      {/* Global public components */}
      {!hideLayout && <Footer />}
      {!hideLayout && <Chatbot />}
    </div>
  );
};

/* ==========================================
   APP
   ========================================== */

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
