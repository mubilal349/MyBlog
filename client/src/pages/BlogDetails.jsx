import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Activity,
  Clock3,
  FileText,
} from "lucide-react";

import { getBlogBySlug, getPublishedBlogs } from "../services/blogServices.js";

function readTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const articleRef = useRef(null);

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  // ==========================================
  // LOAD BLOG FROM DATABASE
  // ==========================================

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError("");
        setBlog(null);

        console.log("Loading blog with slug:", slug);

        // Get single published blog
        const blogData = await getBlogBySlug(slug);

        console.log("BLOG FROM API:", blogData);

        if (!blogData) {
          throw new Error("Blog not found");
        }

        setBlog(blogData);

        // Get other published blogs for Further Reading
        try {
          const allBlogs = await getPublishedBlogs();

          const filtered = allBlogs.filter((item) => item._id !== blogData._id);

          setRelatedBlogs(filtered.slice(0, 4));
        } catch (relatedError) {
          console.error("Related blogs error:", relatedError);
          setRelatedBlogs([]);
        }
      } catch (err) {
        console.error("Blog details error:", err);

        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Unable to load this blog post.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    }
  }, [slug]);

  // ==========================================
  // SCROLL PROGRESS
  // ==========================================

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;

      if (!el) return;

      const rect = el.getBoundingClientRect();

      const total = rect.height - window.innerHeight * 0.6;
      const passed = -rect.top;

      const percentage =
        total > 0 ? Math.min(100, Math.max(0, (passed / total) * 100)) : 0;

      setProgress(percentage);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [blog]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="sg-shell">
        <style>{styles}</style>

        <div className="sg-loading">
          <div className="sg-spinner" />
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !blog) {
    return (
      <div className="sg-shell">
        <style>{styles}</style>

        <div className="sg-notfound">
          <Activity size={40} />

          <h2>{error || "Article not found"}</h2>

          <p>This article could not be found or is no longer published.</p>

          <button className="sg-back" onClick={() => navigate("/blog")}>
            <ArrowLeft size={16} />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const content = blog.content || "";
  const minutes = readTime(content);

  return (
    <div className="sg-shell">
      <style>{styles}</style>

      {/* MOBILE PROGRESS */}

      <div className="sg-mobile-progress">
        <div
          className="sg-mobile-progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <div className="sg-frame">
        {/* ==========================================
            SIGNAL RAIL
        ========================================== */}

        <div className="sg-rail">
          <span className="sg-rail-label">
            <Activity size={12} strokeWidth={2.5} />
            SIGNAL
          </span>

          <div className="sg-rail-track">
            <div
              className="sg-rail-fill"
              style={{
                height: `${progress}%`,
              }}
            />

            <div
              className="sg-rail-dot"
              style={{
                top: `${progress}%`,
              }}
            />
          </div>

          <span className="sg-rail-pct">{Math.round(progress)}%</span>
        </div>

        {/* ==========================================
            ARTICLE
        ========================================== */}

        <main className="sg-main" ref={articleRef}>
          {/* BACK */}

          <button className="sg-back" onClick={() => navigate("/blog")}>
            <ArrowLeft size={16} />
            Back to Blogs
          </button>

          {/* META */}

          <div className="sg-meta-row">
            <span className="sg-eyebrow">{blog.category || "Technology"}</span>

            <span className="sg-dot-sep">·</span>

            <span className="sg-meta-mono">ARTICLE</span>

            <span className="sg-dot-sep">·</span>

            <span className="sg-meta-mono">
              <Clock3
                size={12}
                style={{
                  display: "inline",
                  marginRight: 4,
                  verticalAlign: -2,
                }}
              />
              {minutes} min read
            </span>
          </div>

          {/* TITLE */}

          <h1 className="sg-title">{blog.title}</h1>

          {/* AUTHOR */}

          <div className="sg-author">
            <span>
              By{" "}
              <strong>
                {blog.author?.username || blog.author?.name || "Admin"}
              </strong>
            </span>

            {blog.publishedAt && (
              <span>
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
          </div>

          {/* HERO */}

          <figure className="sg-hero">
            {blog.image ? (
              <img src={blog.image} alt={blog.title} className="sg-hero-img" />
            ) : (
              <div className="sg-no-image">
                <FileText size={42} />
                <span>No Image</span>
              </div>
            )}

            <figcaption className="sg-hero-caption">
              {blog.category?.toUpperCase() || "ARTICLE"} — {blog.title}
            </figcaption>
          </figure>

          {/* EXCERPT */}

          {blog.excerpt && <p className="sg-intro">{blog.excerpt}</p>}

          {/* CONTENT */}

          <article className="sg-content">
            {content.split("\n").map((paragraph, index) => {
              if (!paragraph.trim()) {
                return <div key={index} className="sg-content-space" />;
              }

              // H1
              if (paragraph.startsWith("# ")) {
                return <h2 key={index}>{paragraph.replace("# ", "")}</h2>;
              }

              // H2
              if (paragraph.startsWith("## ")) {
                return <h3 key={index}>{paragraph.replace("## ", "")}</h3>;
              }

              // H3
              if (paragraph.startsWith("### ")) {
                return <h4 key={index}>{paragraph.replace("### ", "")}</h4>;
              }

              // Bullet
              if (paragraph.startsWith("* ")) {
                return <li key={index}>{paragraph.replace("* ", "")}</li>;
              }

              // Normal paragraph
              return <p key={index}>{paragraph}</p>;
            })}
          </article>

          {/* INFORMATION */}

          <aside className="sg-annotation">
            <div className="sg-annotation-tag">
              ARTICLE // {blog.category?.toUpperCase() || "TECHNOLOGY"}
            </div>

            <p className="sg-annotation-text">
              Published by{" "}
              <strong>
                {blog.author?.username || blog.author?.name || "Admin"}
              </strong>{" "}
              on{" "}
              {blog.publishedAt
                ? new Date(blog.publishedAt).toLocaleDateString()
                : "recently"}
              .
            </p>
          </aside>

          {/* RELATED BLOGS */}

          {relatedBlogs.length > 0 && (
            <section className="sg-further">
              <h3 className="sg-further-title">Further Reading</h3>

              <div className="sg-index">
                {relatedBlogs.map((related) => (
                  <button
                    key={related._id}
                    className="sg-index-row"
                    onClick={() => navigate(`/blog/${related.slug}`)}
                  >
                    <span className="sg-index-no">→</span>

                    {related.image ? (
                      <img
                        src={related.image}
                        alt={related.title}
                        className="sg-index-thumb"
                      />
                    ) : (
                      <div className="sg-index-thumb sg-index-no-image">
                        <Activity size={16} />
                      </div>
                    )}

                    <span className="sg-index-text">
                      <span className="sg-index-title">{related.title}</span>

                      <span className="sg-index-cat">{related.category}</span>
                    </span>

                    <ArrowUpRight size={18} className="sg-index-arrow" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,0..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

.sg-shell {
  --ink: #14171B;
  --ink-soft: #1B1F26;
  --ink-line: rgba(237,234,225,.10);
  --paper: #EDEAE1;
  --paper-dim: #9AA0AC;
  --signal: #5EEAD4;
  --signal-dim: rgba(94,234,212,.18);
  --amber: #F2A65A;

  min-height:100vh;
  background:var(--ink);
  color:var(--paper);
  font-family:Inter,sans-serif;
}

.sg-loading {
  min-height:100vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap:16px;
  color:var(--paper-dim);
}

.sg-spinner {
  width:40px;
  height:40px;
  border:3px solid var(--ink-line);
  border-top-color:var(--signal);
  border-radius:50%;
  animation:sg-spin .8s linear infinite;
}

@keyframes sg-spin {
  to {
    transform:rotate(360deg);
  }
}

.sg-notfound {
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  gap:14px;
  padding:30px;
}

.sg-notfound h2 {
  font-family:Fraunces,serif;
  font-size:32px;
  color:var(--paper);
}

.sg-notfound p {
  color:var(--paper-dim);
}

.sg-mobile-progress {
  display:none;
  position:sticky;
  top:0;
  height:3px;
  background:var(--ink-line);
  z-index:50;
}

.sg-mobile-progress-fill {
  height:100%;
  background:var(--signal);
}

.sg-frame {
  max-width:1050px;
  margin:auto;
  padding:56px 24px 100px;
  display:grid;
  grid-template-columns:64px minmax(0,1fr);
  gap:32px;
}

.sg-rail {
  display:flex;
  flex-direction:column;
  align-items:center;
  position:sticky;
  top:56px;
  height:420px;
}

.sg-rail-label {
  writing-mode:vertical-rl;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;
  letter-spacing:.16em;
  color:var(--signal);
  display:flex;
  align-items:center;
  gap:6px;
  margin-bottom:14px;
}

.sg-rail-track {
  position:relative;
  width:2px;
  height:300px;
  background:var(--ink-line);
}

.sg-rail-fill {
  position:absolute;
  inset:0 0 auto 0;
  background:linear-gradient(
    180deg,
    var(--signal),
    transparent
  );
}

.sg-rail-dot {
  position:absolute;
  left:50%;
  width:9px;
  height:9px;
  border-radius:50%;
  background:var(--signal);
  box-shadow:0 0 0 5px var(--signal-dim);
  transform:translate(-50%,-50%);
}

.sg-rail-pct {
  font-family:'JetBrains Mono',monospace;
  font-size:10px;
  color:var(--paper-dim);
  margin-top:14px;
}

.sg-main {
  min-width:0;
}

.sg-back {
  display:inline-flex;
  align-items:center;
  gap:8px;
  background:transparent;
  border:1px solid var(--ink-line);
  color:var(--paper);
  font-family:'JetBrains Mono',monospace;
  font-size:12px;
  padding:8px 14px;
  border-radius:999px;
  cursor:pointer;
  margin-bottom:32px;
  transition:.2s ease;
}

.sg-back:hover {
  border-color:var(--signal);
  color:var(--signal);
}

.sg-meta-row {
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:10px;
  margin-bottom:18px;
}

.sg-eyebrow {
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--amber);
  border:1px solid rgba(242,166,90,.35);
  padding:4px 10px;
  border-radius:999px;
}

.sg-meta-mono {
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
  color:var(--paper-dim);
}

.sg-dot-sep {
  color:var(--paper-dim);
}

.sg-title {
  font-family:Fraunces,serif;
  font-weight:600;
  font-size:clamp(36px,5vw,60px);
  line-height:1.06;
  letter-spacing:-.02em;
  margin:0 0 18px;
  max-width:18ch;
}

.sg-author {
  display:flex;
  gap:18px;
  flex-wrap:wrap;
  margin-bottom:30px;
  color:var(--paper-dim);
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
}

.sg-author strong {
  color:var(--paper);
}

.sg-hero {
  margin:0 0 36px;
}

.sg-hero-img,
.sg-no-image {
  width:100%;
  height:420px;
  object-fit:cover;
  border-radius:8px;
  display:block;
}

.sg-no-image {
  background:var(--ink-soft);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:12px;
  color:var(--paper-dim);
}

.sg-hero-caption {
  font-family:'JetBrains Mono',monospace;
  font-size:10px;
  color:var(--paper-dim);
  padding:10px 2px 20px;
  border-bottom:1px solid var(--ink-line);
}

.sg-intro {
  font-size:20px;
  line-height:1.65;
  max-width:65ch;
  margin:0 0 32px;
  font-weight:500;
}

.sg-content {
  max-width:68ch;
  font-size:18px;
  line-height:1.85;
  color:rgba(237,234,225,.9);
}

.sg-content p {
  margin:0 0 24px;
}

.sg-content h2 {
  font-family:Fraunces,serif;
  font-size:32px;
  color:var(--paper);
  margin:45px 0 18px;
}

.sg-content h3 {
  font-family:Fraunces,serif;
  font-size:26px;
  color:var(--paper);
  margin:38px 0 15px;
}

.sg-content h4 {
  font-size:21px;
  color:var(--paper);
  margin:30px 0 12px;
}

.sg-content li {
  margin:0 0 10px 20px;
}

.sg-content-space {
  height:8px;
}

.sg-annotation {
  background:var(--ink-soft);
  border-left:2px solid var(--signal);
  border-radius:0 8px 8px 0;
  padding:22px 24px;
  margin:46px 0 60px;
}

.sg-annotation-tag {
  font-family:'JetBrains Mono',monospace;
  font-size:10px;
  letter-spacing:.12em;
  color:var(--signal);
  margin-bottom:10px;
}

.sg-annotation-text {
  font-size:15px;
  line-height:1.65;
  color:var(--paper-dim);
  margin:0;
}

.sg-further-title {
  font-family:Fraunces,serif;
  font-style:italic;
  font-size:24px;
  margin-bottom:20px;
}

.sg-index {
  display:flex;
  flex-direction:column;
  border-top:1px solid var(--ink-line);
}

.sg-index-row {
  display:grid;
  grid-template-columns:32px 64px minmax(0,1fr) 20px;
  align-items:center;
  gap:16px;
  width:100%;
  background:transparent;
  border:0;
  border-bottom:1px solid var(--ink-line);
  padding:16px 4px;
  cursor:pointer;
  text-align:left;
  color:var(--paper);
}

.sg-index-row:hover {
  background:var(--ink-soft);
}

.sg-index-thumb {
  width:64px;
  height:56px;
  object-fit:cover;
  border-radius:5px;
}

.sg-index-no-image {
  background:var(--ink-soft);
  display:flex;
  align-items:center;
  justify-content:center;
  color:var(--paper-dim);
}

.sg-index-text {
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:4px;
}

.sg-index-title {
  font-family:Fraunces,serif;
  font-size:16px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.sg-index-cat {
  font-family:'JetBrains Mono',monospace;
  font-size:11px;
  color:var(--paper-dim);
}

.sg-index-arrow {
  color:var(--paper-dim);
  transition:.2s ease;
}

.sg-index-row:hover .sg-index-arrow {
  color:var(--signal);
  transform:translate(2px,-2px);
}

@media(max-width:720px) {

  .sg-mobile-progress {
    display:block;
  }

  .sg-frame {
    grid-template-columns:1fr;
    padding:24px 18px 70px;
  }

  .sg-rail {
    display:none;
  }

  .sg-title {
    font-size:38px;
  }

  .sg-hero-img,
  .sg-no-image {
    height:240px;
  }

  .sg-content {
    font-size:17px;
    line-height:1.75;
  }

  .sg-index-row {
    grid-template-columns:24px 50px minmax(0,1fr) 18px;
    gap:10px;
  }

  .sg-index-thumb {
    width:50px;
    height:50px;
  }
}
`;

export default BlogDetails;
