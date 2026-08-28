import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Activity,
  Clock3,
  FileText,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";

import {
  getBlogBySlug,
  getPublishedBlogs,
  toggleBlogLike,
  getApprovedComments,
  createComment,
} from "../services/blogServices.js";

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
  // LIKE STATE
  // ==========================================

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // ==========================================
  // COMMENT STATE
  // ==========================================

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

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

        setLikesCount(
          Number(blogData.likesCount ?? blogData.likes?.length ?? 0),
        );

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

  // ======================================
  // LOAD APPROVED COMMENTS
  // ==========================================

  useEffect(() => {
    const loadComments = async () => {
      if (!blog?._id) return;

      try {
        setCommentsLoading(true);
        setCommentError("");

        const data = await getApprovedComments(blog._id);

        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Comments loading error:", error);

        setCommentError(
          error.response?.data?.error || "Failed to load comments.",
        );
      } finally {
        setCommentsLoading(false);
      }
    };

    loadComments();
  }, [blog?._id]);

  // ==========================================
  // LIKE / UNLIKE BLOG
  // ==========================================

  const handleLike = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to like this blog.");
      return;
    }

    if (likeLoading || !blog?._id) return;

    try {
      setLikeLoading(true);

      const result = await toggleBlogLike(blog._id);

      setLiked(result.liked);
      setLikesCount(result.likesCount);

      setBlog((previous) => ({
        ...previous,
        likesCount: result.likesCount,
        liked: result.liked,
      }));
    } catch (error) {
      console.error("Like error:", error);

      alert(
        error.response?.data?.error ||
          error.message ||
          "Failed to update like.",
      );
    } finally {
      setLikeLoading(false);
    }
  };

  // ==========================================
  // SUBMIT COMMENT
  // ==========================================

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to comment.");
      return;
    }

    if (!commentText.trim()) {
      setCommentError("Please write a comment.");
      return;
    }

    if (!blog?._id || commentLoading) return;

    try {
      setCommentLoading(true);
      setCommentError("");

      const result = await createComment(blog._id, commentText.trim());

      console.log("Comment created:", result);

      setCommentText("");

      alert(
        result.message ||
          "Comment submitted. It will appear after admin approval.",
      );
    } catch (error) {
      console.error("Comment submit error:", error);

      setCommentError(
        error.response?.data?.error ||
          error.message ||
          "Failed to submit comment.",
      );
    } finally {
      setCommentLoading(false);
    }
  };

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

          {/* ==========================================
    LIKE + COMMENTS
========================================== */}

          <section className="mt-16 border-t border-white/10 pt-10 sm:mt-20 sm:pt-12">
            {/* ==========================================
      ENGAGEMENT TOP
  ========================================== */}

            <div className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleLike}
                disabled={likeLoading}
                className={`
      group inline-flex w-fit items-center gap-2.5
      rounded-full border px-4 py-2.5
      font-mono text-xs tracking-wide
      transition-all duration-300
      disabled:cursor-not-allowed disabled:opacity-60
      ${
        liked
          ? "border-rose-400/40 bg-rose-400/10 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.08)]"
          : "border-white/10 bg-white/[0.035] text-white/65 hover:border-rose-400/30 hover:bg-rose-400/[0.06] hover:text-rose-300"
      }
    `}
              >
                <Heart
                  size={18}
                  strokeWidth={1.8}
                  className={`
        transition-all duration-300
        ${liked ? "fill-rose-400 text-rose-400" : "group-hover:scale-110"}
      `}
                />

                <span className="font-semibold text-white/90">
                  {likesCount}
                </span>

                <span className="uppercase tracking-[0.12em] text-white/40">
                  {likesCount === 1 ? "Like" : "Likes"}
                </span>
              </button>

              <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 font-mono text-xs text-white/60">
                <MessageCircle
                  size={18}
                  strokeWidth={1.8}
                  className="text-violet-300"
                />

                <span className="font-semibold text-white/90">
                  {comments.length}
                </span>

                <span className="uppercase tracking-[0.12em] text-white/40">
                  {comments.length === 1 ? "Comment" : "Comments"}
                </span>
              </div>
            </div>

            {/* ==========================================
      COMMENTS
  ========================================== */}

            <div className="mt-10 sm:mt-12">
              {/* COMMENTS HEADER */}

              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] font-medium tracking-[0.2em] text-teal-300/80">
                    DISCUSSION
                  </span>

                  <h3 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#EDEAE1] sm:text-4xl">
                    Comments
                  </h3>
                </div>

                <span className="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] px-3 font-mono text-xs text-white/55">
                  {blog.commentsCount ?? comments.length}
                </span>
              </div>

              {/* ==========================================
        COMMENT FORM
    ========================================== */}

              <form
                onSubmit={handleSubmitComment}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] transition-all duration-300 focus-within:border-teal-300/25 focus-within:bg-white/[0.035]"
              >
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Share your thoughts..."
                  rows={5}
                  maxLength={1000}
                  className="
          block w-full resize-y
          border-0 bg-transparent
          px-5 py-5
          text-sm leading-7 text-white/85
          outline-none
          placeholder:text-white/25
          sm:px-6 sm:py-6
        "
                />

                {/* FORM FOOTER */}

                <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-white/30">
                    {commentText.length}/1000
                  </span>

                  <button
                    type="submit"
                    disabled={commentLoading || !commentText.trim()}
                    className="
            inline-flex w-full items-center
            justify-center gap-2
            rounded-full
            border border-teal-300/20
            bg-teal-300/[0.08]
            px-5 py-2.5
            font-mono text-xs font-medium
            uppercase tracking-[0.08em]
            text-teal-200
            transition-all duration-300
            hover:border-teal-300/40
            hover:bg-teal-300/[0.14]
            hover:shadow-[0_0_25px_rgba(94,234,212,0.08)]
            disabled:cursor-not-allowed
            disabled:border-white/10
            disabled:bg-white/[0.025]
            disabled:text-white/25
            disabled:shadow-none
            sm:w-auto
          "
                  >
                    {commentLoading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-teal-300" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Comment
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* ==========================================
        COMMENT ERROR
    ========================================== */}

              {commentError && (
                <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] px-4 py-3 text-sm leading-6 text-rose-300">
                  {commentError}
                </div>
              )}

              {/* ==========================================
        COMMENTS LIST
    ========================================== */}

              <div className="mt-8">
                {commentsLoading ? (
                  /* LOADING */

                  <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-12">
                    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.12em] text-white/35">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-teal-300" />
                      Loading comments...
                    </div>
                  </div>
                ) : comments.length === 0 ? (
                  /* NO COMMENTS */

                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-12 text-center sm:py-16">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">
                      <MessageCircle
                        size={25}
                        strokeWidth={1.5}
                        className="text-white/35"
                      />
                    </div>

                    <p className="font-serif text-xl text-white/75">
                      No comments yet.
                    </p>

                    <span className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                      Be the first to share your thoughts about this article.
                    </span>
                  </div>
                ) : (
                  /* COMMENTS */

                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="
                group
                flex gap-3
                rounded-2xl
                border border-white/10
                bg-white/[0.025]
                p-4
                transition-all duration-300
                hover:border-white/[0.16]
                hover:bg-white/[0.035]
                sm:gap-4
                sm:p-5
              "
                      >
                        {/* AVATAR */}

                        <div
                          className="
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-full
                  border border-teal-300/20
                  bg-teal-300/[0.06]
                  font-serif
                  text-sm font-semibold
                  text-teal-200
                  sm:h-11 sm:w-11
                "
                        >
                          {(comment.user?.username || comment.user?.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        {/* COMMENT BODY */}

                        <div className="min-w-0 flex-1">
                          {/* HEADER */}

                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                            <strong className="truncate text-sm font-semibold text-white/85">
                              {comment.user?.username ||
                                comment.user?.name ||
                                "User"}
                            </strong>

                            <span className="shrink-0 font-mono text-[10px] text-white/30">
                              {comment.createdAt
                                ? new Date(
                                    comment.createdAt,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : ""}
                            </span>
                          </div>

                          {/* TEXT */}

                          <p className="mt-2.5 whitespace-pre-wrap break-words text-sm leading-7 text-white/55 sm:text-[15px]">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

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
