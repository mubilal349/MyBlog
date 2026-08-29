import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  categories,
  categoryAccents,
  categoryLabels,
  getDisplayedBlogs,
} from "../pages/Blogdata";

/* ── Single blog card ── */
function BlogCard({ blog, index }) {
  const navigate = useNavigate();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 50);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/blog/${blog.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(`/blog/${blog.id}`);
      }}
      className="group cursor-pointer overflow-hidden rounded-xl border border-white/[0.08]
                 bg-white/[0.03] transition-all duration-200 hover:-translate-y-1
                 hover:border-violet-500/40 focus:outline-none focus-visible:ring-2
                 focus-visible:ring-violet-400/60"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease, border-color 0.2s",
      }}
    >
      <img
        src={blog.img}
        alt={blog.title}
        className="block h-[120px] w-full object-cover"
        onError={(e) => {
          e.target.style.minHeight = "120px";
          e.target.style.background = "#1a1a2e";
        }}
      />
      <div className="px-[14px] pb-4 pt-3">
        <span
          className={`mb-[7px] inline-block rounded-full px-[9px] py-[2px]
                      text-[10px] font-medium uppercase tracking-[0.04em]
                      ${categoryAccents[blog.cat]?.badge || "bg-white/10 text-gray-400"}`}
        >
          {blog.cat}
        </span>
        <p className="mb-1 text-[13px] font-medium leading-[1.3] text-[#e0e0f0]">
          {blog.title}
        </p>
        <p className="text-[11px] leading-[1.5] text-[#5e5e78]">{blog.desc}</p>
      </div>
    </div>
  );
}

/* ── Main Categories component ── */
const Categories = () => {
  const [selected, setSelected] = useState("all");
  const [shuffle, setShuffle] = useState(false);
  const [showWow, setShowWow] = useState(false);
  const wowRef = React.useRef(null);

  const rawBlogs = getDisplayedBlogs(selected);
  const displayedBlogs = shuffle
    ? [...rawBlogs].sort(() => Math.random() - 0.5)
    : rawBlogs;

  const handlePillClick = (path) => {
    setSelected(path);
    setShuffle(false);
    if (path !== "all") {
      setShowWow(true);
      setTimeout(
        () =>
          wowRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          }),
        100,
      );
    } else {
      setShowWow(false);
    }
  };

  return (
    <section
      className="bg-[#0a0a0f] text-[#e8e8f0]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Dark Hero Panel ── */}
      <div className="relative overflow-hidden border-b border-white/[0.07] px-8 pb-11 pt-14 text-center">
        {/* Glows */}
        <div
          className="pointer-events-none absolute -right-14 -top-14 h-64 w-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 left-1/4 h-52 w-52 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Eyebrow */}
        <div className="relative mb-4 inline-flex items-center gap-2">
          <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-violet-400 flex-shrink-0" />
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-violet-400">
            Discover · Explore · Learn
          </span>
        </div>

        {/* Title */}
        <h1
          className="relative mb-3 leading-[1.1] text-[#f1f0ff]"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.9rem, 5vw, 3rem)",
          }}
        >
          Explore what you{" "}
          <em className="italic text-violet-300">love to read</em>
        </h1>

        {/* Subtitle */}
        <p className="relative mx-auto mb-7 max-w-md text-[14px] font-light leading-[1.75] text-[#5e5e78]">
          Handpicked articles across tech, lifestyle, travel, health and
          education — find your next favourite read.
        </p>

        {/* Pill filters */}
        <div className="relative flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.path}
              onClick={() => handlePillClick(cat.path)}
              className={`inline-flex items-center gap-[5px] rounded-full px-[18px] py-[7px]
                          text-[12px] font-medium transition-all duration-150
                          ${
                            selected === cat.path
                              ? "border border-violet-600 bg-violet-700 text-white"
                              : "border border-white/[0.12] bg-white/[0.04] text-[#c4c4d4] hover:border-violet-400/40 hover:bg-violet-400/10 hover:text-violet-300"
                          }`}
            >
              <span aria-hidden="true" className="text-[13px]">
                {cat.icon}
              </span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-8 pb-16 pt-7">
        {/* Toolbar */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-[13px] text-[#5e5e78]">
            Showing{" "}
            <strong className="font-medium text-[#c4c4d4]">
              {displayedBlogs.length}
            </strong>{" "}
            articles
          </p>
          <button
            onClick={() => setShuffle((s) => !s)}
            className="inline-flex items-center gap-[5px] rounded-lg border border-white/[0.12]
                       bg-transparent px-[14px] py-[6px] text-[12px] text-[#5e5e78]
                       transition hover:border-violet-400/40 hover:bg-violet-400/[0.08] hover:text-violet-300"
          >
            ↻ Shuffle
          </button>
        </div>

        {/* Blog grid */}
        <div
          className="grid gap-[14px]"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
          }}
        >
          {displayedBlogs.map((blog, index) => (
            <BlogCard
              key={`${blog.cat}-${blog.id}`}
              blog={blog}
              index={index}
            />
          ))}
        </div>

        {/* "That's awesome!" banner */}
        {showWow && (
          <div
            ref={wowRef}
            className="mt-7 rounded-[14px] border border-violet-500/20 bg-violet-500/[0.06]
                       px-6 py-10 text-center"
          >
            <h2
              className="mb-1.5 text-[22px] text-[#f0f0f8]"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              That's awesome!
            </h2>
            <p className="mb-5 text-[13px] font-light text-[#5e5e78]">
              You found{" "}
              <strong className="font-medium text-violet-300">
                {categoryLabels[selected]}
              </strong>{" "}
              — keep exploring!
            </p>
            <button
              onClick={() => {
                setSelected("all");
                setShowWow(false);
                setShuffle(false);
              }}
              className="inline-flex items-center gap-2 rounded-[9px] bg-violet-700
                         px-6 py-2.5 text-[13px] font-medium text-white
                         transition hover:-translate-y-px hover:bg-violet-800"
            >
              → Explore all categories
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
