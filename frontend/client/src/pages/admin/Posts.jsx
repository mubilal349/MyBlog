import React, { useEffect, useMemo, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import {
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../services/blogServices.js";

import {
  FileText,
  Plus,
  Edit3,
  Search,
  CheckCircle,
  Clock3,
  Send,
  Eye,
  X,
  ArrowLeft,
  Trash2,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Unlink,
  Eraser,
  Maximize2,
  Minimize2,
  Save,
  User,
  CalendarDays,
  BookOpen,
  AlertCircle,
} from "lucide-react";

// ============================================================
// EMPTY POST
// ============================================================

const EMPTY_POST = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  image: "",
  status: "Draft",
};

// ============================================================
// LOCAL AUTOSAVE KEY
// ============================================================

const AUTOSAVE_STORAGE_KEY = "blog_editor_autosave";

// ============================================================
// STATUS TABS
// ============================================================

const STATUS_TABS = [
  {
    key: "All",
    label: "All Posts",
  },
  {
    key: "Draft",
    label: "Drafts",
  },
  {
    key: "Pending Review",
    label: "In Review",
  },
  {
    key: "Published",
    label: "Published",
  },
];

// ============================================================
// STATUS NORMALIZER
// ============================================================

const normalizeStatus = (status) => {
  if (!status) {
    return "Draft";
  }

  const value = String(status).trim().toLowerCase();

  if (value === "draft") {
    return "Draft";
  }

  if (
    value === "pending" ||
    value === "pending review" ||
    value === "pending-review" ||
    value === "in review" ||
    value === "in-review" ||
    value === "review"
  ) {
    return "Pending Review";
  }

  if (value === "published" || value === "publish" || value === "live") {
    return "Published";
  }

  return "Draft";
};

// ============================================================
// USER ID
// ============================================================

const getUserId = (user) => {
  return user?._id || user?.id || user?.userId || null;
};

// ============================================================
// AUTHOR ID
// ============================================================

const getAuthorId = (post) => {
  if (!post?.author) {
    return null;
  }

  if (typeof post.author === "string") {
    return post.author;
  }

  return post.author?._id || post.author?.id || post.author?.userId || null;
};

// ============================================================
// STRIP HTML
// ============================================================

const stripHtml = (html = "") => {
  const temporary = document.createElement("div");

  temporary.innerHTML = html;

  return temporary.textContent || temporary.innerText || "";
};

// ============================================================
// WORD COUNT
// ============================================================

const countWords = (text = "") => {
  const cleanText = stripHtml(text).trim();

  if (!cleanText) {
    return 0;
  }

  return cleanText.split(/\s+/).filter(Boolean).length;
};

// ============================================================
// READING TIME
// ============================================================

const calculateReadingTime = (text = "") => {
  const words = countWords(text);

  if (!words) {
    return 0;
  }

  return Math.max(1, Math.ceil(words / 200));
};

// ============================================================
// FORMAT DATE
// ============================================================

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// ============================================================
// COMPONENT
// ============================================================

const Posts = () => {
  const { user } = useAuth();

  const editorRef = useRef(null);

  // ==========================================================
  // USER / ROLE
  // ==========================================================

  const currentUserId = getUserId(user);

  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  const isEditor = String(user?.role || "").toLowerCase() === "editor";

  // ==========================================================
  // STATE
  // ==========================================================

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================================================
  // AUTOSAVE STATE
  // ==========================================================

  const [autoSaving, setAutoSaving] = useState(false);

  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");

  const [lastAutoSavedAt, setLastAutoSavedAt] = useState(null);

  const autoSaveTimerRef = useRef(null);

  const autoSaveRequestRef = useRef(false);

  const lastSavedDataRef = useRef(null);

  // ==========================================================
  // OTHER STATE
  // ==========================================================

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState("All");

  const [editingPost, setEditingPost] = useState(null);

  const [showEditor, setShowEditor] = useState(false);

  const [showPreview, setShowPreview] = useState(false);

  const [fullscreen, setFullscreen] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [linkUrl, setLinkUrl] = useState("");

  const [showLinkInput, setShowLinkInput] = useState(false);

  const [newPost, setNewPost] = useState(EMPTY_POST);

  // ==========================================================
  // OWN POST
  // ==========================================================

  const isOwnPost = (post) => {
    if (!post || !currentUserId) {
      return false;
    }

    const authorId = getAuthorId(post);

    if (!authorId) {
      return false;
    }

    return String(authorId) === String(currentUserId);
  };

  // ==========================================================
  // LOAD POSTS
  // ==========================================================

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllBlogsAdmin();

      const blogs =
        response?.blogs || response?.data?.blogs || response?.data || [];

      const safeBlogs = Array.isArray(blogs) ? blogs.filter(Boolean) : [];

      setPosts(safeBlogs);
    } catch (err) {
      console.error("Load posts error:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to load blog posts.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    loadPosts();
  }, [user]);

  // ==========================================================
  // CLEAR MESSAGES
  // ==========================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ==========================================================
  // GET CURRENT POST DATA
  // ==========================================================

  const getCurrentPostData = () => {
    const content = editorRef.current?.innerHTML || newPost.content || "";

    return {
      title: newPost.title || "",
      category: newPost.category || "",
      excerpt: newPost.excerpt || "",
      content,
      image: newPost.image || "",
      status: "Draft",
    };
  };

  // ==========================================================
  // HANDLE INPUT
  // ==========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewPost((previous) => ({
      ...previous,
      [name]: value,
    }));

    setAutoSaveStatus("unsaved");

    clearMessages();
  };

  // ==========================================================
  // CONTENT CHANGE
  // ==========================================================

  const handleContentChange = () => {
    const html = editorRef.current?.innerHTML || "";

    setNewPost((previous) => ({
      ...previous,
      content: html,
    }));

    setAutoSaveStatus("unsaved");

    clearMessages();
  };

  // ==========================================================
  // LOCAL AUTOSAVE
  // ==========================================================

  const saveToLocalStorage = () => {
    const data = getCurrentPostData();

    const hasContent =
      data.title.trim() ||
      data.category.trim() ||
      data.excerpt.trim() ||
      stripHtml(data.content).trim() ||
      data.image.trim();

    if (!hasContent) {
      return false;
    }

    try {
      localStorage.setItem(
        AUTOSAVE_STORAGE_KEY,
        JSON.stringify({
          ...data,
          editingPostId: editingPost?._id || null,
          savedAt: new Date().toISOString(),
        }),
      );

      return true;
    } catch (error) {
      console.error("Local autosave failed:", error);

      return false;
    }
  };

  // ==========================================================
  // SERVER AUTOSAVE
  // ==========================================================

  const saveDraftAutomatically = async () => {
    if (
      !showEditor ||
      showPreview ||
      saving ||
      autoSaving ||
      autoSaveRequestRef.current
    ) {
      return;
    }

    const data = getCurrentPostData();

    const hasContent =
      data.title.trim() ||
      data.category.trim() ||
      data.excerpt.trim() ||
      stripHtml(data.content).trim() ||
      data.image.trim();

    if (!hasContent) {
      return;
    }

    // --------------------------------------------------------
    // ALWAYS SAVE LOCALLY
    // --------------------------------------------------------

    saveToLocalStorage();

    // --------------------------------------------------------
    // NEW POST
    // --------------------------------------------------------

    // New posts don't have an ID until manually created.
    // LocalStorage protects them until that point.
    if (!editingPost?._id) {
      setAutoSaveStatus("saved");
      setLastAutoSavedAt(new Date());

      return;
    }

    // --------------------------------------------------------
    // AVOID DUPLICATE REQUESTS
    // --------------------------------------------------------

    const currentDataString = JSON.stringify(data);

    if (lastSavedDataRef.current === currentDataString) {
      setAutoSaveStatus("saved");
      return;
    }

    try {
      autoSaveRequestRef.current = true;

      setAutoSaving(true);
      setAutoSaveStatus("saving");

      const payload = {
        title: data.title.trim(),
        category: data.category.trim(),
        excerpt: data.excerpt.trim(),
        content: data.content,
        image: data.image.trim(),

        // IMPORTANT:
        // Autosave can ONLY create/update a draft.
        status: "Draft",
      };

      const response = await updateBlog(editingPost._id, payload);

      const updatedBlog = response?.blog || response?.data?.blog || null;

      if (updatedBlog?._id) {
        setPosts((previousPosts) =>
          previousPosts.map((post) =>
            post._id === updatedBlog._id ? updatedBlog : post,
          ),
        );

        // Keep the editor's currently edited post
        // synchronized with the server response.
        setEditingPost((previous) => {
          if (!previous || previous._id !== updatedBlog._id) {
            return previous;
          }

          return updatedBlog;
        });
      }

      lastSavedDataRef.current = currentDataString;

      setLastAutoSavedAt(new Date());

      setAutoSaveStatus("saved");
    } catch (error) {
      console.error("Autosave failed:", error);

      setAutoSaveStatus("error");
    } finally {
      setAutoSaving(false);

      autoSaveRequestRef.current = false;
    }
  };

  // ==========================================================
  // AUTOSAVE WATCHER
  // ==========================================================

  useEffect(() => {
    if (!showEditor || showPreview) {
      return;
    }

    const currentData = getCurrentPostData();

    const currentDataString = JSON.stringify(currentData);

    if (
      lastSavedDataRef.current &&
      lastSavedDataRef.current === currentDataString
    ) {
      return;
    }

    const hasContent =
      currentData.title.trim() ||
      currentData.category.trim() ||
      currentData.excerpt.trim() ||
      stripHtml(currentData.content).trim() ||
      currentData.image.trim();

    if (!hasContent) {
      return;
    }

    setAutoSaveStatus("unsaved");

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveDraftAutomatically();
    }, 5000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    newPost.title,
    newPost.category,
    newPost.excerpt,
    newPost.content,
    newPost.image,
    showEditor,
    showPreview,
    editingPost?._id,
  ]);

  // ==========================================================
  // RESTORE LOCAL AUTOSAVE
  // ==========================================================

  useEffect(() => {
    if (!user) {
      return;
    }

    try {
      const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY);

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);

      if (!parsed) {
        return;
      }

      const hasSavedContent =
        parsed.title ||
        parsed.category ||
        parsed.excerpt ||
        parsed.content ||
        parsed.image;

      if (!hasSavedContent) {
        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);

        return;
      }

      const shouldRestore = window.confirm(
        "An unsaved draft was found. Would you like to restore it?",
      );

      if (!shouldRestore) {
        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);

        return;
      }

      // ------------------------------------------------------
      // IMPORTANT
      // ------------------------------------------------------
      // Only restore an existing post if it has an ID.
      // If it doesn't have an ID, it is treated as a
      // completely new draft.

      if (parsed.editingPostId) {
        const existingPost = posts.find(
          (post) => String(post._id) === String(parsed.editingPostId),
        );

        if (existingPost) {
          setEditingPost(existingPost);
        } else {
          setEditingPost({
            _id: parsed.editingPostId,
          });
        }
      } else {
        setEditingPost(null);
      }

      setNewPost({
        title: parsed.title || "",
        category: parsed.category || "",
        excerpt: parsed.excerpt || "",
        content: parsed.content || "",
        image: parsed.image || "",
        status: "Draft",
      });

      lastSavedDataRef.current = JSON.stringify({
        title: parsed.title || "",
        category: parsed.category || "",
        excerpt: parsed.excerpt || "",
        content: parsed.content || "",
        image: parsed.image || "",
        status: "Draft",
      });

      setAutoSaveStatus("saved");

      if (parsed.savedAt) {
        setLastAutoSavedAt(new Date(parsed.savedAt));
      }

      setShowEditor(true);

      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = parsed.content || "";
        }
      }, 100);

      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to restore autosave:", error);
    }
  }, [user]);

  // ==========================================================
  // CREATE FORM
  // ==========================================================

  const openCreateForm = () => {
    clearMessages();

    setEditingPost(null);

    setNewPost({
      ...EMPTY_POST,
      status: "Draft",
    });

    lastSavedDataRef.current = null;

    setAutoSaveStatus("saved");

    setLastAutoSavedAt(null);

    setShowPreview(false);

    setShowLinkInput(false);

    setLinkUrl("");

    setShowEditor(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = "";

        editorRef.current.focus();
      }
    }, 0);
  };

  // ==========================================================
  // EDIT FORM
  // ==========================================================

  const openEditForm = (post) => {
    clearMessages();

    if (!post) {
      setError("Invalid post.");

      return;
    }

    // Editor can only edit own posts
    if (isEditor && !isOwnPost(post)) {
      setError("You can only edit posts created by you.");

      return;
    }

    const status = normalizeStatus(post.status);

    setEditingPost(post);

    const initialData = {
      title: post.title || "",
      category: post.category || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
      status,
    };

    setNewPost(initialData);

    lastSavedDataRef.current = JSON.stringify({
      title: post.title || "",
      category: post.category || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
      status: "Draft",
    });

    setAutoSaveStatus("saved");

    setLastAutoSavedAt(null);

    setShowPreview(false);

    setShowLinkInput(false);

    setLinkUrl("");

    setShowEditor(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = post.content || "";
      }
    }, 0);
  };

  // ==========================================================
  // CLOSE EDITOR
  // ==========================================================

  const closeEditor = () => {
    if (saving) {
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setShowEditor(false);

    setEditingPost(null);

    setShowPreview(false);

    setFullscreen(false);

    setShowLinkInput(false);

    setLinkUrl("");

    setNewPost(EMPTY_POST);

    setAutoSaveStatus("saved");

    setLastAutoSavedAt(null);

    lastSavedDataRef.current = null;

    clearMessages();
  };

  // ==========================================================
  // RICH TEXT COMMAND
  // ==========================================================

  const executeCommand = (command, value = null) => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();

    document.execCommand(command, false, value);

    handleContentChange();
  };

  // ==========================================================
  // FORMAT BLOCK
  // ==========================================================

  const formatBlock = (tag) => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();

    document.execCommand("formatBlock", false, tag);

    handleContentChange();
  };

  // ==========================================================
  // INSERT LINK
  // ==========================================================

  const handleInsertLink = () => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();

    if (!linkUrl.trim()) {
      setShowLinkInput(false);

      return;
    }

    let url = linkUrl.trim();

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("/")
    ) {
      url = `https://${url}`;
    }

    document.execCommand("createLink", false, url);

    setLinkUrl("");

    setShowLinkInput(false);

    handleContentChange();
  };

  // ==========================================================
  // CODE BLOCK
  // ==========================================================

  const insertCodeBlock = () => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();

    document.execCommand(
      "insertHTML",
      false,
      `<pre><code>// Write your code here...</code></pre><p><br></p>`,
    );

    handleContentChange();
  };

  // ==========================================================
  // IMAGE
  // ==========================================================

  const insertImage = () => {
    const imageUrl = window.prompt("Enter image URL:");

    if (!imageUrl?.trim()) {
      return;
    }

    editorRef.current?.focus();

    document.execCommand(
      "insertHTML",
      false,
      `<img src="${imageUrl.trim()}" alt="Blog image" class="editor-image" />`,
    );

    handleContentChange();
  };

  // ==========================================================
  // REMOVE LINK
  // ==========================================================

  const removeLink = () => {
    executeCommand("unlink");
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (e, desiredStatus = null) => {
    e.preventDefault();

    clearMessages();

    const content = editorRef.current?.innerHTML || newPost.content || "";

    const plainContent = stripHtml(content).trim();

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!newPost.title.trim()) {
      setError("Post title is required.");

      return;
    }

    if (!newPost.category.trim()) {
      setError("Category is required.");

      return;
    }

    if (!plainContent) {
      setError("Post content is required.");

      return;
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    let selectedStatus = desiredStatus || newPost.status || "Draft";

    selectedStatus = normalizeStatus(selectedStatus);

    // --------------------------------------------------------
    // EDITOR SECURITY
    // --------------------------------------------------------

    if (isEditor && selectedStatus === "Published") {
      setError("Editors cannot publish posts. Submit the post for review.");

      return;
    }

    // --------------------------------------------------------
    // ADMIN CAN PUBLISH
    // --------------------------------------------------------

    if (
      isAdmin &&
      selectedStatus !== "Draft" &&
      selectedStatus !== "Pending Review" &&
      selectedStatus !== "Published"
    ) {
      selectedStatus = "Draft";
    }

    // --------------------------------------------------------
    // EDITOR STATUS
    // --------------------------------------------------------

    if (
      isEditor &&
      selectedStatus !== "Draft" &&
      selectedStatus !== "Pending Review"
    ) {
      selectedStatus = "Draft";
    }

    // --------------------------------------------------------
    // PAYLOAD
    // --------------------------------------------------------

    const payload = {
      title: newPost.title.trim(),
      category: newPost.category.trim(),
      excerpt: newPost.excerpt?.trim() || "",
      content,
      image: newPost.image?.trim() || "",
      status: selectedStatus,
    };

    console.log("=================================");

    console.log("BLOG SAVE REQUEST");

    console.log("Role:", user?.role);

    console.log("Status:", selectedStatus);

    console.log("Payload:", payload);

    console.log("=================================");

    try {
      setSaving(true);

      // ======================================================
      // UPDATE
      // ======================================================

      if (editingPost) {
        if (isEditor && !isOwnPost(editingPost)) {
          setError("You can only edit your own posts.");

          return;
        }

        const response = await updateBlog(editingPost._id, payload);

        const updatedBlog = response?.blog || response?.data?.blog || null;

        if (!updatedBlog?._id) {
          setError("Post was updated, but the server returned invalid data.");

          return;
        }

        setPosts((previousPosts) =>
          previousPosts.map((post) =>
            post._id === updatedBlog._id ? updatedBlog : post,
          ),
        );

        setEditingPost(updatedBlog);

        setNewPost((previous) => ({
          ...previous,
          content: updatedBlog.content || previous.content,
          status: normalizeStatus(updatedBlog.status),
        }));

        // ----------------------------------------------------
        // CLEAR AUTOSAVE
        // ----------------------------------------------------

        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);

        lastSavedDataRef.current = JSON.stringify({
          title: payload.title,
          category: payload.category,
          excerpt: payload.excerpt,
          content: payload.content,
          image: payload.image,
          status: "Draft",
        });

        setAutoSaveStatus("saved");

        setLastAutoSavedAt(new Date());

        if (selectedStatus === "Published") {
          setSuccess("Post published successfully!");
        } else if (selectedStatus === "Pending Review") {
          setSuccess("Post submitted for review successfully.");
        } else {
          setSuccess("Draft saved successfully.");
        }
      }

      // ======================================================
      // CREATE
      // ======================================================
      else {
        const response = await createBlog(payload);

        const createdBlog = response?.blog || response?.data?.blog || null;

        if (!createdBlog?._id) {
          setError("Post was created, but the server returned invalid data.");

          return;
        }

        setPosts((previousPosts) => [createdBlog, ...previousPosts]);

        // ----------------------------------------------------
        // IMPORTANT
        // ----------------------------------------------------
        // Once the new post exists on the server,
        // clear the local temporary draft.

        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);

        lastSavedDataRef.current = JSON.stringify({
          title: payload.title,
          category: payload.category,
          excerpt: payload.excerpt,
          content: payload.content,
          image: payload.image,
          status: "Draft",
        });

        setAutoSaveStatus("saved");

        setLastAutoSavedAt(new Date());

        if (selectedStatus === "Published") {
          setSuccess("Post published successfully!");
        } else if (selectedStatus === "Pending Review") {
          setSuccess("Post submitted for review successfully.");
        } else {
          setSuccess("Draft created successfully.");
        }
      }

      // ------------------------------------------------------
      // CLOSE
      // ------------------------------------------------------

      setTimeout(() => {
        closeEditor();

        loadPosts();
      }, 700);
    } catch (err) {
      console.error("Save editor post error:", err);

      console.error("Backend response:", err.response?.data);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to save blog post.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // PREVIEW
  // ==========================================================

  const togglePreview = () => {
    const content = editorRef.current?.innerHTML || newPost.content || "";

    setNewPost((previous) => ({
      ...previous,
      content,
    }));

    setShowPreview((previous) => !previous);
  };

  // ==========================================================
  // FILTER POSTS
  // ==========================================================

  const filteredPosts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return posts
      .filter(Boolean)
      .filter((post) => {
        if (isEditor) {
          return isOwnPost(post);
        }

        return true;
      })
      .filter((post) => {
        if (activeTab === "All") {
          return true;
        }

        return normalizeStatus(post.status) === activeTab;
      })
      .filter((post) => {
        if (!searchText) {
          return true;
        }

        const title = post.title?.toLowerCase() || "";

        const category = post.category?.toLowerCase() || "";

        const excerpt = post.excerpt?.toLowerCase() || "";

        return (
          title.includes(searchText) ||
          category.includes(searchText) ||
          excerpt.includes(searchText)
        );
      });
  }, [posts, search, activeTab, isEditor, currentUserId]);

  // ==========================================================
  // COUNTS
  // ==========================================================

  const visiblePosts = isEditor ? posts.filter(isOwnPost) : posts;

  const counts = {
    All: visiblePosts.length,

    Draft: visiblePosts.filter(
      (post) => normalizeStatus(post.status) === "Draft",
    ).length,

    "Pending Review": visiblePosts.filter(
      (post) => normalizeStatus(post.status) === "Pending Review",
    ).length,

    Published: visiblePosts.filter(
      (post) => normalizeStatus(post.status) === "Published",
    ).length,
  };

  // ==========================================================
  // STATUS UI
  // ==========================================================

  const renderStatus = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "Published") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
          <CheckCircle size={13} />
          Published
        </span>
      );
    }

    if (normalized === "Pending Review") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
          <Clock3 size={13} />
          In Review
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400">
        <FileText size={13} />
        Draft
      </span>
    );
  };

  // ==========================================================
  // VIEW POST
  // ==========================================================

  const viewPost = (post) => {
    if (!post) {
      return;
    }

    setEditingPost(post);

    setNewPost({
      title: post.title || "",
      category: post.category || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      image: post.image || "",
      status: normalizeStatus(post.status),
    });

    setShowPreview(true);

    setShowEditor(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = post.content || "";
      }
    }, 0);
  };

  // ==========================================================
  // DELETE FUNCTION
  // ==========================================================

  const handleDelete = async (id) => {
    if (!id) {
      console.error("❌ Delete failed: Blog ID is missing.");

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      console.log("=================================");

      console.log("DELETE BLOG");

      console.log("Blog ID:", id);

      console.log("=================================");

      const response = await deleteBlog(id);

      console.log("✅ DELETE RESPONSE:", response);

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));

      console.log("✅ Blog deleted successfully.");
    } catch (error) {
      console.error("=================================");

      console.error("❌ DELETE BLOG FAILED");

      console.error("Status:", error.response?.status);

      console.error("Backend response:", error.response?.data);

      console.error("Error message:", error.message);

      console.error("=================================");

      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to delete blog.",
      );
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className={`space-y-8 ${
        fullscreen
          ? "fixed inset-0 z-50 overflow-y-auto bg-[var(--ad-bg)] p-6"
          : ""
      }`}
    >
      {/* ======================================================
          LIST
      ====================================================== */}

      {!showEditor && (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[var(--ad-accent-soft)] flex items-center justify-center">
                  <BookOpen size={21} className="text-[var(--ad-accent-ink)]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[var(--ad-ink)]">
                    Manage Posts
                  </h2>

                  <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                    {isAdmin
                      ? "Manage, review and publish all blog posts."
                      : "Write, edit and submit your content for review."}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ad-accent)] text-white font-medium hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={18} />
              New Post
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />

                <span className="text-sm">{error}</span>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="flex items-center gap-2 p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
              <CheckCircle size={18} />

              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* TABS */}

          <div className="flex flex-wrap gap-2 border-b border-[var(--ad-rule)] pb-1">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-[var(--ad-accent-soft)] text-[var(--ad-accent-ink)]"
                      : "text-[var(--ad-ink-faint)] hover:text-[var(--ad-ink)] hover:bg-[var(--ad-surface-2)]"
                  }`}
                >
                  {tab.label}

                  <span
                    className={`min-w-6 h-6 px-1.5 rounded-full flex items-center justify-center text-xs ${
                      isActive
                        ? "bg-[var(--ad-accent)] text-white"
                        : "bg-[var(--ad-surface-2)] text-[var(--ad-ink-faint)]"
                    }`}
                  >
                    {counts[tab.key]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* POSTS */}

          <div className="bg-[var(--ad-surface)] border border-[var(--ad-rule)] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[var(--ad-rule)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--ad-ink)]">
                    {isAdmin
                      ? activeTab === "All"
                        ? "All Posts"
                        : activeTab
                      : activeTab === "All"
                        ? "My Posts"
                        : activeTab}
                  </h3>

                  <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "post" : "posts"}
                  </p>
                </div>

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ad-ink-faint)]"
                  />

                  <input
                    type="text"
                    placeholder={
                      isAdmin ? "Search posts..." : "Search your posts..."
                    }
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-72 pl-9 pr-4 py-2.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface-2)] text-[var(--ad-ink)] placeholder:text-[var(--ad-ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ad-accent-soft)] focus:border-[var(--ad-accent)]"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-9 h-9 border-4 border-[var(--ad-rule)] border-t-[var(--ad-accent)] rounded-full animate-spin" />
                </div>

                <p className="text-sm text-[var(--ad-ink-faint)]">
                  Loading posts...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--ad-surface-2)] border-b border-[var(--ad-rule)]">
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

                  <tbody>
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => {
                        const status = normalizeStatus(post.status);

                        return (
                          <tr
                            key={post._id}
                            className="border-b border-[var(--ad-rule)] hover:bg-[var(--ad-surface-2)] transition"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[var(--ad-accent-soft)] flex items-center justify-center shrink-0">
                                  <FileText
                                    size={18}
                                    className="text-[var(--ad-accent-ink)]"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="font-medium text-[var(--ad-ink)] truncate max-w-xs">
                                    {post.title || "Untitled Post"}
                                  </p>

                                  <p className="text-xs text-[var(--ad-ink-faint)] mt-1">
                                    /{post.slug || "no-slug"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-[var(--ad-accent-soft)] text-[var(--ad-accent-ink)]">
                                {post.category || "Uncategorized"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <User
                                  size={14}
                                  className="text-[var(--ad-ink-faint)]"
                                />

                                <span className="text-sm text-[var(--ad-ink-soft)]">
                                  {post.author?.username ||
                                    post.author?.name ||
                                    post.author?.email ||
                                    "Unknown"}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              {renderStatus(status)}
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <CalendarDays
                                  size={14}
                                  className="text-[var(--ad-ink-faint)]"
                                />

                                <span className="text-sm text-[var(--ad-ink-faint)]">
                                  {formatDate(post.updatedAt || post.createdAt)}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => viewPost(post)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] hover:bg-[var(--ad-surface-2)] cursor-pointer"
                                >
                                  <Eye size={15} />
                                  View
                                </button>

                                {/* ADMIN */}

                                {isAdmin && (
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openEditForm(post)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ad-accent-soft)] text-[var(--ad-accent-ink)] hover:opacity-80 cursor-pointer"
                                    >
                                      <Edit3 size={15} />
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDelete(post._id)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                                    >
                                      <Trash2 size={15} />
                                      Delete
                                    </button>
                                  </div>
                                )}

                                {/* EDITOR */}

                                {isEditor &&
                                  status !== "Published" &&
                                  isOwnPost(post) && (
                                    <button
                                      type="button"
                                      onClick={() => openEditForm(post)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--ad-accent-soft)] text-[var(--ad-accent-ink)] hover:opacity-80 cursor-pointer"
                                    >
                                      <Edit3 size={15} />
                                      Edit
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-20 text-center">
                          <FileText
                            size={42}
                            className="mx-auto text-[var(--ad-ink-faint)] opacity-40 mb-4"
                          />

                          <p className="font-medium text-[var(--ad-ink)]">
                            No posts found
                          </p>

                          <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                            {search
                              ? "Try another search term."
                              : "Create a new post to get started."}
                          </p>

                          {!search && activeTab === "All" && (
                            <button
                              type="button"
                              onClick={openCreateForm}
                              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg bg-[var(--ad-accent)] text-white text-sm font-medium cursor-pointer"
                            >
                              <Plus size={16} />
                              Create Post
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ======================================================
          EDITOR
      ====================================================== */}

      {showEditor && (
        <div className="space-y-6">
          {/* HEADER */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeEditor}
                className="p-2.5 rounded-lg border border-[var(--ad-rule)] text-[var(--ad-ink-soft)] hover:bg-[var(--ad-surface-2)] cursor-pointer"
              >
                <ArrowLeft size={19} />
              </button>

              <div>
                <h2 className="text-2xl font-bold text-[var(--ad-ink)]">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </h2>

                <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                  {isAdmin
                    ? "Manage and publish this article."
                    : "Write your article and submit it for review."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFullscreen((previous) => !previous)}
                className="p-2.5 rounded-lg border border-[var(--ad-rule)] text-[var(--ad-ink-soft)] hover:bg-[var(--ad-surface-2)] cursor-pointer"
                title="Toggle fullscreen"
              >
                {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>

              <button
                type="button"
                onClick={togglePreview}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] hover:bg-[var(--ad-surface-2)] cursor-pointer"
              >
                <Eye size={17} />

                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} />

                <span className="text-sm">{error}</span>
              </div>

              <button
                type="button"
                onClick={() => setError("")}
                className="cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="flex items-center gap-2 p-4 rounded-xl border border-green-200 bg-green-50 text-green-700 dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
              <CheckCircle size={18} />

              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* FORM */}

          <form onSubmit={(e) => handleSubmit(e, newPost.status)}>
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
              {/* MAIN */}

              <div className="space-y-6">
                {/* TITLE */}

                <div className="bg-[var(--ad-surface)] border border-[var(--ad-rule)] rounded-2xl p-6">
                  <label className="block text-sm font-medium text-[var(--ad-ink-soft)] mb-2">
                    Post Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={newPost.title}
                    onChange={handleChange}
                    placeholder="Enter a compelling title..."
                    maxLength={200}
                    disabled={showPreview}
                    className="w-full px-0 py-2 border-0 border-b border-[var(--ad-rule)] bg-transparent text-3xl font-bold text-[var(--ad-ink)] placeholder:text-[var(--ad-ink-faint)] focus:outline-none focus:border-[var(--ad-accent)]"
                  />

                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-[var(--ad-ink-faint)]">
                      Keep your title clear and descriptive.
                    </span>

                    <span className="text-xs text-[var(--ad-ink-faint)]">
                      {newPost.title.length}
                      /200
                    </span>
                  </div>
                </div>

                {/* EXCERPT */}

                <div className="bg-[var(--ad-surface)] border border-[var(--ad-rule)] rounded-2xl p-6">
                  <label className="block text-sm font-medium text-[var(--ad-ink-soft)] mb-2">
                    Excerpt
                  </label>

                  <textarea
                    name="excerpt"
                    value={newPost.excerpt}
                    onChange={handleChange}
                    placeholder="Write a short description..."
                    maxLength={500}
                    rows={3}
                    disabled={showPreview}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--ad-rule)] bg-[var(--ad-surface-2)] text-[var(--ad-ink)] placeholder:text-[var(--ad-ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ad-accent-soft)] resize-none"
                  />
                </div>

                {/* EDITOR */}

                <div className="bg-[var(--ad-surface)] border border-[var(--ad-rule)] rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-[var(--ad-rule)]">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-medium text-[var(--ad-ink-soft)]">
                        Content *
                      </label>

                      <div className="flex items-center gap-3">
                        {/* SAVING */}

                        {autoSaving && autoSaveStatus === "saving" && (
                          <span className="flex items-center gap-1.5 text-xs text-[var(--ad-ink-faint)]">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            Saving...
                          </span>
                        )}

                        {/* SAVED */}

                        {!autoSaving && autoSaveStatus === "saved" && (
                          <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                            <CheckCircle size={13} />
                            Saved
                            {lastAutoSavedAt && (
                              <span className="text-[var(--ad-ink-faint)]">
                                {lastAutoSavedAt.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            )}
                          </span>
                        )}

                        {/* UNSAVED */}

                        {autoSaveStatus === "unsaved" && (
                          <span className="flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            Unsaved changes
                          </span>
                        )}

                        {/* ERROR */}

                        {autoSaveStatus === "error" && (
                          <span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle size={13} />
                            Autosave failed
                          </span>
                        )}

                        <span className="text-xs text-[var(--ad-ink-faint)]">
                          Rich text editor
                        </span>
                      </div>
                    </div>
                  </div>

                  {!showPreview ? (
                    <>
                      {/* TOOLBAR */}

                      <div className="p-3 border-b border-[var(--ad-rule)] bg-[var(--ad-surface-2)] flex flex-wrap items-center gap-1">
                        <button
                          type="button"
                          onClick={() => executeCommand("bold")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Bold"
                        >
                          <Bold size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => executeCommand("italic")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Italic"
                        >
                          <Italic size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => executeCommand("underline")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Underline"
                        >
                          <Underline size={17} />
                        </button>

                        <div className="w-px h-6 bg-[var(--ad-rule)] mx-1" />

                        <button
                          type="button"
                          onClick={() => formatBlock("h1")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Heading 1"
                        >
                          <Heading1 size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => formatBlock("h2")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Heading 2"
                        >
                          <Heading2 size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => formatBlock("h3")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Heading 3"
                        >
                          <Heading3 size={18} />
                        </button>

                        <div className="w-px h-6 bg-[var(--ad-rule)] mx-1" />

                        <button
                          type="button"
                          onClick={() => executeCommand("insertUnorderedList")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Bullet list"
                        >
                          <List size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => executeCommand("insertOrderedList")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Numbered list"
                        >
                          <ListOrdered size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => formatBlock("blockquote")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Quote"
                        >
                          <Quote size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={insertCodeBlock}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Code block"
                        >
                          <Code2 size={18} />
                        </button>

                        <div className="w-px h-6 bg-[var(--ad-rule)] mx-1" />

                        <button
                          type="button"
                          onClick={() =>
                            setShowLinkInput((previous) => !previous)
                          }
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Insert link"
                        >
                          <LinkIcon size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={removeLink}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Remove link"
                        >
                          <Unlink size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={insertImage}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Insert image"
                        >
                          <FileText size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => executeCommand("removeFormat")}
                          className="p-2 rounded-lg hover:bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] cursor-pointer"
                          title="Clear formatting"
                        >
                          <Eraser size={18} />
                        </button>
                      </div>

                      {/* LINK */}

                      {showLinkInput && (
                        <div className="p-3 border-b border-[var(--ad-rule)] bg-[var(--ad-surface-2)] flex gap-2">
                          <input
                            type="text"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();

                                handleInsertLink();
                              }
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface)] text-[var(--ad-ink)] focus:outline-none"
                          />

                          <button
                            type="button"
                            onClick={handleInsertLink}
                            className="px-4 rounded-lg bg-[var(--ad-accent)] text-white text-sm font-medium cursor-pointer"
                          >
                            Insert
                          </button>
                        </div>
                      )}

                      {/* CONTENT */}

                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleContentChange}
                        data-placeholder="Start writing your article..."
                        className="editor-content min-h-[500px] px-6 py-6 outline-none text-[var(--ad-ink)] leading-8"
                      />

                      {/* FOOTER */}

                      <div className="px-5 py-3 border-t border-[var(--ad-rule)] bg-[var(--ad-surface-2)] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-xs text-[var(--ad-ink-faint)]">
                            <FileText size={14} />
                            {countWords(newPost.content)} words
                          </span>

                          <span className="flex items-center gap-1.5 text-xs text-[var(--ad-ink-faint)]">
                            <Clock3 size={14} />
                            {calculateReadingTime(newPost.content)} min read
                          </span>
                        </div>

                        <span className="text-xs text-[var(--ad-ink-faint)]">
                          Autosave enabled
                        </span>
                      </div>
                    </>
                  ) : (
                    <article className="p-8 md:p-12">
                      {newPost.image && (
                        <img
                          src={newPost.image}
                          alt={newPost.title}
                          className="w-full max-h-[420px] object-cover rounded-2xl mb-8"
                        />
                      )}

                      <div className="mb-8">
                        <span className="inline-flex px-3 py-1 rounded-full bg-[var(--ad-accent-soft)] text-[var(--ad-accent-ink)] text-xs font-medium mb-4">
                          {newPost.category || "Uncategorized"}
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[var(--ad-ink)]">
                          {newPost.title || "Untitled Post"}
                        </h1>

                        {newPost.excerpt && (
                          <p className="mt-5 text-lg leading-8 text-[var(--ad-ink-faint)]">
                            {newPost.excerpt}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-[var(--ad-ink-faint)]">
                          <span className="flex items-center gap-2">
                            <User size={15} />

                            {user?.username || user?.name || "You"}
                          </span>

                          <span className="flex items-center gap-2">
                            <Clock3 size={15} />
                            {calculateReadingTime(newPost.content)} min read
                          </span>
                        </div>
                      </div>

                      <div
                        className="editor-preview text-[var(--ad-ink)]"
                        dangerouslySetInnerHTML={{
                          __html:
                            newPost.content ||
                            "<p>Your content preview will appear here.</p>",
                        }}
                      />
                    </article>
                  )}
                </div>
              </div>

              {/* =================================================
                  SIDEBAR
              ================================================== */}

              <div className="space-y-6">
                {/* PUBLISHING */}

                <div className="bg-[var(--ad-surface)] border border-[var(--ad-rule)] rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <Send size={18} className="text-[var(--ad-accent-ink)]" />

                    <h3 className="font-bold text-[var(--ad-ink)]">
                      Publishing
                    </h3>
                  </div>

                  {isAdmin ? (
                    <div>
                      <label className="block text-xs font-medium text-[var(--ad-ink-faint)] mb-2">
                        Post status
                      </label>

                      <select
                        value={normalizeStatus(newPost.status)}
                        onChange={(e) =>
                          setNewPost((previous) => ({
                            ...previous,
                            status: normalizeStatus(e.target.value),
                          }))
                        }
                        disabled={showPreview}
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface-2)] text-[var(--ad-ink)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ad-accent-soft)]"
                      >
                        <option value="Draft">Draft</option>

                        <option value="Pending Review">Pending Review</option>

                        <option value="Published">Published</option>
                      </select>

                      <p className="text-xs leading-5 text-[var(--ad-ink-faint)] mt-3">
                        As an administrator, you can publish posts directly or
                        send them back to draft/review.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-[var(--ad-ink-faint)] mb-2">
                        Current status
                      </label>

                      <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[var(--ad-surface-2)]">
                        <span className="text-sm text-[var(--ad-ink)]">
                          {normalizeStatus(newPost.status)}
                        </span>

                        {renderStatus(newPost.status)}
                      </div>

                      <p className="text-xs leading-5 text-[var(--ad-ink-faint)] mt-3">
                        Editors can save drafts and submit posts for
                        administrator review. Publishing is handled by an
                        administrator.
                      </p>
                    </div>
                  )}
                </div>

                {/* DETAILS */}

                <div className="bg-[var(--ad-surface)] border border-[var(--ad-rule)] rounded-2xl p-5">
                  <h3 className="font-bold text-[var(--ad-ink)] mb-4">
                    Post Details
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--ad-ink-faint)] mb-2">
                        Category *
                      </label>

                      <input
                        type="text"
                        name="category"
                        value={newPost.category}
                        onChange={handleChange}
                        placeholder="e.g. React, MongoDB"
                        disabled={showPreview}
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface-2)] text-sm text-[var(--ad-ink)] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--ad-ink-faint)] mb-2">
                        Featured Image URL
                      </label>

                      <input
                        type="url"
                        name="image"
                        value={newPost.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        disabled={showPreview}
                        className="w-full px-3 py-2.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface-2)] text-sm text-[var(--ad-ink)] focus:outline-none"
                      />
                    </div>

                    {newPost.image && (
                      <img
                        src={newPost.image}
                        alt="Featured preview"
                        className="w-full h-40 object-cover rounded-xl border border-[var(--ad-rule)]"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* AUTHOR */}

                <div className="bg-[var(--ad-surface)] border border-[var(--ad-rule)] rounded-2xl p-5">
                  <h3 className="font-bold text-[var(--ad-ink)] mb-4">
                    Author
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--ad-accent-soft)] flex items-center justify-center">
                      <User size={18} className="text-[var(--ad-accent-ink)]" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[var(--ad-ink)]">
                        {user?.username || user?.name || "User"}
                      </p>

                      <p className="text-xs text-[var(--ad-ink-faint)]">
                        {isAdmin ? "Administrator" : "Editor"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}

                {!showPreview && (
                  <div className="bg-[var(--ad-surface)] border border-[var(--ad-rule)] rounded-2xl p-5">
                    <h3 className="font-bold text-[var(--ad-ink)] mb-4">
                      Actions
                    </h3>

                    <div className="space-y-3">
                      {/* ADMIN */}

                      {isAdmin ? (
                        <>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={(e) => handleSubmit(e, "Draft")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] font-medium hover:bg-[var(--ad-surface-2)] disabled:opacity-50 cursor-pointer"
                          >
                            <Save size={17} />

                            {saving ? "Saving..." : "Save Draft"}
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={(e) => handleSubmit(e, "Pending Review")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] font-medium hover:bg-[var(--ad-surface-2)] disabled:opacity-50 cursor-pointer"
                          >
                            <Clock3 size={17} />
                            Send to Review
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={(e) => handleSubmit(e, "Published")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle size={17} />

                            {saving ? "Publishing..." : "Publish Post"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={(e) => handleSubmit(e, "Draft")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--ad-rule)] bg-[var(--ad-surface)] text-[var(--ad-ink-soft)] font-medium hover:bg-[var(--ad-surface-2)] disabled:opacity-50 cursor-pointer"
                          >
                            <Save size={17} />

                            {saving ? "Saving..." : "Save Draft"}
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={(e) => handleSubmit(e, "Pending Review")}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--ad-accent)] text-white font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
                          >
                            <Send size={17} />

                            {saving ? "Submitting..." : "Submit for Review"}
                          </button>
                        </>
                      )}

                      {/* CANCEL */}

                      <button
                        type="button"
                        disabled={saving}
                        onClick={closeEditor}
                        className="w-full px-4 py-2.5 rounded-lg text-[var(--ad-ink-faint)] hover:bg-[var(--ad-surface-2)] text-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================
          EDITOR STYLES
      ====================================================== */}

      <style>{`
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: var(--ad-ink-faint);
          pointer-events: none;
        }

        .editor-content h1,
        .editor-preview h1 {
          font-size: 2rem;
          line-height: 1.2;
          font-weight: 700;
          margin: 1.5rem 0 0.75rem;
        }

        .editor-content h2,
        .editor-preview h2 {
          font-size: 1.6rem;
          line-height: 1.3;
          font-weight: 700;
          margin: 1.4rem 0 0.7rem;
        }

        .editor-content h3,
        .editor-preview h3 {
          font-size: 1.3rem;
          line-height: 1.4;
          font-weight: 700;
          margin: 1.2rem 0 0.6rem;
        }

        .editor-content p,
        .editor-preview p {
          margin: 0.8rem 0;
        }

        .editor-content ul,
        .editor-preview ul {
          list-style: disc;
          padding-left: 1.75rem;
          margin: 1rem 0;
        }

        .editor-content ol,
        .editor-preview ol {
          list-style: decimal;
          padding-left: 1.75rem;
          margin: 1rem 0;
        }

        .editor-content li,
        .editor-preview li {
          margin: 0.35rem 0;
        }

        .editor-content blockquote,
        .editor-preview blockquote {
          border-left: 4px solid var(--ad-accent);
          padding-left: 1rem;
          margin: 1.25rem 0;
          color: var(--ad-ink-faint);
          font-style: italic;
        }

        .editor-content pre,
        .editor-preview pre {
          background: var(--ad-surface-2);
          border: 1px solid var(--ad-rule);
          border-radius: 0.75rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.25rem 0;
          font-family: ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .editor-content code,
        .editor-preview code {
          font-family: ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
        }

        .editor-content a,
        .editor-preview a {
          color: var(--ad-accent);
          text-decoration: underline;
        }

        .editor-content img,
        .editor-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.25rem 0;
        }

        .editor-content:focus {
          min-height: 500px;
        }

        .editor-preview {
          font-size: 1.05rem;
          line-height: 1.9;
        }
      `}</style>
    </div>
  );
};

export default Posts;
