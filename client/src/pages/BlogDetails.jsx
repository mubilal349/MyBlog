import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Activity, Clock3 } from "lucide-react";

// ---------------------------------------------------------------------------
// Design: "Signal" — a technical journal for fast-moving ideas.
// Dark ink shell, warm paper type, a teal reading-signal rail that traces
// scroll progress like a live trace on an oscilloscope. Ties the visual
// language directly to the subject matter: technology that moves quickly.
// ---------------------------------------------------------------------------

const posts = [
  {
    id: 1,
    title: "What is Artificial Intelligence?",
    category: "Technology",
    fullDesc:
      "Artificial Intelligence (AI) refers to the simulation of human intelligence processes by machines. It enables computers to learn, reason, and make decisions. From chatbots to self-driving cars, AI is shaping the future of technology in healthcare, education, and industries worldwide.",
    img: "https://media.geeksforgeeks.org/wp-content/uploads/20240319155102/what-is-ai-artificial-intelligence.webp",
    extra:
      "Rapid changes in technology have made AI a key part of daily life — from voice assistants to recommendation systems. The evolution of machine learning and neural networks continues to push the limits of what's possible.",
  },
  {
    id: 2,
    title: "The Future of Web Development",
    category: "Technology",
    fullDesc:
      "Web development is rapidly changing with modern tools like React, Next.js, and serverless technologies. Developers are focusing on performance, accessibility, and scalability. The future includes AI-assisted coding, edge computing, and Web3 innovations that will shape the way we build the internet.",
    img: "https://miro.medium.com/1*V-Jp13LvtVc2IiY2fp4qYw.jpeg",
    extra:
      "Rapid change in technology means web developers must constantly learn. Frameworks evolve, browsers update, and new tools appear — staying updated is key to success.",
  },
  {
    id: 3,
    title: "Why Learn React in 2025?",
    category: "Lifestyle",
    fullDesc:
      "React remains the most popular JavaScript library in 2025 for building UIs. Its strong ecosystem, reusable components, and integration with Next.js make it powerful for both beginners and professionals. Learning React opens opportunities in frontend, fullstack, and cross-platform app development.",
    img: "https://reactjs.org/logo-og.png",
    extra:
      "React's rapid growth shows how technology evolves — focusing on speed, flexibility, and scalability. Developers who adapt early stay ahead of the curve.",
  },
];

function readTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function issueNo(id) {
  return String(id).padStart(3, "0");
}

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const articleRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const blog = posts.find((p) => p.id === parseInt(id));
  const related = posts.filter((p) => p.id !== parseInt(id));

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const passed = -rect.top;
      const pct =
        total > 0 ? Math.min(100, Math.max(0, (passed / total) * 100)) : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [blog]);

  if (!blog) {
    return (
      <div className="sg-shell sg-notfound">
        <style>{styles}</style>
        <p>Signal lost. That article doesn't exist.</p>
        <button className="sg-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  const minutes = readTime(blog.fullDesc + " " + blog.extra);

  return (
    <div className="sg-shell">
      <style>{styles}</style>

      {/* mobile top progress line */}
      <div className="sg-mobile-progress">
        <div
          className="sg-mobile-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="sg-frame">
        {/* signature signal rail */}
        <div className="sg-rail" aria-hidden="true">
          <span className="sg-rail-label">
            <Activity size={12} strokeWidth={2.5} /> SIGNAL
          </span>
          <div className="sg-rail-track">
            <div className="sg-rail-fill" style={{ height: `${progress}%` }} />
            <div className="sg-rail-dot" style={{ top: `${progress}%` }} />
          </div>
          <span className="sg-rail-pct">{Math.round(progress)}%</span>
        </div>

        <div className="sg-main" ref={articleRef}>
          <button className="sg-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>

          <div className="sg-meta-row">
            <span className="sg-eyebrow">{blog.category}</span>
            <span className="sg-dot-sep">·</span>
            <span className="sg-meta-mono">ISSUE No.{issueNo(blog.id)}</span>
            <span className="sg-dot-sep">·</span>
            <span className="sg-meta-mono">
              <Clock3
                size={12}
                style={{ display: "inline", marginRight: 4, verticalAlign: -2 }}
              />
              {minutes} min read
            </span>
          </div>

          <h1 className="sg-title">{blog.title}</h1>

          <figure className="sg-hero">
            <img src={blog.img} alt={blog.title} className="sg-hero-img" />
            <figcaption className="sg-hero-caption">
              FIG.{issueNo(blog.id)} — {blog.title}
            </figcaption>
          </figure>

          <p className="sg-body">{blog.fullDesc}</p>

          <aside className="sg-annotation">
            <div className="sg-annotation-tag">TRENDLINE // RAPID CHANGE</div>
            <p className="sg-annotation-text">{blog.extra}</p>
          </aside>

          <section className="sg-further">
            <h3 className="sg-further-title">Further Reading</h3>
            <div className="sg-index">
              {related.map((r) => (
                <button
                  key={r.id}
                  className="sg-index-row"
                  onClick={() => navigate(`/blog/${r.id}`)}
                >
                  <span className="sg-index-no">{issueNo(r.id)}</span>
                  <img src={r.img} alt={r.title} className="sg-index-thumb" />
                  <span className="sg-index-text">
                    <span className="sg-index-title">{r.title}</span>
                    <span className="sg-index-cat">{r.category}</span>
                  </span>
                  <ArrowUpRight size={18} className="sg-index-arrow" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

.sg-shell {
  --ink: #14171B;
  --ink-soft: #1B1F26;
  --ink-line: rgba(237, 234, 225, 0.10);
  --paper: #EDEAE1;
  --paper-dim: #9AA0AC;
  --signal: #5EEAD4;
  --signal-dim: rgba(94, 234, 212, 0.18);
  --amber: #F2A65A;

  background: var(--ink);
  color: var(--paper);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.sg-notfound {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  text-align: center;
  color: var(--paper-dim);
}

.sg-mobile-progress {
  display: none;
  position: sticky;
  top: 0;
  height: 3px;
  width: 100%;
  background: var(--ink-line);
  z-index: 20;
}
.sg-mobile-progress-fill {
  height: 100%;
  background: var(--signal);
  transition: width 80ms linear;
}

.sg-frame {
  max-width: 980px;
  margin: 0 auto;
  padding: 56px 24px 100px;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 32px;
}

/* signal rail */
.sg-rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 56px;
  height: fit-content;
  padding-top: 6px;
}
.sg-rail-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.16em;
  color: var(--signal);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
}
.sg-rail-track {
  position: relative;
  width: 2px;
  flex: 1;
  min-height: 260px;
  background: var(--ink-line);
  border-radius: 2px;
}
.sg-rail-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(180deg, var(--signal), transparent);
  border-radius: 2px;
}
.sg-rail-dot {
  position: absolute;
  left: 50%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--signal);
  box-shadow: 0 0 0 5px var(--signal-dim);
  transform: translate(-50%, -50%);
  transition: top 80ms linear;
}
.sg-rail-pct {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: var(--paper-dim);
  margin-top: 14px;
}

.sg-main {
  min-width: 0;
}

.sg-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid var(--ink-line);
  color: var(--paper);
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease;
  margin-top: 28px;
  margin-bottom: 32px;
}
.sg-back:hover {
  border-color: var(--signal);
  color: var(--signal);
}

.sg-meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}
.sg-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--amber);
  border: 1px solid rgba(242, 166, 90, 0.35);
  padding: 4px 10px;
  border-radius: 999px;
}
.sg-meta-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--paper-dim);
  letter-spacing: 0.04em;
}
.sg-dot-sep {
  color: var(--ink-line);
}

.sg-title {
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.01em;
  margin: 0 0 32px;
  max-width: 18ch;
}

.sg-hero {
  margin: 0 0 8px;
}
.sg-hero-img {
  width: 100%;
  height: 360px;
  object-fit: cover;
  border-radius: 6px;
  display: block;
  filter: saturate(0.92) contrast(1.02);
}
.sg-hero-caption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--paper-dim);
  padding: 10px 2px 36px;
  border-bottom: 1px solid var(--ink-line);
  margin-bottom: 36px;
  letter-spacing: 0.02em;
}

.sg-body {
  font-size: 18px;
  line-height: 1.7;
  color: rgba(237, 234, 225, 0.92);
  max-width: 62ch;
  margin: 0 0 40px;
}

.sg-annotation {
  background: var(--ink-soft);
  border-left: 2px solid var(--signal);
  border-radius: 0 8px 8px 0;
  padding: 22px 24px;
  margin-bottom: 56px;
}
.sg-annotation-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--signal);
  margin-bottom: 10px;
}
.sg-annotation-text {
  font-size: 15px;
  line-height: 1.65;
  color: var(--paper-dim);
  margin: 0;
  max-width: 60ch;
}

.sg-further-title {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-style: italic;
  font-size: 22px;
  color: var(--paper);
  margin: 0 0 20px;
}

.sg-index {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ink-line);
}
.sg-index-row {
  display: grid;
  grid-template-columns: 32px 56px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 16px;
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--ink-line);
  padding: 16px 4px;
  cursor: pointer;
  text-align: left;
  color: var(--paper);
  transition: background 150ms ease;
}
.sg-index-row:hover {
  background: var(--ink-soft);
}
.sg-index-row:hover .sg-index-arrow {
  color: var(--signal);
  transform: translate(2px, -2px);
}
.sg-index-no {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--paper-dim);
}
.sg-index-thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 4px;
}
.sg-index-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.sg-index-title {
  font-family: 'Fraunces', serif;
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sg-index-cat {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--paper-dim);
}
.sg-index-arrow {
  color: var(--paper-dim);
  transition: transform 150ms ease, color 150ms ease;
}

@media (max-width: 720px) {
  .sg-mobile-progress { display: block; }
  .sg-frame {
    grid-template-columns: 1fr;
    padding: 24px 18px 80px;
  }
  .sg-rail { display: none; }
  .sg-hero-img { height: 220px; }
  .sg-index-row {
    grid-template-columns: 24px 48px minmax(0, 1fr) 18px;
  }
}
`;

export default BlogDetails;
