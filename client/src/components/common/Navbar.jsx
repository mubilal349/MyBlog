import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const blogs = [
  { id: 1, title: "React Basics", category: "Frontend" },
  { id: 2, title: "Node.js API Development", category: "Backend" },
  { id: 3, title: "MongoDB Guide", category: "Database" },
  { id: 4, title: "Express.js Crash Course", category: "Backend" },
  { id: 5, title: "CSS Grid & Flexbox", category: "Frontend" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) {
      setShowResults(false);
      return;
    }
    const results = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(val.toLowerCase()) ||
        b.category.toLowerCase().includes(val.toLowerCase()),
    );
    setFilteredBlogs(results.length ? results : blogs);
    setShowResults(true);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/blog", label: "Blog" },
    { to: "/categories", label: "Categories" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 border-b border-white/[0.07]
        ${
          isSticky
            ? "fixed top-0 bg-[#0a0a0f]/97 shadow-[0_1px_32px_rgba(124,58,237,0.10)]"
            : "absolute bg-[#0a0a0f]/85 backdrop-blur-xl"
        }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-6">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            <span className="w-[7px] h-[7px] rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[1.3rem] text-gray-100 tracking-tight">
              MyBlog
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm px-3 py-1.5 rounded-md transition-all
                  ${
                    isActive(to)
                      ? "text-violet-300"
                      : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Search — desktop */}
          <div
            ref={searchRef}
            className="hidden md:block relative flex-shrink-0"
          >
            <div
              className="flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden
                            focus-within:border-violet-400/50 transition-colors"
            >
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-transparent outline-none text-gray-200 placeholder-gray-600
                           text-[13px] px-3 py-[7px] w-40"
              />
              <button
                className="border-l border-white/[0.08] px-3 py-[7px] text-gray-500
                                 hover:text-violet-400 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>

            {/* Search dropdown */}
            {showResults && (
              <div
                className="absolute top-full right-0 mt-2 w-64 bg-[#13131a]
                              border border-white/10 rounded-xl overflow-hidden
                              shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50"
              >
                {filteredBlogs.map((b) => (
                  <div
                    key={b.id}
                    className="px-4 py-2.5 border-b border-white/[0.06] last:border-0
                               hover:bg-violet-500/10 cursor-pointer transition-colors"
                  >
                    <p className="text-[13px] font-medium text-gray-200">
                      {b.title}
                    </p>
                    <span className="text-[11px] text-gray-500">
                      {b.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth — desktop */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <>
                <span className="text-[13px] text-gray-400">
                  Hey, {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-[13px] text-gray-400 border border-white/10 px-4 py-1.5
                             rounded-md bg-white/5 hover:bg-white/10 hover:text-gray-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-[13px] font-medium bg-violet-700 hover:bg-violet-800
                           text-white px-4 py-2 rounded-md transition hover:-translate-y-px"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center border border-white/10
                       rounded-lg p-1.5 text-gray-400 hover:text-gray-100
                       hover:bg-white/5 transition"
          >
            {menuOpen ? (
              <HiOutlineX className="w-5 h-5" />
            ) : (
              <HiOutlineMenu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/[0.07] bg-[#0a0a0f]/98
                        px-6 py-4 flex flex-col gap-1"
        >
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between text-[15px] py-2.5
                          border-b border-white/[0.05] last:border-0 transition
                          ${isActive(to) ? "text-violet-300" : "text-gray-400 hover:text-gray-100"}`}
            >
              {label}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}

          {/* Mobile search */}
          <div className="flex mt-3 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-200
                         placeholder-gray-600 text-sm px-4 py-2.5"
            />
            <button
              className="bg-violet-700 hover:bg-violet-800 text-white text-sm
                               font-medium px-4 transition"
            >
              Go
            </button>
          </div>

          {/* Mobile results */}
          {showResults && filteredBlogs.length > 0 && (
            <div className="mt-1 bg-[#13131a] border border-white/10 rounded-xl overflow-hidden">
              {filteredBlogs.map((b) => (
                <div
                  key={b.id}
                  className="px-4 py-2.5 border-b border-white/[0.06] last:border-0
                             hover:bg-violet-500/10 cursor-pointer transition-colors"
                >
                  <p className="text-[13px] font-medium text-gray-200">
                    {b.title}
                  </p>
                  <span className="text-[11px] text-gray-500">
                    {b.category}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Mobile auth */}
          <div className="mt-3">
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-400">
                  Hey, {user.username}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm border border-white/10 text-gray-400
                             rounded-md bg-white/5 hover:bg-white/10 hover:text-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center w-full py-2.5 text-sm font-medium
                           bg-violet-700 hover:bg-violet-800 text-white rounded-md transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
