import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="relative overflow-hidden bg-[#0a0a0f]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute -right-10 -top-16 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-48 w-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Top grid — 4 columns on desktop ── */}
      <div
        className="relative grid grid-cols-1 gap-10 border-b border-white/[0.07]
                      px-8 pb-10 pt-14
                      sm:grid-cols-2
                      lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-12"
      >
        {/* ── Col 1 : Brand + Newsletter ── */}
        <div>
          <div className="mb-2.5 flex items-center gap-2">
            <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-violet-400 flex-shrink-0" />
            <span
              className="text-[21px] text-gray-100"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              MyBlog
            </span>
          </div>

          <p className="mb-5 text-[13px] font-light leading-[1.75] text-[#5e5e78]">
            A modern platform for tech, lifestyle, and personal insights.
            Stories that spark curiosity and inspire growth.
          </p>

          <p className="mb-2 text-[11px] tracking-[0.05em] text-[#3e3e58]">
            Subscribe our Newsletter
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="min-w-0 flex-1 rounded-lg border border-white/10
                         bg-white/[0.04] px-3 py-2 text-[12px] text-[#c4c4d4]
                         placeholder-[#3e3e58] outline-none focus:border-violet-500/40"
            />
            <button
              className="whitespace-nowrap rounded-lg bg-violet-700 px-4 py-2
                               text-[12px] font-medium text-white transition hover:bg-violet-800 cursor-pointer"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* ── Col 2 : Navigation ── */}
        <div>
          <p className="mb-[18px] text-[11px] font-medium uppercase tracking-[0.12em] text-violet-600">
            Navigation
          </p>
          <ul className="flex flex-col gap-[11px]">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Blog", to: "/blog" },
              { label: "Categories", to: "/categories" },
              { label: "Contact", to: "/contact" },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="group flex items-center gap-[7px] text-[13px]
                             font-light text-[#5e5e78] transition hover:text-violet-300"
                >
                  <span
                    className="h-1 w-1 flex-shrink-0 rounded-full bg-transparent
                                  transition group-hover:bg-violet-600"
                  />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3 : Topics ── */}
        <div>
          <p className="mb-[18px] text-[11px] font-medium uppercase tracking-[0.12em] text-violet-600">
            Topics
          </p>
          <ul className="flex flex-col gap-[11px]">
            {[
              "Web Development",
              "Design & UI",
              "Technology",
              "Freelancing",
              "Tutorials",
            ].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="group flex items-center gap-[7px] text-[13px]
                             font-light text-[#5e5e78] transition hover:text-violet-300"
                >
                  <span
                    className="h-1 w-1 flex-shrink-0 rounded-full bg-transparent
                                  transition group-hover:bg-violet-600"
                  />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 4 : Contact ── */}
        <div>
          <p className="mb-[18px] text-[11px] font-medium uppercase tracking-[0.12em] text-violet-600">
            Contact
          </p>

          {[
            {
              label: "Email",
              value: "info@myblog.com",
              icon: (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              ),
            },
            {
              label: "Phone",
              value: "+1 234 567 890",
              icon: (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.38 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
                </svg>
              ),
            },
          ].map(({ label, value, icon }) => (
            <div key={label} className="mb-[13px] flex items-start gap-2.5">
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center
                              rounded-[7px] border border-violet-500/20 bg-violet-500/10
                              text-violet-400"
              >
                {icon}
              </div>
              <div>
                <p className="mb-0.5 text-[11px] text-[#3e3e58]">{label}</p>
                <p className="text-[13px] font-light text-[#5e5e78]">{value}</p>
              </div>
            </div>
          ))}

          {/* Social icons */}
          <div className="mt-4 flex gap-2">
            {[
              {
                label: "Facebook",
                d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
              },
              {
                label: "Twitter",
                d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
              },
              {
                label: "LinkedIn",
                d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
              },
              {
                label: "Instagram",
                d: "M9 2H15A7 7 0 0 1 22 9V15A7 7 0 0 1 15 22H9A7 7 0 0 1 2 15V9A7 7 0 0 1 9 2zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm6.5-1a1 1 0 1 0-2 0 1 1 0 0 0 2 0z",
              },
            ].map(({ label, d }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg
                           border border-white/10 bg-white/[0.03] text-[#5e5e78]
                           transition hover:border-violet-700 hover:bg-violet-700/10
                           hover:text-violet-300"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-5 lg:px-12">
        <p className="text-[12px] font-light text-[#3e3e58]">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-violet-600">MyBlog</span>. All rights reserved.
          Crafted by <span className="text-violet-600">Muhammad Bilal</span>.
        </p>
        <div className="flex items-center gap-3.5">
          <a
            href="#"
            className="text-[11px] text-[#3e3e58] transition hover:text-gray-500"
          >
            Privacy Policy
          </a>
          <span className="text-white/10">·</span>
          <a
            href="#"
            className="text-[11px] text-[#3e3e58] transition hover:text-gray-500"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
