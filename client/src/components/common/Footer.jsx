import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">MyBlog</h2>
          <p className="text-gray-400">
            MyBlog is a modern blog platform sharing tech, lifestyle, and
            personal insights. Stay updated with our latest articles!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-indigo-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-500 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-indigo-500 transition">
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="hover:text-indigo-500 transition"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-500 transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Contact</h2>
          <p>Email: info@myblog.com</p>
          <p>Phone: +1 234 567 890</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-indigo-500 transition">
              Facebook
            </a>
            <a href="#" className="hover:text-indigo-500 transition">
              Twitter
            </a>
            <a href="#" className="hover:text-indigo-500 transition">
              LinkedIn
            </a>
            <a href="#" className="hover:text-indigo-500 transition">
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} MyBlog. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
