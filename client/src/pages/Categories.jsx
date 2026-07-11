import React, { useState, useEffect, useRef } from "react";

const categories = [
  { name: "All", path: "all", icon: "⊞" },
  { name: "Technology", path: "technology", icon: "⚡" },
  { name: "Lifestyle", path: "lifestyle", icon: "◻" },
  { name: "Travel", path: "travel", icon: "➤" },
  { name: "Health", path: "health", icon: "♡" },
  { name: "Education", path: "education", icon: "◈" },
];

const blogs = {
  technology: [
    {
      title: "Latest trends in AI",
      desc: "How AI is shaping the future.",
      img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=70",
    },
    {
      title: "React vs Angular",
      desc: "A comparison of two giants.",
      img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=70",
    },
  ],
  lifestyle: [
    {
      title: "Minimalist living",
      desc: "Tips for a simpler life.",
      img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70",
    },
    {
      title: "Work-life balance",
      desc: "How to balance career and family.",
      img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=70",
    },
  ],
  travel: [
    {
      title: "Top 10 places in Europe",
      desc: "Must-visit destinations.",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=70",
    },
    {
      title: "Backpacking tips",
      desc: "Travel smart on a budget.",
      img: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&q=70",
    },
  ],
  health: [
    {
      title: "Healthy eating",
      desc: "Nutrition tips for a better life.",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=70",
    },
    {
      title: "Home workouts",
      desc: "Stay fit without a gym.",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=70",
    },
  ],
  education: [
    {
      title: "Online learning platforms",
      desc: "Best websites to learn.",
      img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=70",
    },
    {
      title: "Study hacks",
      desc: "Boost your productivity.",
      img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=70",
    },
  ],
};

// Dark-tinted badge colours per category
const badgeStyles = {
  technology: "bg-violet-500/15 text-violet-300",
  lifestyle: "bg-pink-500/12 text-pink-300",
  travel: "bg-emerald-500/12 text-emerald-300",
  health: "bg-amber-500/12 text-amber-300",
  education: "bg-blue-500/12 text-blue-300",
};

const categoryLabels = {
  technology: "Technology",
  lifestyle: "Lifestyle",
  travel: "Travel",
  health: "Health",
  education: "Education",
};

function getDisplayedBlogs(selected) {
  if (!selected || selected === "all") {
    return Object.entries(blogs).flatMap(([cat, items]) =>
      items.map((b) => ({ ...b, cat })),
    );
  }
  return (blogs[selected] || []).map((b) => ({ ...b, cat: selected }));
}

/* ── Single blog card ── */
function BlogCard({ blog, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 50);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-xl border border-white/[0.08]
                 bg-white/[0.03] transition-all duration-200 hover:-translate-y-1
                 hover:border-violet-500/40"
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
                      ${badgeStyles[blog.cat] || "bg-white/10 text-gray-400"}`}
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
  const wowRef = useRef(null);

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
              key={`${blog.cat}-${blog.title}-${index}`}
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
