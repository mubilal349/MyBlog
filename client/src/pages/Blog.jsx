import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Activity,
  Clock3,
  Grid2X2,
  Heart,
  MessageCircle,
  Plane,
  Sparkles,
  Zap,
} from "lucide-react";

import { getPublishedBlogs, toggleBlogLike } from "../services/blogServices.js";

const BLOGS_PER_LOAD = 6;

const categoryIcons = {
  All: <Grid2X2 size={15} />,
  Technology: <Zap size={15} />,
  React: <Sparkles size={15} />,
  Lifestyle: <Activity size={15} />,
  Travel: <Plane size={15} />,
  Health: <Heart size={15} />,
};

function readTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(date) {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [likingBlogId, setLikingBlogId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_LOAD);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadMoreRef = useRef(null);

  // ==========================================
  // LIKE / UNLIKE BLOG
  // ==========================================

  const handleLike = async (blogId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to like this blog.");
      return;
    }

    if (likingBlogId === blogId) {
      return;
    }

    try {
      setLikingBlogId(blogId);

      const result = await toggleBlogLike(blogId);

      console.log("Like response:", result);

      setBlogs((previousBlogs) =>
        previousBlogs.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                likesCount: result.likesCount,
              }
            : blog,
        ),
      );
    } catch (error) {
      console.error("Like failed:", error);

      alert(
        error.response?.data?.error ||
          error.message ||
          "Failed to update like.",
      );
    } finally {
      setLikingBlogId(null);
    }
  };

  // ==========================================
  // LOAD PUBLISHED BLOGS
  // ==========================================

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPublishedBlogs();

        console.log("Published blogs response:", data);

        /*
          Your backend may return:

          {
            blogs: [...]
          }

          OR

          [...]
        */

        const blogList = Array.isArray(data)
          ? data
          : Array.isArray(data?.blogs)
            ? data.blogs
            : [];

        /*
          Extra safety:
          Only display Published posts.
        */

        const publishedBlogs = blogList.filter(
          (blog) =>
            !blog.status || String(blog.status).toLowerCase() === "published",
        );

        setBlogs(publishedBlogs);
      } catch (err) {
        console.error("Failed to load published blogs:", err);

        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to load blogs. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        blogs
          .map((blog) => blog.category)
          .filter((category) => category && category.trim()),
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [blogs]);

  // ==========================================
  // FILTER BLOGS
  // ==========================================

  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "All") {
      return blogs;
    }

    return blogs.filter(
      (blog) =>
        String(blog.category || "").toLowerCase() ===
        selectedCategory.toLowerCase(),
    );
  }, [blogs, selectedCategory]);

  // ==========================================
  // VISIBLE BLOGS
  // ==========================================

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);

  const hasMore = visibleCount < filteredBlogs.length;

  // ==========================================
  // RESET PAGINATION WHEN CATEGORY CHANGES
  // ==========================================

  useEffect(() => {
    setVisibleCount(BLOGS_PER_LOAD);
  }, [selectedCategory]);

  // ==========================================
  // INFINITE SCROLL
  // ==========================================

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (!firstEntry.isIntersecting) return;

        if (loadingMore) return;

        setLoadingMore(true);

        setTimeout(() => {
          setVisibleCount((previous) =>
            Math.min(previous + BLOGS_PER_LOAD, filteredBlogs.length),
          );

          setLoadingMore(false);
        }, 400);
      },
      {
        rootMargin: "300px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, filteredBlogs.length, loadingMore]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="blog-signal-page">
        <style>{styles}</style>

        <div className="blog-loading">
          <div className="blog-spinner" />

          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="blog-signal-page">
        <style>{styles}</style>

        <div className="blog-error">
          <Activity size={40} />

          <h2>Signal lost.</h2>

          <p>{error}</p>

          <button
            className="blog-retry"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-signal-page">
      <style>{styles}</style>

      {/* ==========================================
          HERO
      ========================================== */}

      <section className="blog-hero">
        <div className="blog-hero-glow blog-glow-one" />
        <div className="blog-hero-glow blog-glow-two" />

        <div className="blog-hero-inner">
          <div className="blog-eyebrow">
            <span className="blog-live-dot" />
            DISCOVER · EXPLORE · LEARN
          </div>

          <h1 className="blog-heading">
            Explore what{" "}
            <span className="blog-heading-accent">you love to</span> read.
          </h1>

          <p className="blog-subtitle">
            Handpicked articles across tech, lifestyle, travel, health and
            education — find your next favourite read.
          </p>

          {/* ==========================================
              CATEGORY FILTER
          ========================================== */}

          <div className="blog-category-wrapper">
            <div className="blog-category-scroll">
              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`blog-category ${
                      isActive ? "blog-category-active" : ""
                    }`}
                  >
                    {categoryIcons[category] || <Sparkles size={15} />}

                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          BLOG CONTENT
      ========================================== */}

      <main className="blog-content">
        {/* TOP INFORMATION */}

        <div className="blog-content-header">
          <div>
            <span className="blog-section-label">
              <Activity size={13} />
              LATEST SIGNALS
            </span>

            <h2>
              {selectedCategory === "All"
                ? "Latest articles"
                : selectedCategory}
            </h2>
          </div>

          <div className="blog-count">
            {filteredBlogs.length}{" "}
            {filteredBlogs.length === 1 ? "article" : "articles"}
          </div>
        </div>

        {/* ==========================================
            EMPTY CATEGORY
        ========================================== */}

        {filteredBlogs.length === 0 ? (
          <div className="blog-empty">
            <Activity size={42} />

            <h3>No articles found</h3>

            <p>There are currently no published articles in this category.</p>

            <button type="button" onClick={() => setSelectedCategory("All")}>
              View all articles
            </button>
          </div>
        ) : (
          <>
            {/* ==========================================
                BLOG GRID
            ========================================== */}

            <div className="blog-grid">
              {visibleBlogs.map((blog, index) => {
                const minutes = readTime(blog.content || blog.excerpt || "");

                return (
                  <article
                    key={blog._id}
                    className="blog-card"
                    style={{
                      animationDelay: `${Math.min(index, 5) * 70}ms`,
                    }}
                  >
                    {/* IMAGE */}

                    <Link
                      to={`/blog/${blog.slug}`}
                      className="blog-card-image-link"
                    >
                      <div className="blog-card-image-wrapper">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="blog-card-image"
                            loading={index < 3 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="blog-no-image">
                            <Activity size={28} />
                            <span>NO IMAGE</span>
                          </div>
                        )}

                        <div className="blog-card-image-overlay" />

                        <span className="blog-card-number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="blog-read-button">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                    </Link>

                    {/* CARD CONTENT */}

                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <span className="blog-card-category">
                          {blog.category || "Technology"}
                        </span>

                        <span className="blog-meta-separator">·</span>

                        <span>
                          <Clock3 size={12} />
                          {minutes} min
                        </span>
                      </div>

                      <Link
                        to={`/blog/${blog.slug}`}
                        className="blog-card-title"
                      >
                        {blog.title}
                      </Link>

                      {blog.excerpt && (
                        <p className="blog-card-excerpt">{blog.excerpt}</p>
                      )}

                      <div className="mt-5 flex items-center gap-3">
                        {/* LIKES */}
                        <button
                          type="button"
                          onClick={() => handleLike(blog._id)}
                          disabled={likingBlogId === blog._id}
                          className="
    group
    inline-flex
    items-center
    gap-2
    rounded-full
    border border-white/10
    bg-white/[0.04]
    px-3.5
    py-2
    text-white/70
    transition-all
    duration-300
    hover:border-rose-400/30
    hover:bg-rose-400/[0.08]
    hover:text-rose-300
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
                        >
                          <Heart
                            size={14}
                            strokeWidth={1.8}
                            className="
      transition-all
      duration-300
      group-hover:scale-110
      group-hover:fill-rose-400
      group-hover:text-rose-400
    "
                          />

                          <span className="text-xs font-semibold text-white/90">
                            {Number(blog.likesCount ?? blog.likes?.length ?? 0)}
                          </span>

                          <span className="text-[10px] uppercase tracking-wider text-white/40">
                            Likes
                          </span>
                        </button>

                        {/* COMMENTS */}
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="
    inline-flex
    items-center
    gap-2
    rounded-full
    border border-white/10
    bg-white/[0.04]
    px-3
    py-2
    text-white/70
    transition-all
    duration-300
    hover:border-violet-400/30
    hover:bg-violet-400/[0.08]
    hover:text-violet-300
  "
                        >
                          <MessageCircle size={14} strokeWidth={1.8} />

                          <span className="text-xs font-semibold text-white/90">
                            {Number(blog.commentsCount ?? 0)}
                          </span>

                          <span className="text-[10px] uppercase tracking-wider text-white/40">
                            Comments
                          </span>
                        </Link>
                      </div>

                      <div className="blog-card-footer">
                        <div className="blog-author">
                          <div className="blog-avatar">
                            {(blog.author?.username || blog.author?.name || "A")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <span className="blog-author-label">
                              WRITTEN BY
                            </span>

                            <strong>
                              {blog.author?.username ||
                                blog.author?.name ||
                                "Admin"}
                            </strong>
                          </div>
                        </div>

                        <span className="blog-date">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ==========================================
                INFINITE SCROLL TRIGGER
            ========================================== */}

            <div ref={loadMoreRef} className="blog-load-more">
              {loadingMore && (
                <>
                  <div className="blog-small-spinner" />

                  <span>Loading more articles...</span>
                </>
              )}

              {!hasMore && visibleBlogs.length > 0 && (
                <div className="blog-end">
                  <span />
                  <p>You've reached the end.</p>
                  <span />
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');


/* =====================================================
   ROOT
===================================================== */

.blog-signal-page {
  --ink: #090a0f;
  --ink-soft: #11131a;
  --ink-card: #12141b;
  --ink-card-hover: #171a22;

  --line: rgba(237, 234, 225, 0.10);
  --line-strong: rgba(237, 234, 225, 0.16);

  --paper: #edeae1;
  --paper-soft: #c9c7c0;
  --paper-dim: #858995;

  --signal: #8b5cf6;
  --signal-light: #a78bfa;

  --cyan: #5eead4;
  --amber: #f2a65a;

  min-height: 100vh;
  background: var(--ink);
  color: var(--paper);
  font-family: Inter, sans-serif;
  overflow-x: hidden;
}


/* =====================================================
   HERO
===================================================== */

.blog-hero {
  position: relative;
  min-height: 520px;

  display: flex;
  align-items: center;

  overflow: hidden;

  border-bottom: 1px solid var(--line);

  background:
    radial-gradient(
      circle at 22% 50%,
      rgba(139, 92, 246, 0.10),
      transparent 28%
    ),
    radial-gradient(
      circle at 75% 40%,
      rgba(94, 234, 212, 0.045),
      transparent 30%
    ),
    var(--ink);
}

.blog-hero-inner {
  width: 100%;
  max-width: 1250px;

  margin: 0 auto;

  padding: 90px 32px 70px;

  position: relative;
  z-index: 2;
}


/* =====================================================
   GLOW
===================================================== */

.blog-hero-glow {
  position: absolute;

  width: 360px;
  height: 360px;

  border-radius: 50%;

  filter: blur(100px);

  pointer-events: none;

  opacity: .45;
}

.blog-glow-one {
  left: 2%;
  top: 30%;

  background: rgba(139, 92, 246, .10);
}

.blog-glow-two {
  right: 5%;
  top: 15%;

  background: rgba(94, 234, 212, .04);
}


/* =====================================================
   EYEBROW
===================================================== */

.blog-eyebrow {
  display: flex;
  align-items: center;

  gap: 10px;

  width: fit-content;

  margin-left: auto;
  margin-right: 8%;

  margin-bottom: 42px;

  color: var(--signal-light);

  font-family: 'JetBrains Mono', monospace;

  font-size: 12px;

  letter-spacing: .14em;

  text-transform: uppercase;
}

.blog-live-dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: var(--signal-light);

  box-shadow:
    0 0 0 5px rgba(167, 139, 250, .08),
    0 0 18px rgba(167, 139, 250, .55);

  animation: blog-pulse 2s ease-in-out infinite;
}

@keyframes blog-pulse {
  0%,
  100% {
    opacity: .6;
  }

  50% {
    opacity: 1;
  }
}


/* =====================================================
   HEADING
===================================================== */

.blog-heading {
  max-width: 900px;

  margin: 0 auto 24px;

  text-align: center;

  font-family: Fraunces, serif;

  font-weight: 600;

  font-size: clamp(
    48px,
    7vw,
    86px
  );

  line-height: .98;

  letter-spacing: -.035em;

  color: #f5f3ee;
}

.blog-heading-accent {
  font-style: italic;

  color: var(--signal-light);
}


/* =====================================================
   SUBTITLE
===================================================== */

.blog-subtitle {
  max-width: 650px;

  margin: 0 auto 42px;

  text-align: center;

  color: #70758a;

  font-size: 17px;

  line-height: 1.8;
}


/* =====================================================
   CATEGORY FILTER
===================================================== */

.blog-category-wrapper {
  width: 100%;

  overflow: hidden;
}

.blog-category-scroll {
  display: flex;

  justify-content: center;

  gap: 12px;

  overflow-x: auto;

  padding: 5px 4px 10px;

  scrollbar-width: none;
}

.blog-category-scroll::-webkit-scrollbar {
  display: none;
}

.blog-category {
  flex-shrink: 0;

  display: inline-flex;

  align-items: center;

  gap: 9px;

  height: 54px;

  padding: 0 22px;

  border-radius: 999px;

  border: 1px solid var(--line-strong);

  background: rgba(255,255,255,.025);

  color: #bbbcc4;

  font-size: 15px;

  font-weight: 500;

  cursor: pointer;

  transition:
    background .2s ease,
    border-color .2s ease,
    color .2s ease,
    transform .2s ease,
    box-shadow .2s ease;
}

.blog-category:hover {
  color: var(--paper);

  border-color: rgba(167,139,250,.4);

  background: rgba(139,92,246,.08);

  transform: translateY(-2px);
}

.blog-category-active {
  color: white;

  border-color: transparent;

  background: linear-gradient(
    135deg,
    #7c3aed,
    #8b5cf6
  );

  box-shadow:
    0 10px 35px rgba(124,58,237,.25);

  padding-left: 24px;
  padding-right: 24px;
}

.blog-category-active:hover {
  color: white;

  background: linear-gradient(
    135deg,
    #7c3aed,
    #8b5cf6
  );

  transform: translateY(-2px);
}


/* =====================================================
   CONTENT
===================================================== */

.blog-content {
  width: 100%;

  max-width: 1250px;

  margin: 0 auto;

  padding: 70px 32px 110px;
}


/* =====================================================
   CONTENT HEADER
===================================================== */

.blog-content-header {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 30px;

  margin-bottom: 34px;

  padding-bottom: 22px;

  border-bottom: 1px solid var(--line);
}

.blog-section-label {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-bottom: 10px;

  color: var(--cyan);

  font-family: 'JetBrains Mono', monospace;

  font-size: 10px;

  letter-spacing: .14em;
}

.blog-content-header h2 {
  margin: 0;

  font-family: Fraunces, serif;

  font-size: 38px;

  font-weight: 500;

  letter-spacing: -.02em;

  color: var(--paper);
}

.blog-count {
  color: var(--paper-dim);

  font-family: 'JetBrains Mono', monospace;

  font-size: 11px;

  letter-spacing: .05em;
}


/* =====================================================
   GRID
===================================================== */

.blog-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 26px;
}


/* =====================================================
   CARD
===================================================== */

.blog-card {
  min-width: 0;

  overflow: hidden;

  background: var(--ink-card);

  border: 1px solid var(--line);

  border-radius: 12px;

  transition:
    transform .3s ease,
    border-color .3s ease,
    background .3s ease,
    box-shadow .3s ease;

  animation:
    blog-card-in .5s ease both;
}

@keyframes blog-card-in {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.blog-card:hover {
  transform: translateY(-6px);

  background: var(--ink-card-hover);

  border-color: rgba(167,139,250,.25);

  box-shadow:
    0 20px 55px rgba(0,0,0,.25);
}


/* =====================================================
   CARD IMAGE
===================================================== */

.blog-card-image-link {
  display: block;

  text-decoration: none;
}

.blog-card-image-wrapper {
  position: relative;

  width: 100%;

  height: 235px;

  overflow: hidden;

  background: var(--ink-soft);
}

.blog-card-image {
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;

  filter:
    saturate(.85)
    contrast(1.02);

  transition:
    transform .5s ease,
    filter .5s ease;
}

.blog-card:hover .blog-card-image {
  transform: scale(1.045);

  filter:
    saturate(1)
    contrast(1.05);
}

.blog-card-image-overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(0,0,0,.55),
      transparent 55%
    );

  pointer-events: none;
}

.blog-no-image {
  width: 100%;
  height: 100%;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 10px;

  color: var(--paper-dim);

  font-family: 'JetBrains Mono', monospace;

  font-size: 10px;

  letter-spacing: .12em;
}


/* =====================================================
   IMAGE NUMBER
===================================================== */

.blog-card-number {
  position: absolute;

  left: 16px;
  bottom: 14px;

  color: rgba(255,255,255,.75);

  font-family: 'JetBrains Mono', monospace;

  font-size: 10px;

  letter-spacing: .1em;
}


/* =====================================================
   READ BUTTON
===================================================== */

.blog-read-button {
  position: absolute;

  right: 15px;
  bottom: 14px;

  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: rgba(9,10,15,.65);

  backdrop-filter: blur(10px);

  color: white;

  border: 1px solid rgba(255,255,255,.15);

  transition:
    transform .25s ease,
    background .25s ease;
}

.blog-card:hover .blog-read-button {
  transform: translate(2px,-2px);

  background: var(--signal);
}


/* =====================================================
   CARD BODY
===================================================== */

.blog-card-body {
  padding: 22px 22px 20px;
}


/* =====================================================
   CARD META
===================================================== */

.blog-card-meta {
  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 12px;

  color: var(--paper-dim);

  font-family: 'JetBrains Mono', monospace;

  font-size: 10px;
}

.blog-card-meta > span:last-child {
  display: inline-flex;

  align-items: center;

  gap: 4px;
}

.blog-card-category {
  color: var(--amber);

  text-transform: uppercase;

  letter-spacing: .09em;
}

.blog-meta-separator {
  color: var(--line-strong);
}


/* =====================================================
   TITLE
===================================================== */

.blog-card-title {
  display: block;

  color: var(--paper);

  font-family: Fraunces, serif;

  font-size: 25px;

  line-height: 1.18;

  font-weight: 500;

  letter-spacing: -.015em;

  text-decoration: none;

  transition: color .2s ease;
}

.blog-card-title:hover {
  color: var(--signal-light);
}


/* =====================================================
   EXCERPT
===================================================== */

.blog-card-excerpt {
  display: -webkit-box;

  -webkit-line-clamp: 3;

  -webkit-box-orient: vertical;

  overflow: hidden;

  margin: 12px 0 20px;

  color: var(--paper-dim);

  font-size: 14px;

  line-height: 1.7;
}


/* =====================================================
   CARD FOOTER
===================================================== */

.blog-card-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  padding-top: 17px;

  border-top: 1px solid var(--line);
}

.blog-author {
  display: flex;

  align-items: center;

  gap: 9px;

  min-width: 0;
}

.blog-avatar {
  flex-shrink: 0;

  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #312e81,
      #7c3aed
    );

  color: white;

  font-family: 'JetBrains Mono', monospace;

  font-size: 11px;
}

.blog-author > div:last-child {
  display: flex;

  flex-direction: column;

  min-width: 0;
}

.blog-author-label {
  color: #626675;

  font-family: 'JetBrains Mono', monospace;

  font-size: 8px;

  letter-spacing: .08em;
}

.blog-author strong {
  max-width: 120px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: var(--paper-soft);

  font-size: 11px;

  font-weight: 500;
}

.blog-date {
  flex-shrink: 0;

  color: #626675;

  font-family: 'JetBrains Mono', monospace;

  font-size: 9px;
}


/* =====================================================
   INFINITE SCROLL
===================================================== */

.blog-load-more {
  min-height: 90px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  color: var(--paper-dim);

  font-family: 'JetBrains Mono', monospace;

  font-size: 10px;

  letter-spacing: .04em;
}

.blog-small-spinner {
  width: 18px;
  height: 18px;

  border: 2px solid var(--line);

  border-top-color: var(--signal-light);

  border-radius: 50%;

  animation: blog-spin .7s linear infinite;
}

@keyframes blog-spin {
  to {
    transform: rotate(360deg);
  }
}

.blog-end {
  width: 100%;

  display: flex;

  align-items: center;

  gap: 15px;
}

.blog-end span {
  height: 1px;

  flex: 1;

  background: var(--line);
}

.blog-end p {
  white-space: nowrap;

  color: #626675;

  font-family: 'JetBrains Mono', monospace;

  font-size: 9px;

  letter-spacing: .08em;

  text-transform: uppercase;
}


/* =====================================================
   EMPTY
===================================================== */

.blog-empty {
  min-height: 360px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  text-align: center;

  border: 1px dashed var(--line-strong);

  border-radius: 14px;

  color: var(--paper-dim);
}

.blog-empty svg {
  color: var(--signal-light);

  margin-bottom: 15px;
}

.blog-empty h3 {
  margin: 0 0 8px;

  color: var(--paper);

  font-family: Fraunces, serif;

  font-size: 28px;
}

.blog-empty p {
  margin: 0 0 20px;

  font-size: 14px;
}

.blog-empty button,
.blog-retry {
  border: 1px solid rgba(167,139,250,.35);

  background: rgba(139,92,246,.08);

  color: var(--signal-light);

  padding: 10px 17px;

  border-radius: 999px;

  cursor: pointer;

  font-family: 'JetBrains Mono', monospace;

  font-size: 11px;

  transition: .2s ease;
}

.blog-empty button:hover,
.blog-retry:hover {
  background: var(--signal);

  color: white;

  border-color: var(--signal);
}


/* =====================================================
   LOADING
===================================================== */

.blog-loading {
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 16px;

  color: var(--paper-dim);

  font-family: 'JetBrains Mono', monospace;

  font-size: 11px;
}

.blog-spinner {
  width: 42px;
  height: 42px;

  border: 3px solid var(--line);

  border-top-color: var(--signal-light);

  border-radius: 50%;

  animation: blog-spin .8s linear infinite;
}


/* =====================================================
   ERROR
===================================================== */

.blog-error {
  min-height: 100vh;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 12px;

  padding: 30px;

  text-align: center;

  color: var(--paper-dim);
}

.blog-error svg {
  color: var(--signal-light);
}

.blog-error h2 {
  margin: 5px 0;

  color: var(--paper);

  font-family: Fraunces, serif;

  font-size: 36px;
}

.blog-error p {
  max-width: 500px;

  margin: 0 0 10px;

  font-size: 14px;
}


/* =====================================================
   TABLET
===================================================== */

@media (max-width: 1000px) {

  .blog-hero-inner {
    padding-left: 24px;
    padding-right: 24px;
  }

  .blog-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .blog-eyebrow {
    margin-right: 0;

    justify-content: center;
  }
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 650px) {

  .blog-hero {
    min-height: auto;
  }

  .blog-hero-inner {
    padding:
      65px
      18px
      45px;
  }

  .blog-eyebrow {
    margin-bottom: 28px;

    font-size: 9px;

    letter-spacing: .10em;
  }

  .blog-heading {
    font-size: 48px;

    line-height: 1;
  }

  .blog-subtitle {
    font-size: 14px;

    line-height: 1.7;

    margin-bottom: 30px;
  }

  .blog-category-scroll {
    justify-content: flex-start;

    padding-left: 0;
  }

  .blog-category {
    height: 47px;

    padding:
      0 17px;

    font-size: 13px;
  }

  .blog-content {
    padding:
      45px
      18px
      80px;
  }

  .blog-content-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 10px;
  }

  .blog-content-header h2 {
    font-size: 32px;
  }

  .blog-grid {
    grid-template-columns: 1fr;

    gap: 20px;
  }

  .blog-card-image-wrapper {
    height: 225px;
  }

  .blog-card-title {
    font-size: 24px;
  }

  .blog-card-body {
    padding: 20px;
  }

  .blog-card-footer {
    align-items: flex-start;

    flex-direction: column;
  }

  .blog-date {
    margin-left: 39px;
  }
}


/* =====================================================
   SMALL MOBILE
===================================================== */

@media (max-width: 400px) {

  .blog-heading {
    font-size: 41px;
  }

  .blog-subtitle {
    font-size: 13px;
  }

  .blog-card-image-wrapper {
    height: 205px;
  }
}
`;

export default Blog;
