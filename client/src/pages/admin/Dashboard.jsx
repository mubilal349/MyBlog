import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, Routes, Route } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  MessageSquare,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [active, setActive] = useState("overview");

  const menuItems = [
    { name: "Overview", path: "overview", icon: Home },
    { name: "Manage Posts", path: "posts", icon: FileText },
    { name: "Manage Users", path: "users", icon: Users },
    { name: "Manage Comments", path: "comments", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">Admin</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.username}</p>
        </div>
        <nav className="flex-1 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setActive(item.path)}
              className={`flex items-center px-3 py-2 mt-2 rounded-lg ${
                active === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="flex items-center px-3 py-2 m-2 text-red-600 rounded-lg hover:bg-red-100"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="overview" element={<Overview />} />
          <Route path="posts" element={<Posts />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="comments" element={<Comments />} />
        </Routes>
      </main>
    </div>
  );
};

// Updated components with blog management functionality
const Overview = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Published</h3>
          <p className="text-3xl font-bold text-green-600">18</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Drafts</h3>
          <p className="text-3xl font-bold text-yellow-600">6</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          <p className="text-3xl font-bold text-purple-600">42</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          <li className="flex items-center p-3 bg-gray-50 rounded">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">New post published</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </li>
          <li className="flex items-center p-3 bg-gray-50 rounded">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Edit className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Post updated</p>
              <p className="text-sm text-gray-500">5 hours ago</p>
            </div>
          </li>
          <li className="flex items-center p-3 bg-gray-50 rounded">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="font-medium">Post deleted</p>
              <p className="text-sm text-gray-500">Yesterday</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Getting Started with React",
      category: "Tutorial",
      status: "Published",
      date: "2023-05-15",
    },
    {
      id: 2,
      title: "Advanced CSS Techniques",
      category: "Design",
      status: "Published",
      date: "2023-05-10",
    },
    {
      id: 3,
      title: "Node.js Best Practices",
      category: "Backend",
      status: "Draft",
      date: "2023-05-05",
    },
    {
      id: 4,
      title: "Introduction to TypeScript",
      category: "Tutorial",
      status: "Published",
      date: "2023-04-28",
    },
    {
      id: 5,
      title: "Web Performance Optimization",
      category: "Development",
      status: "Draft",
      date: "2023-04-20",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "Draft",
    content: "",
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      status: post.status,
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      // Update existing post
      setPosts(
        posts.map((post) =>
          post.id === editingPost.id ? { ...post, ...formData } : post
        )
      );
    } else {
      // Add new post
      const newPost = {
        id: posts.length + 1,
        ...formData,
        date: new Date().toISOString().split("T")[0],
      };
      setPosts([...posts, newPost]);
    }
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData({
      title: "",
      category: "",
      status: "Draft",
      content: "",
    });
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Posts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Post
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{post.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                    {post.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      post.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {post.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingPost ? "Edit Post" : "Add New Post"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Backend">Backend</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="content"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows="6"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingPost(null);
                      setFormData({
                        title: "",
                        category: "",
                        status: "Draft",
                        content: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingPost ? "Update Post" : "Create Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UsersPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>User management functionality will be implemented here.</p>
      </div>
    </div>
  );
};

const Comments = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Comments</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Comment management functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
