import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  const [underline, setUnderline] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);
  const [likes, setLikes] = useState({
    1: { liked: false, count: 12 },
    2: { liked: false, count: 5 },
    3: { liked: true, count: 20 },
  });
  const [animate, setAnimate] = useState(false);
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState({}); // comments state
  const [activeCommentBox, setActiveCommentBox] = useState(null); // track which post’s box is open
  const [commentInput, setCommentInput] = useState(""); // track input text

  const posts = [
    {
      id: 1,
      title: "What is Artificial Intelligence?",
      category: "technology",
      desc: "Artificial Intelligence (AI) refers to the simulation of human intelligence processes by machines...",
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
      category: "technology",
      desc: "Web development is evolving with React, Next.js, and modern frameworks shaping how we build apps...",
      fullDesc:
        "Web development is rapidly changing with modern tools like React, Next.js, and serverless technologies. Developers are focusing on performance, accessibility, and scalability. The future includes AI-assisted coding, edge computing, and Web3 innovations that will shape the way we build the internet.",
      img: "https://miro.medium.com/1*V-Jp13LvtVc2IiY2fp4qYw.jpeg",
      author: "Jane Smith",
      role: "Fullstack Dev",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 3,
      title: "Why Learn React in 2025?",
      category: "Lifestyle",
      desc: "React continues to dominate frontend development due to its flexibility, ecosystem, and community support...",
      fullDesc:
        "React remains the most popular JavaScript library in 2025 for building UIs. Its strong ecosystem, reusable components, and integration with Next.js make it powerful for both beginners and professionals. Learning React opens opportunities in frontend, fullstack, and cross-platform app development.",
      img: "https://reactjs.org/logo-og.png",
      author: "Ali Khan",
      role: "Frontend Engineer",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  const toggleLike = (id) => {
    setLikes((prev) => {
      const postLike = prev[id];
      return {
        ...prev,
        [id]: {
          liked: !postLike.liked,
          count: postLike.liked ? postLike.count - 1 : postLike.count + 1,
        },
      };
    });
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase())
  );

  // Add comment to post
  const handleAddComment = (postId) => {
    if (!commentInput.trim()) return;

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), commentInput],
    }));

    setCommentInput(""); // clear input
    setActiveCommentBox(null); // close after submit
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setUnderline(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-4 py-8">
      {/* Title */}
      <h1
        style={{ fontSize: "40px", fontWeight: "bolder", color: "#313130ff" }}
        className={`${underline ? "underline" : ""} mb-6`}
      >
        About Blog
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Blogs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-11/12 md:w-1/2 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6"
      />

      {/* Posts Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            {/* Post Image */}
            <img
              src={post.img}
              alt={post.title}
              className="w-full h-[200px] object-cover cursor-pointer hover:opacity-90 transition"
              onClick={() => navigate(`/blog/${post.id}`)}
            />

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {post.title}
              </h2>

              {/* Like + Comment */}
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon
                  onClick={() => toggleLike(post.id)}
                  icon={likes[post.id].liked ? solidHeart : regularHeart}
                  className={`text-2xl transition-all duration-300 cursor-pointer ${
                    likes[post.id].liked ? "text-red-500" : "text-gray-500"
                  } ${animate ? "scale-125" : "scale-100"}`}
                />
                <span className="text-sm text-gray-600">
                  {likes[post.id].count}
                </span>

                <FontAwesomeIcon
                  icon={faComment}
                  className="text-gray-500 hover:text-blue-500 text-xl cursor-pointer"
                  onClick={() =>
                    setActiveCommentBox(
                      activeCommentBox === post.id ? null : post.id
                    )
                  }
                />
              </div>

              {/* Post Desc */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {expandedPost === post.id ? post.fullDesc : post.desc}
              </p>

              {/* See more / less */}
              <button
                onClick={() =>
                  setExpandedPost(expandedPost === post.id ? null : post.id)
                }
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold mb-4"
              >
                {expandedPost === post.id ? "See less" : "See more..."}
              </button>

              {/* Author */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.avatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div>
                  <h3 className="text-gray-800 font-semibold">{post.author}</h3>
                  <p className="text-xs text-gray-500">{post.role}</p>
                </div>
              </div>

              {/* Comment Box */}
              {activeCommentBox === post.id && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Post
                  </button>
                </div>
              )}

              {/* Show Comments */}
              {comments[post.id] && comments[post.id].length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">Comments:</h4>
                  <ul className="space-y-2">
                    {comments[post.id].map((c, i) => (
                      <li
                        key={i}
                        className="bg-gray-100 p-2 rounded-md text-sm text-gray-700"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <p className="text-gray-500 text-center col-span-full">
            No posts found
          </p>
        )}
      </div>
    </div>
  );
};

export default About;
