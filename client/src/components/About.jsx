import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const posts = [
  {
    id: 1,
    title: "What is Artificial Intelligence?",
    category: "Technology",
    desc: "AI refers to the simulation of human intelligence processes by machines, enabling computers to learn, reason, and make decisions.",
    fullDesc:
      "Artificial Intelligence (AI) refers to the simulation of human intelligence processes by machines. It enables computers to learn, reason, and make decisions. From chatbots to self-driving cars, AI is shaping the future of technology in healthcare, education, and industries worldwide.",
    img: "https://media.geeksforgeeks.org/wp-content/uploads/20240319155102/what-is-ai-artificial-intelligence.webp",
    author: "John Doe",
    role: "Tech Blogger",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMYZJcpVOUOUUTMhGT65To5EDPYUBbTmbQlQ&s",
  },
  {
    id: 2,
    title: "The Future of Web Development",
    category: "Frontend",
    desc: "Web development is evolving with React, Next.js, and modern frameworks shaping how we build scalable applications.",
    fullDesc:
      "Web development is rapidly changing with modern tools like React, Next.js, and serverless technologies. Developers are focusing on performance, accessibility, and scalability. The future includes AI-assisted coding, edge computing, and Web3 innovations.",
    img: "https://miro.medium.com/1*V-Jp13LvtVc2IiY2fp4qYw.jpeg",
    author: "Jane Smith",
    role: "Fullstack Dev",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 3,
    title: "Why Learn React in 2025?",
    category: "Lifestyle",
    desc: "React continues to dominate frontend development due to its flexibility, ecosystem, and strong community support.",
    fullDesc:
      "React remains the most popular JavaScript library in 2025 for building UIs. Its strong ecosystem, reusable components, and integration with Next.js make it powerful for both beginners and professionals.",
    img: "https://reactjs.org/logo-og.png",
    author: "Ali Khan",
    role: "Frontend Engineer",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
];

const HeartSolid = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const HeartOutline = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CommentIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const SearchIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const About = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [likes, setLikes] = useState({
    1: { liked: false, count: 12 },
    2: { liked: false, count: 5 },
    3: { liked: true, count: 20 },
  });
  const [commentBoxOpen, setCommentBoxOpen] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({ 3: ["Great article!"] });

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleLike = (id) =>
    setLikes((prev) => ({
      ...prev,
      [id]: {
        liked: !prev[id].liked,
        count: prev[id].liked ? prev[id].count - 1 : prev[id].count + 1,
      },
    }));

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleCommentBox = (id) =>
    setCommentBoxOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const addComment = (id) => {
    const val = (commentInputs[id] || "").trim();
    if (!val) return;
    setComments((prev) => ({ ...prev, [id]: [...(prev[id] || []), val] }));
    setCommentInputs((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] px-6 py-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none fixed -right-16 -top-24 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-24 left-[10%] h-64 w-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
          <span className="text-[11px] font-medium uppercase tracking-widest text-violet-400">
            Explore · All Posts
          </span>
        </div>
        <h1
          className="mb-3 leading-[1.1] text-gray-100"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem,5vw,3rem)",
          }}
        >
          Our<em className="italic text-violet-300 px-3">Latest</em> Blogs
        </h1>
        <p className="mx-auto max-w-md text-[15px] font-light text-gray-500">
          Ideas, tutorials, and deep dives on technology, development, and the
          web.
        </p>
      </div>

      {/* Search */}
      <div className="relative mx-auto mb-12 max-w-lg">
        <input
          type="text"
          placeholder="Search by title or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10
                     text-sm text-gray-200 placeholder-gray-600 outline-none
                     focus:border-violet-400/50 transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <SearchIcon />
        </span>
      </div>

      {/* Grid */}
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-gray-600">
            No posts found matching your search.
          </p>
        )}

        {filtered.map((post) => {
          const lk = likes[post.id];
          const isExpanded = expanded[post.id];
          const commentOpen = commentBoxOpen[post.id];
          const postComments = comments[post.id] || [];

          return (
            <div
              key={post.id}
              className="group rounded-2xl border border-white/[0.07] bg-[#111118]
                         overflow-hidden transition-all duration-200
                         hover:-translate-y-1 hover:border-violet-400/25"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="h-48 w-full cursor-pointer object-cover transition-all duration-300
                             brightness-75 saturate-110 group-hover:brightness-90"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111118] to-transparent" />
                <span
                  className="absolute left-3 top-3 rounded-full bg-violet-700/80 px-3 py-1
                                 text-[11px] font-medium uppercase tracking-wider text-violet-200
                                 backdrop-blur-sm"
                >
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <h2
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="mb-2 cursor-pointer leading-snug text-gray-100 transition-colors
                             hover:text-violet-300"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.15rem",
                  }}
                >
                  {post.title}
                </h2>

                <p className="mb-2 text-[13px] font-light leading-relaxed text-gray-400">
                  {isExpanded ? post.fullDesc : post.desc}
                </p>

                <button
                  onClick={() => toggleExpand(post.id)}
                  className="mb-4 text-[12px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
                >
                  {isExpanded ? "↑ See less" : "See more →"}
                </button>

                {/* Actions */}
                <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5
                               text-[13px] transition-all
                               ${
                                 lk.liked
                                   ? "text-red-400 hover:bg-red-400/10"
                                   : "text-gray-500 hover:bg-white/5 hover:text-gray-200"
                               }`}
                  >
                    {lk.liked ? <HeartSolid /> : <HeartOutline />}
                    {lk.count}
                  </button>
                  <button
                    onClick={() => toggleCommentBox(post.id)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5
                               text-[13px] text-gray-500 transition-all
                               hover:bg-white/5 hover:text-gray-200"
                  >
                    <CommentIcon />
                    {postComments.length > 0 ? postComments.length : "Comment"}
                  </button>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="h-8 w-8 rounded-full object-cover border border-violet-400/30"
                  />
                  <div>
                    <p className="text-[13px] font-medium text-gray-300">
                      {post.author}
                    </p>
                    <p className="text-[11px] text-gray-600">{post.role}</p>
                  </div>
                </div>

                {/* Comment box */}
                {commentOpen && (
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && addComment(post.id)
                        }
                        placeholder="Write a comment…"
                        autoFocus
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2
                                   text-[13px] text-gray-200 placeholder-gray-600 outline-none
                                   focus:border-violet-400/40 transition-colors"
                      />
                      <button
                        onClick={() => addComment(post.id)}
                        className="rounded-lg bg-violet-700 px-3 py-2 text-[13px] font-medium
                                   text-white transition hover:bg-violet-800"
                      >
                        Post
                      </button>
                    </div>

                    {postComments.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {postComments.map((c, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.03]
                                       px-3 py-2 text-[13px] text-gray-400"
                          >
                            {c}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default About;
