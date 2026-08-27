import React, { useEffect, useState } from "react";

import {
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../services/blogServices.js";

import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";

const Posts = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [editingPost, setEditingPost] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");

  const [newPost, setNewPost] = useState({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    image: "",
    status: "Draft",
  });

  // ==========================================
  // FETCH POSTS FROM DATABASE
  // ==========================================

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const blogs = await getAllBlogsAdmin();

      setPosts(blogs);
    } catch (error) {
      console.error("Load posts error:", error);

      setError(error.response?.data?.error || "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON COMPONENT MOUNT
  // ==========================================

  useEffect(() => {
    loadPosts();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN CREATE FORM
  // ==========================================

  const openCreateForm = () => {
    setEditingPost(null);

    setNewPost({
      title: "",
      category: "",
      excerpt: "",
      content: "",
      image: "",
      status: "Draft",
    });

    setShowForm(true);

    setError("");
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (post) => {
    setEditingPost(post);

    setNewPost({
      title: post.title || "",
      category: post.category || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
      status: post.status || "Draft",
    });

    setShowForm(true);

    setError("");
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingPost(null);

    setNewPost({
      title: "",
      category: "",
      excerpt: "",
      content: "",
      image: "",
      status: "Draft",
    });

    setError("");
  };

  // ==========================================
  // CREATE / UPDATE POST
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newPost.title.trim() ||
      !newPost.category.trim() ||
      !newPost.content.trim()
    ) {
      setError("Title, category and content are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingPost) {
        // ==========================================
        // UPDATE POST
        // ==========================================

        const response = await updateBlog(editingPost._id, newPost);

        console.log("UPDATE BLOG RESPONSE:", response);

        // Support different response structures
        const updatedBlog =
          response?.blog || response?.data?.blog || response?.data || response;

        if (!updatedBlog || !updatedBlog._id) {
          console.error("Invalid updated blog response:", response);

          setError("Post was updated, but the server returned invalid data.");
          return;
        }

        setPosts((prevPosts) =>
          prevPosts
            .filter(Boolean)
            .map((post) => (post._id === updatedBlog._id ? updatedBlog : post)),
        );
      } else {
        // ==========================================
        // CREATE POST
        // ==========================================

        const response = await createBlog(newPost);

        console.log("CREATE BLOG RESPONSE:", response);

        const createdBlog =
          response?.blog || response?.data?.blog || response?.data || response;

        if (!createdBlog || !createdBlog._id) {
          console.error("Invalid created blog response:", response);

          setError("Post was created, but the server returned invalid data.");
          return;
        }

        setPosts((prevPosts) => [createdBlog, ...prevPosts.filter(Boolean)]);
      }

      closeForm();
    } catch (error) {
      console.error("Save post error:", error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to save blog post.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE POST
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this post?",
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await deleteBlog(id);

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Delete post error:", error);

      setError(error.response?.data?.error || "Failed to delete blog post.");
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredPosts = posts.filter((post) => {
    if (!post) return false;

    const searchText = search.toLowerCase();

    return (
      post.title?.toLowerCase().includes(searchText) ||
      post.category?.toLowerCase().includes(searchText) ||
      post.author?.username?.toLowerCase().includes(searchText) ||
      post.author?.email?.toLowerCase().includes(searchText)
    );
  });

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-8">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ad-ink)]">
            Manage Posts
          </h2>

          <p className="text-[var(--ad-ink-faint)] mt-1">
            Create, edit and manage your blog posts.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="
            flex items-center gap-2
            px-5 py-2.5
            rounded-lg
            bg-[var(--ad-accent)]
            text-white
            font-medium
            hover:opacity-90
            transition
            cursor-pointer
          "
        >
          <Plus size={18} />
          New Post
        </button>
      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div
          className="
            flex items-center justify-between gap-4
            p-4
            rounded-xl
            border border-red-200
            bg-red-50
            text-red-700
            dark:bg-red-950/30
            dark:border-red-900
            dark:text-red-400
          "
        >
          <span className="text-sm">{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ==========================================
          CREATE / EDIT FORM
      ========================================== */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="
            bg-[var(--ad-surface)]
            border border-[var(--ad-rule)]
            rounded-2xl
            shadow-sm
            p-6
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="
                  w-10 h-10
                  rounded-lg
                  bg-[var(--ad-accent-soft)]
                  flex items-center justify-center
                "
              >
                {editingPost ? (
                  <Edit size={20} className="text-[var(--ad-accent-ink)]" />
                ) : (
                  <Plus size={20} className="text-[var(--ad-accent-ink)]" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[var(--ad-ink)]">
                  {editingPost ? "Edit Post" : "Add New Post"}
                </h3>

                <p className="text-sm text-[var(--ad-ink-faint)]">
                  {editingPost
                    ? "Update your blog post"
                    : "Create a new blog post"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="
                p-2
                rounded-lg
                text-[var(--ad-ink-faint)]
                hover:bg-[var(--ad-surface-2)]
                cursor-pointer
              "
            >
              <X size={20} />
            </button>
          </div>

          {/* FORM GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* TITLE */}

            <div>
              <label className="block text-sm font-medium text-[var(--ad-ink-soft)] mb-2">
                Post Title *
              </label>

              <input
                type="text"
                name="title"
                value={newPost.title}
                onChange={handleChange}
                placeholder="Enter post title"
                maxLength={200}
                className="
                  w-full
                  px-4 py-2.5
                  rounded-lg
                  border border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  text-[var(--ad-ink)]
                  placeholder:text-[var(--ad-ink-faint)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ad-accent-soft)]
                  focus:border-[var(--ad-accent)]
                "
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="block text-sm font-medium text-[var(--ad-ink-soft)] mb-2">
                Category *
              </label>

              <input
                type="text"
                name="category"
                value={newPost.category}
                onChange={handleChange}
                placeholder="e.g. React, Node.js"
                className="
                  w-full
                  px-4 py-2.5
                  rounded-lg
                  border border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  text-[var(--ad-ink)]
                  placeholder:text-[var(--ad-ink-faint)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ad-accent-soft)]
                  focus:border-[var(--ad-accent)]
                "
              />
            </div>

            {/* IMAGE */}

            <div>
              <label className="block text-sm font-medium text-[var(--ad-ink-soft)] mb-2">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={newPost.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="
                  w-full
                  px-4 py-2.5
                  rounded-lg
                  border border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  text-[var(--ad-ink)]
                  placeholder:text-[var(--ad-ink-faint)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ad-accent-soft)]
                  focus:border-[var(--ad-accent)]
                "
              />
            </div>

            {/* STATUS */}

            <div>
              <label className="block text-sm font-medium text-[var(--ad-ink-soft)] mb-2">
                Status
              </label>

              <select
                name="status"
                value={newPost.status}
                onChange={handleChange}
                className="
                  w-full
                  px-4 py-2.5
                  rounded-lg
                  border border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  text-[var(--ad-ink)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ad-accent-soft)]
                  focus:border-[var(--ad-accent)]
                "
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            {/* EXCERPT */}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--ad-ink-soft)] mb-2">
                Excerpt
              </label>

              <textarea
                name="excerpt"
                value={newPost.excerpt}
                onChange={handleChange}
                placeholder="Short description of your post..."
                maxLength={500}
                rows={3}
                className="
                  w-full
                  px-4 py-2.5
                  rounded-lg
                  border border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  text-[var(--ad-ink)]
                  placeholder:text-[var(--ad-ink-faint)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ad-accent-soft)]
                  focus:border-[var(--ad-accent)]
                  resize-none
                "
              />
            </div>

            {/* CONTENT */}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--ad-ink-soft)] mb-2">
                Content *
              </label>

              <textarea
                name="content"
                value={newPost.content}
                onChange={handleChange}
                placeholder="Write your blog content here..."
                rows={10}
                className="
                  w-full
                  px-4 py-3
                  rounded-lg
                  border border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  text-[var(--ad-ink)]
                  placeholder:text-[var(--ad-ink-faint)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ad-accent-soft)]
                  focus:border-[var(--ad-accent)]
                  resize-y
                "
              />
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={closeForm}
              className="
                px-5 py-2.5
                rounded-lg
                border border-[var(--ad-rule)]
                bg-[var(--ad-surface)]
                text-[var(--ad-ink-soft)]
                hover:bg-[var(--ad-surface-2)]
                cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="
                flex items-center gap-2
                px-5 py-2.5
                rounded-lg
                bg-[var(--ad-accent)]
                text-white
                font-medium
                hover:opacity-90
                disabled:opacity-50
                cursor-pointer
              "
            >
              <Plus size={18} />

              {saving
                ? "Saving..."
                : editingPost
                  ? "Update Post"
                  : "Create Post"}
            </button>
          </div>
        </form>
      )}

      {/* ==========================================
          POSTS LIST
      ========================================== */}

      <div
        className="
          bg-[var(--ad-surface)]
          border border-[var(--ad-rule)]
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        {/* HEADER */}

        <div className="p-6 border-b border-[var(--ad-rule)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--ad-ink)]">
                All Posts
              </h3>

              <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                {posts.length} total posts
              </p>
            </div>

            {/* SEARCH */}

            <div className="relative">
              <Search
                size={17}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[var(--ad-ink-faint)]
                "
              />

              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full md:w-64
                  pl-9 pr-4 py-2.5
                  rounded-lg
                  border border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  text-[var(--ad-ink)]
                  placeholder:text-[var(--ad-ink-faint)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ad-accent-soft)]
                  focus:border-[var(--ad-accent)]
                "
              />
            </div>
          </div>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="py-16 text-center">
            <div className="flex justify-center mb-4">
              <div
                className="
                  w-8 h-8
                  border-4
                  border-[var(--ad-rule)]
                  border-t-[var(--ad-accent)]
                  rounded-full
                  animate-spin
                "
              />
            </div>

            <p className="text-sm text-[var(--ad-ink-faint)]">
              Loading posts...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* TABLE HEADER */}

              <thead>
                <tr
                  className="
                    bg-[var(--ad-surface-2)]
                    border-b border-[var(--ad-rule)]
                  "
                >
                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--ad-ink-faint)]">
                    Post
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--ad-ink-faint)]">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--ad-ink-faint)]">
                    Author
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--ad-ink-faint)]">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--ad-ink-faint)]">
                    Date
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--ad-ink-faint)]">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="
                        border-b border-[var(--ad-rule)]
                        hover:bg-[var(--ad-surface-2)]
                        transition
                      "
                    >
                      {/* POST */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-10 h-10
                              rounded-lg
                              bg-[var(--ad-accent-soft)]
                              flex items-center justify-center
                              shrink-0
                            "
                          >
                            <FileText
                              size={18}
                              className="text-[var(--ad-accent-ink)]"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-[var(--ad-ink)] truncate max-w-xs">
                              {post.title}
                            </p>

                            <p className="text-xs text-[var(--ad-ink-faint)] mt-1">
                              /{post.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-4">
                        <span
                          className="
                            inline-flex
                            px-3 py-1
                            rounded-full
                            text-xs
                            font-medium
                            bg-[var(--ad-accent-soft)]
                            text-[var(--ad-accent-ink)]
                          "
                        >
                          {post.category}
                        </span>
                      </td>

                      {/* AUTHOR */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--ad-ink-soft)]">
                          {post.author?.username ||
                            post.author?.email ||
                            "Unknown"}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        {post.status === "Published" ? (
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-3 py-1
                              rounded-full
                              text-xs
                              font-medium
                              bg-green-100
                              text-green-700
                              dark:bg-green-950/50
                              dark:text-green-400
                            "
                          >
                            <CheckCircle size={13} />
                            Published
                          </span>
                        ) : (
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-3 py-1
                              rounded-full
                              text-xs
                              font-medium
                              bg-yellow-100
                              text-yellow-700
                              dark:bg-yellow-950/50
                              dark:text-yellow-400
                            "
                          >
                            <Clock size={13} />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* DATE */}

                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--ad-ink-faint)]">
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => openEditForm(post)}
                            className="
                              flex items-center gap-1.5
                              px-3 py-1.5
                              rounded-lg
                              border border-[var(--ad-rule)]
                              bg-[var(--ad-surface)]
                              text-[var(--ad-ink-soft)]
                              hover:bg-[var(--ad-surface-2)]
                              hover:text-[var(--ad-ink)]
                              cursor-pointer
                            "
                          >
                            <Edit size={15} />
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() => handleDelete(post._id)}
                            className="
                              flex items-center gap-1.5
                              px-3 py-1.5
                              rounded-lg
                              bg-red-50
                              text-red-600
                              hover:bg-red-100
                              dark:bg-red-950/40
                              dark:text-red-400
                              dark:hover:bg-red-950/70
                              cursor-pointer
                            "
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <FileText
                        size={40}
                        className="
                          mx-auto
                          text-[var(--ad-ink-faint)]
                          opacity-40
                          mb-3
                        "
                      />

                      <p className="font-medium text-[var(--ad-ink)]">
                        No posts found
                      </p>

                      <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                        {search
                          ? "Try another search term."
                          : "Create your first blog post."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
