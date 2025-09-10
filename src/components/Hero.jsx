import React from "react";
import { Link } from "react-router-dom";
import About from "./About";

const Hero = () => {
  return (
    <>
      <section className="flex items-center justify-center min-h-screen ">
        <div className="w-full max-w-5xl mt-5  bg-gray-100 rounded-xl">
          <div className="pt-14 px-14">
            <img
              src="https://c02.purpledshub.com/uploads/sites/41/2018/08/22-ideas-606ea9b.jpg?w=1410&webp=1"
              alt="Technology"
              className="rounded-xl w-full h-65  object-cover "
            />
            <div className="p-6 pt-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold  text-gray-700">
                    Sep 10 , 2025 . Muhammad Bilal
                  </h3>
                  <span className="flex flex-col items-end  pt-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer">
                      <a href="/about" className="smooth">
                        Learn More
                      </a>
                    </button>
                  </span>
                  <div className="pt-4">
                    <h2 className="text-2xl font-bold text-gray-600">
                      Technology
                    </h2>
                    <p className="text-xl font-serif pt-2">
                      Web development is one of the most in-demand skills today.
                      Whether you want to build your own startup, create a
                      portfolio, or work as a freelancer, knowing HTML, CSS,
                      JavaScript, and React can open up endless opportunities.
                      The best part? You can start learning online for free.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
