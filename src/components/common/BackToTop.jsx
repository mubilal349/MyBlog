import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const visibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", visibility);
    return () => {
      window.removeEventListener("scroll", visibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };
  return (
    <div>
      {visible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20 cursor-pointer"
          aria-label="Back To Top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default BackToTop;
