import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, Outlet, useLocation } from "react-router-dom";
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
  Sun,
  Moon,
  X,
  Check,
  Settings,
  ShieldCheck,
} from "lucide-react";
import "./adminDashboard.css";

// =========================
// THEME HOOK
// =========================
// Persists to localStorage and falls back to the OS preference on first load.
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("admin-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-admin-theme", theme);
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
};

// =========================
// STAMP BADGE (signature UI element)
// =========================
const Stamp = ({ status }) => (
  <span className={`stamp stamp-${status?.toLowerCase()}`}>{status}</span>
);

// =========================
// ADMIN DASHBOARD SHELL
// =========================
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = user?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const isEditor = role === "editor";

  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    {
      name: "Overview",
      path: "overview",
      icon: Home,
      roles: ["admin", "editor"],
    },

    {
      name: "Manage posts",
      path: "posts",
      icon: FileText,
      roles: ["admin", "editor"],
    },

    ...(isAdmin
      ? [
          {
            name: "Manage users",
            path: "users",
            icon: Users,
            roles: ["admin"],
          },
        ]
      : []),

    {
      name: "Manage comments",
      path: "comments",
      icon: MessageSquare,
      roles: ["admin", "editor"],
    },

    {
      name: "Settings",
      path: "settings",
      icon: Settings,
      roles: ["admin", "editor"],
    },
  ];
  const userRole = user?.role?.toLowerCase();

  const visibleMenuItems = menuItems.filter((item) =>
    item.roles?.includes(userRole),
  );

  // Only Admin gets user management
  if (isAdmin) {
    menuItems.splice(2, 0, {
      name: "Manage users",
      path: "users",
      icon: Users,
    });
  }

  const initials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="admin-dashboard">
      <div className="app-shell">
        {/* ==========================================
        SIDEBAR
    ========================================== */}

        <aside className="sidebar">
          {/* BRAND */}
          <div className="masthead">
            <h1 className="serif">The Desk</h1>
            <p>Blog control room</p>
          </div>

          {/* CURRENT USER */}
          <div className="who">
            <div className="avatar serif">
              {initials(user?.username || "U")}
            </div>

            <div>
              <div className="who-name">{user?.username || "User"}</div>

              <div className="who-role">{user?.role || "User"}</div>
            </div>
          </div>

          {/* ==========================================
          NAVIGATION
      ========================================== */}

          <nav className="nav">
            {visibleMenuItems.map((item) => {
              const isActive = location.pathname === `/admin/${item.path}`;

              return (
                <NavLink
                  key={item.name}
                  to={`/admin/${item.path}`}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* ==========================================
          SIDEBAR FOOTER
      ========================================== */}

          <div className="sidebar-foot">
            {/* THEME */}
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
            >
              <span className="theme-toggle-label">
                {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}

                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>

              <span className="theme-track">
                <span className="theme-dot" />
              </span>
            </button>

            {/* LOGOUT */}
            <button type="button" onClick={logout} className="logout-btn">
              <LogOut size={16} />

              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* ==========================================
        MAIN CONTENT
    ========================================== */}

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// =========================
// OVERVIEW
// =========================
export const Overview = () => {
  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Today</p>
          <h2 className="serif page-title">Dashboard overview</h2>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total posts</p>
          <p className="stat-value">24</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Published</p>
          <p className="stat-value stat-green">18</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Drafts</p>
          <p className="stat-value stat-amber">6</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Comments</p>
          <p className="stat-value stat-accent">42</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">Recent activity</div>
        <div className="activity-item">
          <div className="activity-dot activity-green">
            <Plus size={13} />
          </div>
          <div>
            <p className="activity-title">New post published</p>
            <p className="activity-time">2 hours ago</p>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-dot activity-accent">
            <Edit size={13} />
          </div>
          <div>
            <p className="activity-title">Post updated</p>
            <p className="activity-time">5 hours ago</p>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-dot activity-danger">
            <Trash2 size={13} />
          </div>
          <div>
            <p className="activity-title">Post deleted</p>
            <p className="activity-time">Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================
// POSTS
// =========================
export const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "Draft",
    excerpt: "",
    content: "",
    image: "",
  });

  const API_URL = "http://localhost:5001";

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch posts");

      setPosts(data);
    } catch (err) {
      console.error("Fetch posts error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete post");

      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      category: post.category || "",
      status: post.status || "Draft",
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Enter a title before saving.";
    if (!formData.content.trim()) errs.content = "Content can't be empty.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const url = editingPost
        ? `${API_URL}/api/blogs/${editingPost._id}`
        : `${API_URL}/api/blogs`;
      const method = editingPost ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save post");

      if (editingPost) {
        setPosts((prev) =>
          prev.map((post) => (post._id === editingPost._id ? data.blog : post)),
        );
      } else {
        setPosts((prev) => [data.blog, ...prev]);
      }

      closeModal();
    } catch (err) {
      console.error("Save post error:", err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormErrors({});
    setFormData({
      title: "",
      category: "",
      status: "Draft",
      excerpt: "",
      content: "",
      image: "",
    });
  };

  const filteredPosts = posts.filter((post) =>
    `${post.title} ${post.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Editorial</p>
          <h2 className="serif page-title">Manage posts</h2>
        </div>
        <div className="head-actions">
          <div className="search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setEditingPost(null);
              setFormData({
                title: "",
                category: "",
                status: "Draft",
                excerpt: "",
                content: "",
                image: "",
              });
              setFormErrors({});
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <Plus size={15} />
            New post
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="panel">
        {loading ? (
          <div className="empty-state">
            <p>Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <Search size={28} />
            <p>No posts found.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <div className="cell-title">{post.title}</div>
                    {post.excerpt && (
                      <div className="cell-sub">{post.excerpt}</div>
                    )}
                  </td>
                  <td>
                    <span className="tag">{post.category}</span>
                  </td>
                  <td>
                    <Stamp status={post.status} />
                  </td>
                  <td className="cell-meta">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        onClick={() => handleEdit(post)}
                        className="icon-btn"
                        aria-label="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="icon-btn icon-btn-danger"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal">
            <div className="modal-head">
              <h3 className="serif">
                {editingPost ? "Edit post" : "New post"}
              </h3>
              <button onClick={closeModal} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="field">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Give the piece a headline"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {formErrors.title && (
                    <div className="error-text">{formErrors.title}</div>
                  )}
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option value="">Select category</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Backend">Backend</option>
                      <option value="AI">AI</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>Status</label>
                    <select
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

                <div className="field">
                  <label>Excerpt</label>
                  <textarea
                    rows="2"
                    placeholder="Short description of your blog..."
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label>Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>

                <div className="field">
                  <label>Content</label>
                  <textarea
                    rows="8"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                  />
                  {formErrors.content && (
                    <div className="error-text">{formErrors.content}</div>
                  )}
                </div>
              </div>

              <div className="modal-foot">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving
                    ? "Saving..."
                    : editingPost
                      ? "Update post"
                      : "Create post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================
// USERS (placeholder — wire up to your users API when it exists)
// =========================
export const UsersPage = () => {
  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Masthead</p>
          <h2 className="serif page-title">Manage users</h2>
        </div>
      </div>
      <div className="panel">
        <div className="empty-state">
          <Users size={28} />
          <p>
            User management is on its way. Connect an API to populate this
            table.
          </p>
        </div>
      </div>
    </div>
  );
};

// =========================
// COMMENTS (placeholder — wire up to your comments API when it exists)
// =========================
export const Comments = () => {
  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Letters to the editor</p>
          <h2 className="serif page-title">Manage comments</h2>
        </div>
      </div>
      <div className="panel">
        <div className="empty-state">
          <MessageSquare size={28} />
          <p>
            Comment moderation is on its way. Connect an API to populate this
            table.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
