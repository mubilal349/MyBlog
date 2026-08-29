import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Search,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// ==========================================================
// HELPERS
// ==========================================================

const getImageUrl = (image) => {
  if (!image) {
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    const baseUrl = API_URL.replace("/api", "");
    return `${baseUrl}${image}`;
  }

  return image;
};

const getPostId = (post) => {
  return post?._id || post?.id;
};

const getPostTitle = (post) => {
  return post?.title || "Untitled Post";
};

const getPostCategory = (post) => {
  if (post?.category) {
    return post.category;
  }

  if (Array.isArray(post?.categories) && post.categories.length > 0) {
    return post.categories[0];
  }

  return "Technology";
};

const stripHtml = (html = "") => {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getPostDescription = (post) => {
  if (post?.excerpt) {
    return post.excerpt;
  }

  if (post?.description) {
    return post.description;
  }

  if (post?.desc) {
    return post.desc;
  }

  if (post?.content) {
    return stripHtml(post.content).slice(0, 180);
  }

  return "Read this article to learn more.";
};

const getFullDescription = (post) => {
  if (post?.content) {
    return stripHtml(post.content);
  }

  if (post?.fullDesc) {
    return post.fullDesc;
  }

  if (post?.description) {
    return post.description;
  }

  return getPostDescription(post);
};

const getAuthorName = (post) => {
  if (typeof post?.author === "string") {
    return post.author;
  }

  if (post?.author?.name) {
    return post.author.name;
  }

  if (post?.createdBy?.name) {
    return post.createdBy.name;
  }

  if (post?.user?.name) {
    return post.user.name;
  }

  return "Admin";
};

const getAuthorRole = (post) => {
  if (post?.author?.role) {
    return post.author.role;
  }

  if (post?.createdBy?.role) {
    return post.createdBy.role;
  }

  if (post?.user?.role) {
    return post.user.role;
  }

  return "Author";
};

const getAuthorAvatar = (post) => {
  const avatar =
    post?.author?.avatar ||
    post?.createdBy?.avatar ||
    post?.user?.avatar ||
    post?.authorAvatar;

  if (!avatar) {
    return "https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff";
  }

  return getImageUrl(avatar);
};

// ==========================================================
// ICONS
// ==========================================================

const HeartSolid = () => <Heart size={15} fill="currentColor" />;

const HeartOutline = () => <Heart size={15} />;

const CommentIcon = () => <MessageCircle size={15} />;

// ==========================================================
// ABOUT PAGE
// ==========================================================

const About = () => {
  const navigate = useNavigate();

  // ========================================================
  // STATE
  // ========================================================

  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");

  const [expanded, setExpanded] = useState({});

  const [likes, setLikes] = useState({});

  const [commentBoxOpen, setCommentBoxOpen] = useState({});

  const [commentInputs, setCommentInputs] = useState({});

  const [comments, setComments] = useState({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ========================================================
  // FETCH POSTS
  // ========================================================

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/blogs`);

      const data = await response.json();

      console.log("BLOG API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to load posts.",
        );
      }

      // ====================================================
      // SUPPORT DIFFERENT RESPONSE STRUCTURES
      // ====================================================

      let fetchedPosts = [];

      if (Array.isArray(data)) {
        fetchedPosts = data;
      } else if (Array.isArray(data?.blogs)) {
        fetchedPosts = data.blogs;
      } else if (Array.isArray(data?.posts)) {
        fetchedPosts = data.posts;
      } else if (Array.isArray(data?.data)) {
        fetchedPosts = data.data;
      }

      // ====================================================
      // ONLY PUBLISHED POSTS
      // ====================================================

      fetchedPosts = fetchedPosts.filter((post) => {
        if (!post?.status) {
          return true;
        }

        return String(post.status).toLowerCase() === "published";
      });

      // ====================================================
      // SORT BY NEWEST
      // ====================================================

      fetchedPosts.sort((a, b) => {
        const dateA = new Date(
          a?.publishedAt || a?.createdAt || a?.updatedAt || 0,
        );

        const dateB = new Date(
          b?.publishedAt || b?.createdAt || b?.updatedAt || 0,
        );

        return dateB - dateA;
      });

      // ====================================================
      // SHOW ONLY 6 LATEST POSTS
      // ====================================================

      const latestPosts = fetchedPosts.slice(0, 6);

      setPosts(latestPosts);

      // ====================================================
      // INITIALIZE LIKES
      // ====================================================

      const initialLikes = {};

      latestPosts.forEach((post) => {
        const id = getPostId(post);

        if (!id) {
          return;
        }

        const likeCount =
          post?.likesCount ??
          post?.likeCount ??
          (Array.isArray(post?.likes) ? post.likes.length : 0);

        const liked = post?.likedByCurrentUser ?? post?.isLiked ?? false;

        initialLikes[id] = {
          liked: Boolean(liked),
          count: Number(likeCount) || 0,
        };
      });

      setLikes(initialLikes);

      // ====================================================
      // INITIALIZE COMMENTS
      // ====================================================

      const initialComments = {};

      latestPosts.forEach((post) => {
        const id = getPostId(post);

        if (!id) {
          return;
        }

        // Backend already sends comments array
        if (Array.isArray(post?.comments)) {
          initialComments[id] = post.comments
            .map((comment) => {
              if (typeof comment === "string") {
                return comment;
              }

              return comment?.content || comment?.text || "";
            })
            .filter(Boolean);
        } else {
          initialComments[id] = [];
        }
      });

      setComments(initialComments);
    } catch (err) {
      console.error("FETCH POSTS ERROR:", err);

      setError(err?.message || "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // SEARCH
  // ========================================================

  const filtered = posts.filter((post) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    const title = getPostTitle(post).toLowerCase();

    const category = getPostCategory(post).toLowerCase();

    const description = getPostDescription(post).toLowerCase();

    return (
      title.includes(searchText) ||
      category.includes(searchText) ||
      description.includes(searchText)
    );
  });

  // ========================================================
  // LIKE
  // ========================================================

  const toggleLike = async (post) => {
    const id = getPostId(post);

    if (!id) {
      return;
    }

    const currentLike = likes[id] || {
      liked: false,
      count: 0,
    };

    // Optimistic update
    setLikes((prev) => ({
      ...prev,
      [id]: {
        liked: !currentLike.liked,
        count: currentLike.liked
          ? Math.max(0, currentLike.count - 1)
          : currentLike.count + 1,
      },
    }));

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/blogs/${id}/like`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update like.");
      }

      const data = await response.json();

      console.log("LIKE RESPONSE:", data);

      if (data?.likesCount !== undefined || data?.likeCount !== undefined) {
        setLikes((prev) => ({
          ...prev,
          [id]: {
            liked: data?.liked ?? data?.isLiked ?? !currentLike.liked,

            count: data?.likesCount ?? data?.likeCount ?? currentLike.count,
          },
        }));
      }
    } catch (err) {
      console.error("LIKE ERROR:", err);

      // Rollback
      setLikes((prev) => ({
        ...prev,
        [id]: currentLike,
      }));
    }
  };

  // ========================================================
  // EXPAND
  // ========================================================

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ========================================================
  // COMMENT BOX
  // ========================================================

  const toggleCommentBox = (id) => {
    setCommentBoxOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ========================================================
  // ADD COMMENT
  // ========================================================

  const addComment = async (post) => {
    const id = getPostId(post);

    if (!id) {
      return;
    }

    const value = (commentInputs[id] || "").trim();

    if (!value) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/comments`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },

        body: JSON.stringify({
          blogId: id,
          content: value,
          text: value,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data?.message || data?.error || "Failed to add comment.",
        );
      }

      const data = await response.json();

      console.log("COMMENT RESPONSE:", data);

      // Add comment to UI
      setComments((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), value],
      }));

      setCommentInputs((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (err) {
      console.error("COMMENT ERROR:", err);

      // Local fallback
      setComments((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), value],
      }));

      setCommentInputs((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  // ========================================================
  // OPEN POST
  // ========================================================

  const openPost = (post) => {
    const id = getPostId(post);

    if (!id) {
      return;
    }

    if (post?.slug) {
      navigate(`/blog/${post.slug}`);
    } else {
      navigate(`/blog/${id}`);
    }
  };

  // ========================================================
  // VIEW ALL POSTS
  // ========================================================

  const viewAllPosts = () => {
    navigate("/blog");
  };

  // ========================================================
  // LOADING
  // ========================================================

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6"
        style={{
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={30} className="animate-spin text-violet-400" />

          <p className="text-sm">Loading latest posts...</p>
        </div>
      </div>
    );
  }

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] px-6 py-16"
      style={{
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ====================================================
          AMBIENT GLOWS
      ===================================================== */}

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

      {/* ====================================================
          HEADER
      ===================================================== */}

      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />

          <span className="text-[11px] font-medium uppercase tracking-widest text-violet-400">
            Explore · Latest Posts
          </span>
        </div>

        <h1
          className="mb-3 leading-[1.1] text-gray-100"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem,5vw,3rem)",
          }}
        >
          Our
          <em className="italic text-violet-300 px-3">Latest</em>
          Blogs
        </h1>

        <p className="mx-auto max-w-md text-[15px] font-light text-gray-500">
          Ideas, tutorials, and deep dives on technology, development, AI,
          cybersecurity, and the web.
        </p>
      </div>

      {/* ====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mx-auto mb-8 flex max-w-2xl items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={fetchPosts}
            className="ml-auto text-xs font-medium underline hover:text-red-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* ====================================================
          SEARCH
      ===================================================== */}

      <div className="relative mx-auto mb-12 max-w-lg">
        <input
          type="text"
          placeholder="Search by title or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-violet-400/50"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Search size={16} />
        </span>
      </div>

      {/* ====================================================
          NO POSTS
      ===================================================== */}

      {filtered.length === 0 && (
        <div className="mx-auto max-w-xl py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
            <Search size={25} className="text-gray-500" />
          </div>

          <h3 className="text-lg font-medium text-gray-300">No posts found</h3>

          <p className="mt-2 text-sm text-gray-600">
            {posts.length === 0
              ? "There are currently no published posts."
              : "No posts match your search."}
          </p>
        </div>
      )}

      {/* ====================================================
          POSTS GRID
      ===================================================== */}

      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => {
          const id = getPostId(post);

          const lk = likes[id] || {
            liked: false,
            count: 0,
          };

          const isExpanded = expanded[id];

          const commentOpen = commentBoxOpen[id];

          const postComments = comments[id] || [];

          const title = getPostTitle(post);

          const category = getPostCategory(post);

          const description = getPostDescription(post);

          const fullDescription = getFullDescription(post);

          const author = getAuthorName(post);

          const role = getAuthorRole(post);

          const avatar = getAuthorAvatar(post);

          return (
            <div
              key={id}
              className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111118] transition-all duration-200 hover:-translate-y-1 hover:border-violet-400/25"
            >
              {/* ==================================================
                  IMAGE
              =================================================== */}

              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(
                    post?.image ||
                      post?.featuredImage ||
                      post?.thumbnail ||
                      post?.img,
                  )}
                  alt={title}
                  onClick={() => openPost(post)}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80";
                  }}
                  className="h-48 w-full cursor-pointer object-cover brightness-75 saturate-110 transition-all duration-300 group-hover:brightness-90"
                />

                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111118] to-transparent" />

                <span className="absolute left-3 top-3 rounded-full bg-violet-700/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-violet-200 backdrop-blur-sm">
                  {category}
                </span>

                {post?.status && (
                  <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] text-gray-200 backdrop-blur-sm">
                    {post.status}
                  </span>
                )}
              </div>

              {/* ==================================================
                  BODY
              =================================================== */}

              <div className="p-5">
                <h2
                  onClick={() => openPost(post)}
                  className="mb-2 cursor-pointer leading-snug text-gray-100 transition-colors hover:text-violet-300"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.15rem",
                  }}
                >
                  {title}
                </h2>

                <p className="mb-2 text-[13px] font-light leading-relaxed text-gray-400">
                  {isExpanded ? fullDescription : description}
                </p>

                {/* SEE MORE */}

                {fullDescription.length > description.length && (
                  <button
                    onClick={() => toggleExpand(id)}
                    className="mb-4 text-[12px] font-medium text-violet-400 transition-colors hover:text-violet-300"
                  >
                    {isExpanded ? "↑ See less" : "See more →"}
                  </button>
                )}

                {/* ==================================================
                    ACTIONS
                =================================================== */}

                <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-4">
                  {/* LIKE */}

                  <button
                    type="button"
                    onClick={() => toggleLike(post)}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] transition-all ${
                      lk.liked
                        ? "text-red-400 hover:bg-red-400/10"
                        : "text-gray-500 hover:bg-white/5 hover:text-gray-200"
                    }`}
                  >
                    {lk.liked ? <HeartSolid /> : <HeartOutline />}

                    <span>{lk.count}</span>
                  </button>

                  {/* COMMENT */}

                  <button
                    type="button"
                    onClick={() => toggleCommentBox(id)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-gray-500 transition-all hover:bg-white/5 hover:text-gray-200"
                  >
                    <CommentIcon />

                    {/* 
                      SHOW COMMENT COUNT
                      Example:
                      1
                      2
                      3
                    */}

                    <span>{postComments.length}</span>
                  </button>
                </div>

                {/* ==================================================
                    AUTHOR
                =================================================== */}

                <div className="flex items-center gap-2.5">
                  <img
                    src={avatar}
                    alt={author}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff";
                    }}
                    className="h-8 w-8 rounded-full border border-violet-400/30 object-cover"
                  />

                  <div>
                    <p className="text-[13px] font-medium text-gray-300">
                      {author}
                    </p>

                    <p className="text-[11px] text-gray-600">{role}</p>
                  </div>
                </div>

                {/* ==================================================
                    COMMENT BOX
                =================================================== */}

                {commentOpen && (
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addComment(post);
                          }
                        }}
                        placeholder="Write a comment…"
                        className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-violet-400/40"
                      />

                      <button
                        type="button"
                        onClick={() => addComment(post)}
                        className="rounded-lg bg-violet-700 px-3 py-2 text-[13px] font-medium text-white transition hover:bg-violet-800"
                      >
                        Post
                      </button>
                    </div>

                    {/* EXISTING COMMENTS */}

                    {postComments.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {postComments.map((comment, index) => (
                          <div
                            key={`${id}-comment-${index}`}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[13px] text-gray-400"
                          >
                            {comment}
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

      {/* ====================================================
          VIEW ALL POSTS
      ===================================================== */}

      {posts.length > 0 && (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={viewAllPosts}
            className="group inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-600/10 px-6 py-3 text-sm font-medium text-violet-300 transition-all duration-200 hover:border-violet-400/40 hover:bg-violet-600/20 hover:text-violet-200"
          >
            View All Posts
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default About;
