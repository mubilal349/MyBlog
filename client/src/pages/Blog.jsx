import React from "react";
import { Link } from "react-router-dom";

const blogData = [
  {
    category: "AI",
    posts: [
      {
        id: 1,
        title: "How AI is Revolutionizing the Future",
        image: "/Images/Ai/ai-1.jfif",
      },
      {
        id: 2,
        title: "Top 5 AI Tools You Should Know",
        image: "/Images/Ai/ai-2.jfif",
      },
      {
        id: 3,
        title: "Understanding Machine Learning Basics",
        image: "/Images/Ai/ai-3.webp",
      },
      {
        id: 4,
        title: "AI Ethics: Balancing Innovation and Responsibility",
        image: "/Images/Ai/ai-4.jfif",
      },
    ],
  },
  {
    category: "Web Development",
    posts: [
      {
        id: 5,
        title: "Modern Web Trends in 2025",
        image: "/Images/web-dev/web-dev-1.jfif",
      },
      {
        id: 6,
        title: "React vs Next.js: Which to Choose?",
        image: "/Images/web-dev/web-dev-2.jfif",
      },
      {
        id: 7,
        title: "Building Responsive Layouts with TailwindCSS",
        image: "/Images/web-dev/web-dev-3.jfif",
      },
      {
        id: 8,
        title: "Improving Web Performance for SEO",
        image: "/Images/web-dev/web-dev-4.jfif",
      },
    ],
  },
  {
    category: "App Development",
    posts: [
      {
        id: 9,
        title: "Flutter vs React Native: Detailed Comparison",
        image: "/Images/app-dev/app-dev-1.jfif",
      },
      {
        id: 10,
        title: "Building Cross-Platform Apps in 2025",
        image: "/Images/app-dev/app-dev-2.jfif",
      },
      {
        id: 11,
        title: "Top 10 UI/UX Tips for Mobile Developers",
        image: "/Images/app-dev/app-dev-3.jfif",
      },
      {
        id: 12,
        title: "How to Optimize Your App Performance",
        image: "/Images/app-dev/app-dev-4.png",
      },
    ],
  },
  {
    category: "Blockchain",
    posts: [
      {
        id: 13,
        title: "What is Blockchain? A Beginner’s Guide",
        image: "/Images/blockchain/blockchain-1.jfif",
      },
      {
        id: 14,
        title: "How Blockchain Is Changing the Finance Industry",
        image: "/Images/blockchain/blockchain-2.jfif",
      },
      {
        id: 15,
        title: "Smart Contracts: The Future of Automation",
        image: "/Images/blockchain/blockchain-3.jfif",
      },
      {
        id: 16,
        title: "Top 5 Use Cases of Blockchain in 2025",
        image: "/Images/blockchain/blockchain-4.jfif",
      },
    ],
  },
];

const Blog = () => {
  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h2 className="text-3xl mt-10 font-bold text-center mb-8 text-gray-800">
        Our Latest Blogs
      </h2>

      {blogData.map((section) => (
        <div key={section.category} className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6 border-l-4 border-blue-500 pl-3">
            {section.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 line-clamp-2">
                    {post.title}
                  </h4>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
