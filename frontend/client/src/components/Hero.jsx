import React from "react";
import { Link } from "react-router-dom";
import About from "./About";

const Hero = () => {
  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0a0f] sm:flex-row"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 left-1/3 h-64 w-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)",
        }}
      />

      {/* ── Image panel ── */}
      {/* Mobile: full-width banner on top | sm+: absolute right panel */}
      <div
        className="relative h-60 w-full flex-shrink-0 overflow-hidden
                      sm:absolute sm:right-0 sm:top-0 sm:h-full sm:w-[45%]
                      lg:w-[44%]"
      >
        <img
          src="https://c02.purpledshub.com/uploads/sites/41/2018/08/22-ideas-606ea9b.jpg?w=1410&webp=1"
          alt="Technology"
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.75) saturate(1.1)" }}
        />
        {/* Gradient fade — bottom on mobile, left on desktop */}
        <div
          className="absolute inset-0
                        [background:linear-gradient(to_bottom,transparent_40%,#0a0a0f_100%)]
                        sm:[background:linear-gradient(to_right,#0a0a0f_0%,transparent_50%)]"
        />

        {/* Floating badge */}
        <div
          className="absolute bottom-4 right-4 z-10 rounded-xl border border-white/10 px-3 py-2"
          style={{
            background: "rgba(10,10,15,0.78)",
            backdropFilter: "blur(10px)",
          }}
        >
          <p className="text-xs font-medium text-gray-200">Web Development</p>
          <span className="text-xs text-gray-500">Beginner friendly</span>
        </div>
      </div>

      {/* ── Content panel ── */}
      <div
        className="relative z-10 flex flex-col justify-center
                      px-6 pb-12 pt-6
                      sm:min-h-screen sm:w-[60%] sm:px-14 sm:py-16
                      lg:w-[58%] lg:px-16"
      >
        {/* Eyebrow */}
        <div className="mb-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 flex-shrink-0" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-violet-400">
            Technology · Sep 10, 2025
          </span>
        </div>

        {/* Title */}
        <h1
          className="mb-5 leading-[1.1] text-gray-100"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2.2rem, 7vw, 3.6rem)",
          }}
        >
          Build the web.
          <br />
          <em className="italic text-violet-300">Start today,</em>
          <br />
          for free.
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-md text-[15px] font-light leading-relaxed text-gray-400">
          Web development is one of the most in-demand skills today. HTML, CSS,
          JavaScript, and React — learn them online and unlock freelance work,
          startups, and a portfolio that speaks for itself.
        </p>

        {/* CTAs */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <a
            href="/about"
            className="inline-flex items-center gap-2 rounded-md bg-violet-700 px-5 py-3
                       text-sm font-medium text-white transition
                       hover:-translate-y-px hover:bg-violet-800"
          >
            Read article
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
          </a>
          <button
            className="inline-flex items-center gap-2 bg-transparent
                             text-sm text-gray-400 transition hover:text-gray-100"
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
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            Watch intro
          </button>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center
                            rounded-full text-xs font-medium text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              }}
            >
              MB
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">
                Muhammad Bilal
              </p>
              <span className="text-xs text-gray-500">Author & Developer</span>
            </div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <p className="text-sm font-medium text-gray-200">5 min</p>
            <span className="text-xs text-gray-500">read time</span>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <p className="text-sm font-medium text-gray-200">2.4k</p>
            <span className="text-xs text-gray-500">readers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
