import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Same post data (you can later fetch from backend)
  const posts = [
    {
      id: 1,
      title: "What is Artificial Intelligence?",
      category: "Technology",
      fullDesc:
        "Artificial Intelligence (AI) refers to the simulation of human intelligence processes by machines. It enables computers to learn, reason, and make decisions. From chatbots to self-driving cars, AI is shaping the future of technology in healthcare, education, and industries worldwide.",
      img: "https://media.geeksforgeeks.org/wp-content/uploads/20240319155102/what-is-ai-artificial-intelligence.webp",
      extra:
        "Rapid changes in technology have made AI a key part of daily life — from voice assistants to recommendation systems. The evolution of machine learning and neural networks continues to push the limits of what’s possible.",
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
        "React’s rapid growth shows how technology evolves — focusing on speed, flexibility, and scalability. Developers who adapt early stay ahead of the curve.",
    },
  ];

  const blog = posts.find((p) => p.id === parseInt(id));
  const related = posts.filter((p) => p.id !== parseInt(id));

  if (!blog) {
    return <div className="p-6 text-center text-gray-600">Blog not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Blog Image */}
      <img
        src={blog.img}
        alt={blog.title}
        className="w-full h-[300px] object-cover rounded-xl shadow-lg mb-6"
      />

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{blog.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{blog.category}</p>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-4">{blog.fullDesc}</p>

      {/* Rapid Change Section */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md mb-8">
        <h3 className="font-semibold text-blue-700 mb-2">
          Rapid Change in Technology
        </h3>
        <p className="text-gray-700 text-sm">{blog.extra}</p>
      </div>

      {/* Related Blogs */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Related Blog Articles
      </h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {related.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/blog/${r.id}`)}
          >
            <img
              src={r.img}
              alt={r.title}
              className="w-full h-[160px] object-cover rounded-t-xl"
            />
            <div className="p-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">
                {r.title}
              </h4>
              <p className="text-xs text-gray-500">{r.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDetails;
