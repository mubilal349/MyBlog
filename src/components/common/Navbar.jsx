import React, { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false); // for mobile dropdown
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Categories", path: "/categories" },
    { name: "👤 Profile", path: "/login" },
  ];

  const categories = ["Tech", "Lifestyle", "Travel", "Food"];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 h-16 transition ${
        scrolled ? "bg-gray-800 text-white shadow-md" : "bg-black text-white"
      }`}
    >
      {/* Logo */}
      <div className="text-xl font-bold cursor-pointer">MyBlog</div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 mx-6">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search Blogs..."
          className="w-full px-4 py-2 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex gap-6 items-center">
        {NavItems.map((link, index) => {
          if (link.name === "Categories") {
            return (
              <li key={index} className="relative group cursor-pointer">
                <span className="hover:text-blue-400">{link.name}</span>
                {/* Dropdown on hover */}
                <ul className="absolute hidden group-hover:block bg-white text-black mt-2 rounded shadow-md">
                  {categories.map((cat, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </li>
            );
          }
          return (
            <li key={index}>
              <Link
                to={link.path}
                className="hover:text-blue-400 transition-colors"
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Hamburger Icon (Mobile/Tablet) */}
      <div className="md:hidden">
        {menuOpen ? (
          <HiX
            className="text-2xl cursor-pointer"
            onClick={() => setMenuOpen(false)}
          />
        ) : (
          <HiMenu
            className="text-2xl cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white text-black flex flex-col items-center gap-4 py-6 shadow-md md:hidden">
          {/* Search inside mobile menu */}
          <input
            type="text"
            placeholder="Search Blogs..."
            className="w-11/12 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {NavItems.map((link, index) => {
            if (link.name === "Categories") {
              return (
                <div key={index} className="w-full text-center">
                  <button
                    onClick={() => setCatOpen(!catOpen)}
                    className="w-full py-2 hover:text-blue-500"
                  >
                    {link.name}
                  </button>
                  {catOpen && (
                    <ul className="bg-gray-100 rounded shadow-md w-40 mx-auto">
                      {categories.map((cat, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {cat}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={index}
                to={link.path}
                className="hover:text-blue-500 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
