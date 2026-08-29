import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  Loader2,
  Eye,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// ============================================================
// HELPERS
// ============================================================

const getToken = () => {
  return localStorage.getItem("token");
};

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

const getAuthorName = (post) => {
  if (typeof post?.author === "string") {
    return post.author;
  }

  return (
    post?.author?.name ||
    post?.author?.username ||
    post?.createdBy?.name ||
    post?.user?.name ||
    "Admin"
  );
};

const normalizeStatus = (status) => {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value === "published" || value === "publish" || value === "live") {
    return "published";
  }

  if (value === "draft") {
    return "draft";
  }

  if (
    value === "pending review" ||
    value === "pending-review" ||
    value === "pending" ||
    value === "in review" ||
    value === "in-review" ||
    value === "review"
  ) {
    return "pending review";
  }

  if (value === "approved") {
    return "approved";
  }

  if (value === "rejected") {
    return "rejected";
  }

  return value;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getTimeAgo = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  const now = new Date();

  const difference = now.getTime() - parsedDate.getTime();

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }

  return formatDate(date);
};

// ============================================================
// OVERVIEW
// ============================================================

const Overview = () => {
  const navigate = useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ==========================================================
  // FETCH HELPERS
  // ==========================================================

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/blogs`);

      const data = await response.json();

      console.log("BLOGS API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message || "Failed to load published blogs.",
        );
      }

      const blogs = Array.isArray(data?.blogs)
        ? data.blogs
        : Array.isArray(data)
          ? data
          : [];

      return blogs;
    } catch (error) {
      console.error("BLOGS ERROR:", error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Failed to fetch users.");
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.users)) {
      return data.users;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  };

  const fetchComments = async () => {
    const response = await fetch(`${API_URL}/comments`, {
      headers: getHeaders(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || "Failed to fetch comments.",
      );
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.comments)) {
      return data.comments;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  };

  // ==========================================================
  // FETCH DASHBOARD DATA
  // ==========================================================

  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [blogsResult, usersResult, commentsResult] =
        await Promise.allSettled([fetchBlogs(), fetchUsers(), fetchComments()]);

      // ------------------------------------------------------
      // BLOGS
      // ------------------------------------------------------

      if (blogsResult.status === "fulfilled") {
        setPosts(blogsResult.value);
      } else {
        console.error("BLOGS ERROR:", blogsResult.reason);

        setPosts([]);
      }

      // ------------------------------------------------------
      // USERS
      // ------------------------------------------------------

      if (usersResult.status === "fulfilled") {
        setUsers(usersResult.value);
      } else {
        console.error("USERS ERROR:", usersResult.reason);

        setUsers([]);
      }

      // ------------------------------------------------------
      // COMMENTS
      // ------------------------------------------------------

      if (commentsResult.status === "fulfilled") {
        setComments(commentsResult.value);
      } else {
        console.error("COMMENTS ERROR:", commentsResult.reason);

        setComments([]);
      }

      // ------------------------------------------------------
      // ERROR MESSAGE
      // ------------------------------------------------------

      const failedRequests = [blogsResult, usersResult, commentsResult].filter(
        (result) => result.status === "rejected",
      );

      if (failedRequests.length === 3) {
        throw new Error(
          "Unable to load dashboard data. Please check your authentication and backend server.",
        );
      }

      if (failedRequests.length > 0) {
        setError(
          "Some dashboard data could not be loaded. Please try refreshing.",
        );
      }
    } catch (err) {
      console.error("DASHBOARD FETCH ERROR:", err);

      setError(err?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================================
  // CALCULATE STATISTICS
  // ==========================================================

  const statistics = useMemo(() => {
    const totalPosts = posts.length;

    const publishedPosts = posts.filter(
      (post) => normalizeStatus(post.status) === "published",
    ).length;

    const draftPosts = posts.filter(
      (post) => normalizeStatus(post.status) === "draft",
    ).length;

    const pendingPosts = posts.filter(
      (post) => normalizeStatus(post.status) === "pending review",
    ).length;

    const approvedComments = comments.filter(
      (comment) => normalizeStatus(comment.status) === "approved",
    ).length;

    const pendingComments = comments.filter(
      (comment) => normalizeStatus(comment.status) === "pending",
    ).length;

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      pendingPosts,
      totalUsers: users.length,
      totalComments: comments.length,
      approvedComments,
      pendingComments,
    };
  }, [posts, users, comments]);

  // ==========================================================
  // RECENT POSTS
  // ==========================================================

  const recentPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => {
        const dateA = new Date(a?.createdAt || a?.publishedAt || 0).getTime();

        const dateB = new Date(b?.createdAt || b?.publishedAt || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [posts]);

  // ==========================================================
  // RECENT USERS
  // ==========================================================

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const dateA = new Date(a?.createdAt || 0).getTime();

        const dateB = new Date(b?.createdAt || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [users]);

  // ==========================================================
  // RECENT COMMENTS
  // ==========================================================

  const recentComments = useMemo(() => {
    return [...comments]
      .sort((a, b) => {
        const dateA = new Date(a?.createdAt || 0).getTime();

        const dateB = new Date(b?.createdAt || 0).getTime();

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [comments]);

  // ==========================================================
  // PERFORMANCE DATA
  // ==========================================================

  const performanceData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();

      date.setMonth(date.getMonth() - (5 - index));

      return {
        label: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        month: date.getMonth(),
        year: date.getFullYear(),
        count: 0,
      };
    });

    posts.forEach((post) => {
      const date = new Date(post?.createdAt || post?.publishedAt || 0);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const monthData = months.find(
        (item) =>
          item.month === date.getMonth() && item.year === date.getFullYear(),
      );

      if (monthData) {
        monthData.count += 1;
      }
    });

    const maxCount = Math.max(...months.map((item) => item.count), 1);

    return months.map((item) => ({
      ...item,
      height:
        item.count === 0 ? 8 : Math.max(20, (item.count / maxCount) * 100),
    }));
  }, [posts]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-600" />

          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-8">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>

          <p className="mt-1 text-gray-500">
            Here's what's happening with your blog today.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/posts")}
            className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800"
          >
            <Plus size={18} />
            New Post
          </button>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-600">
            <Calendar size={18} />

            <span className="text-sm">Today</span>
          </div>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            onClick={() => fetchDashboardData(true)}
            className="ml-auto font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* ======================================================
          STATS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Posts */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <FileText className="text-blue-600" size={24} />
            </div>

            <span className="text-xs font-medium text-gray-400">All posts</span>
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500">Total Posts</p>

            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {statistics.totalPosts}
            </h3>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            All posts available to you
          </p>
        </div>

        {/* Published */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle className="text-green-600" size={24} />
            </div>

            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp size={14} />
              Live
            </span>
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500">Published Posts</p>

            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {statistics.publishedPosts}
            </h3>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Currently visible publicly
          </p>
        </div>

        {/* Pending */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
              <Clock className="text-yellow-600" size={24} />
            </div>

            <span className="text-xs font-medium text-yellow-600">Review</span>
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500">Pending Review</p>

            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {statistics.pendingPosts}
            </h3>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            Posts waiting for approval
          </p>
        </div>

        {/* Comments */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <MessageSquare className="text-purple-600" size={24} />
            </div>

            <span className="text-xs font-medium text-purple-600">
              {statistics.pendingComments} pending
            </span>
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500">Total Comments</p>

            <h3 className="mt-1 text-3xl font-bold text-gray-900">
              {statistics.totalComments}
            </h3>
          </div>

          <p className="mt-3 text-xs text-gray-400">
            {statistics.approvedComments} approved
          </p>
        </div>
      </div>

      {/* ======================================================
          BLOG PERFORMANCE + ACTIVITY
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Blog Performance */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Blog Performance
              </h3>

              <p className="text-sm text-gray-500">
                Posts created over the last 6 months
              </p>
            </div>

            <div className="flex items-center gap-2 text-blue-600">
              <BarChart3 size={20} />

              <span className="text-sm font-medium">Posts</span>
            </div>
          </div>

          <div className="flex h-64 items-end justify-between gap-3 px-2">
            {performanceData.map((item) => (
              <div
                key={`${item.year}-${item.month}`}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs font-medium text-gray-500">
                  {item.count}
                </span>

                <div
                  className="w-full max-w-[42px] rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                  style={{
                    height: `${item.height}%`,
                  }}
                />

                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-100 pt-5">
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {statistics.totalPosts}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Published</p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {statistics.publishedPosts}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Drafts</p>

              <p className="mt-1 text-xl font-bold text-gray-900">
                {statistics.draftPosts}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h3>

              <p className="text-sm text-gray-500">Latest platform updates</p>
            </div>

            <Clock size={20} className="text-gray-400" />
          </div>

          <div className="space-y-5">
            {/* Latest Post */}

            {recentPosts[0] && (
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <FileText size={17} className="text-blue-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    New post activity
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {recentPosts[0].title}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {getTimeAgo(
                      recentPosts[0].createdAt || recentPosts[0].publishedAt,
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Latest User */}

            {recentUsers[0] && (
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <Users size={17} className="text-green-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    New user registered
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {recentUsers[0].name ||
                      recentUsers[0].username ||
                      recentUsers[0].email}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {getTimeAgo(recentUsers[0].createdAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Latest Comment */}

            {recentComments[0] && (
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                  <MessageSquare size={17} className="text-purple-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    New comment received
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {recentComments[0].content || "New comment"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {getTimeAgo(recentComments[0].createdAt)}
                  </p>
                </div>
              </div>
            )}

            {!recentPosts.length &&
              !recentUsers.length &&
              !recentComments.length && (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-400">No recent activity.</p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* ======================================================
          RECENT POSTS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>

            <p className="text-sm text-gray-500">Your latest blog posts</p>
          </div>

          <button
            onClick={() => navigate("/admin/posts")}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-500">
                <th className="px-6 py-4">Post</th>

                <th className="px-6 py-4">Author</th>

                <th className="px-6 py-4">Status</th>

                <th className="px-6 py-4">Likes</th>

                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {recentPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    No posts found.
                  </td>
                </tr>
              ) : (
                recentPosts.map((post) => {
                  const status = normalizeStatus(post.status);

                  const isPublished = status === "published";

                  const isPending =
                    status === "pending review" ||
                    status === "pending-review" ||
                    status === "pending";

                  const likesCount =
                    post?.likesCount ??
                    post?.likeCount ??
                    (Array.isArray(post?.likes) ? post.likes.length : 0);

                  return (
                    <tr
                      key={post._id || post.id}
                      className="border-b border-gray-50 transition hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            <FileText size={18} className="text-gray-500" />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[300px] truncate font-medium text-gray-900">
                              {post.title || "Untitled Post"}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {post.category || "Technology"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getAuthorName(post)}
                      </td>

                      <td className="px-6 py-4">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            <CheckCircle size={13} />
                            Published
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            <Clock size={13} />
                            Pending Review
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            <Edit size={13} />
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <TrendingUp size={14} />

                          {likesCount}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(post.createdAt || post.publishedAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================
          USERS + COMMENTS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* New Users */}

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">New Users</h3>

              <p className="text-sm text-gray-500">Recently registered users</p>
            </div>

            <Users size={20} className="text-gray-400" />
          </div>

          <div className="space-y-5 p-6">
            {recentUsers.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">No users found.</p>
              </div>
            ) : (
              recentUsers.map((user) => {
                const initials = (user?.name || user?.username || "U")
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={user._id || user.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {user.name || user.username || "Unknown User"}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs text-gray-400">
                      {getTimeAgo(user.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Comments */}

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Comments
              </h3>

              <p className="text-sm text-gray-500">
                Latest comments from users
              </p>
            </div>

            <MessageSquare size={20} className="text-gray-400" />
          </div>

          <div className="space-y-5 p-6">
            {recentComments.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">No comments found.</p>
              </div>
            ) : (
              recentComments.map((comment) => {
                const status = normalizeStatus(comment.status);

                const approved = status === "approved";

                const userName =
                  comment?.user?.name || comment?.user?.username || "Anonymous";

                const postTitle = comment?.blog?.title || "Unknown Post";

                return (
                  <div
                    key={comment._id || comment.id}
                    className="border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {userName}
                      </span>

                      {approved ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-green-600">
                          <CheckCircle size={13} />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-yellow-600">
                          <AlertCircle size={13} />
                          {comment.status || "Pending"}
                        </span>
                      )}
                    </div>

                    <p className="line-clamp-2 text-sm text-gray-600">
                      {comment.content || comment.text || "No comment content"}
                    </p>

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="truncate text-xs text-gray-400">
                        On: {postTitle}
                      </p>

                      <p className="shrink-0 text-xs text-gray-400">
                        {getTimeAgo(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
          QUICK ACTIONS
      ======================================================= */}

      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Create Post */}

          <button
            onClick={() => navigate("/admin/posts")}
            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
              <Plus className="text-blue-600" size={20} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Create Post</p>

              <p className="mt-1 text-xs text-gray-500">Write a new article</p>
            </div>
          </button>

          {/* Manage Users */}

          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100">
              <Users className="text-green-600" size={20} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Manage Users</p>

              <p className="mt-1 text-xs text-gray-500">View all users</p>
            </div>
          </button>

          {/* Comments */}

          <button
            onClick={() => navigate("/admin/comments")}
            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100">
              <MessageSquare className="text-purple-600" size={20} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Comments</p>

              <p className="mt-1 text-xs text-gray-500">Moderate comments</p>
            </div>
          </button>

          {/* Posts */}

          <button
            onClick={() => navigate("/admin/posts")}
            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100">
              <Eye className="text-orange-600" size={20} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Manage Posts</p>

              <p className="mt-1 text-xs text-gray-500">
                View and manage posts
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
