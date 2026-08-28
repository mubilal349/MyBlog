import React, { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  Search,
  Trash2,
  User,
  Calendar,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

const Comments = () => {
  const [comments, setComments] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD COMMENTS
  // ==========================================

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/comments");

      console.log("COMMENTS RESPONSE:", response.data);

      const commentList = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.comments)
          ? response.data.comments
          : [];

      setComments(commentList);
    } catch (error) {
      console.error("FETCH COMMENTS ERROR:", error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to load comments.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchComments();
  }, []);

  // ==========================================
  // APPROVE COMMENT
  // ==========================================

  const approveComment = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await api.patch(`/comments/${id}/approve`);

      // Update immediately in UI
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === id
            ? {
                ...comment,
                status: "approved",
              }
            : comment,
        ),
      );
    } catch (error) {
      console.error("APPROVE COMMENT ERROR:", error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to approve comment.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // REJECT COMMENT
  // ==========================================

  const rejectComment = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await api.patch(`/comments/${id}/reject`);

      // Update immediately in UI
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === id
            ? {
                ...comment,
                status: "rejected",
              }
            : comment,
        ),
      );
    } catch (error) {
      console.error("REJECT COMMENT ERROR:", error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to reject comment.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // DELETE COMMENT
  // ==========================================

  const deleteComment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this comment?",
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(id);
      setError("");

      await api.delete(`/comments/${id}`);

      // Remove from UI
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== id),
      );
    } catch (error) {
      console.error("DELETE COMMENT ERROR:", error);

      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete comment.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredComments = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return comments;
    }

    return comments.filter((comment) => {
      const text = String(comment.content || "").toLowerCase();

      const author = String(
        comment.user?.username ||
          comment.user?.name ||
          comment.user?.email ||
          "",
      ).toLowerCase();

      const post = String(
        comment.blog?.title || comment.blog?.slug || "",
      ).toLowerCase();

      const status = String(comment.status || "").toLowerCase();

      return (
        text.includes(query) ||
        author.includes(query) ||
        post.includes(query) ||
        status.includes(query)
      );
    });
  }, [comments, search]);

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const StatusBadge = ({ status }) => {
    const normalizedStatus = String(status || "pending").toLowerCase();

    if (normalizedStatus === "approved") {
      return (
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
            dark:bg-green-950/40
            dark:text-green-400
          "
        >
          <Check size={13} />
          Approved
        </span>
      );
    }

    if (normalizedStatus === "rejected") {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1.5
            px-3 py-1
            rounded-full
            text-xs
            font-medium
            bg-red-100
            text-red-700
            dark:bg-red-950/40
            dark:text-red-400
          "
        >
          <X size={13} />
          Rejected
        </span>
      );
    }

    return (
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
          dark:bg-yellow-950/40
          dark:text-yellow-400
        "
      >
        <RefreshCw size={13} />
        Pending
      </span>
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ad-ink)]">
            Manage Comments
          </h2>

          <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
            Review and manage comments posted on your blog.
          </p>
        </div>

        <div
          className="
            bg-[var(--ad-surface)]
            border border-[var(--ad-rule)]
            rounded-2xl
            shadow-sm
            p-12
            text-center
          "
        >
          <RefreshCw
            size={35}
            className="
              mx-auto
              mb-4
              text-[var(--ad-accent-ink)]
              animate-spin
            "
          />

          <p className="text-sm text-[var(--ad-ink-faint)]">
            Loading comments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ==========================================
          HEADER
          ========================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ad-ink)]">
            Manage Comments
          </h2>

          <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
            Review and manage comments posted on your blog.
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-2
            px-4 py-2
            rounded-lg
            bg-[var(--ad-accent-soft)]
            text-[var(--ad-accent-ink)]
          "
        >
          <MessageSquare size={17} />

          <span className="text-sm font-medium">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </div>
      </div>

      {/* ==========================================
          ERROR
          ========================================== */}

      {error && (
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            px-4 py-3
            rounded-lg
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
            onClick={fetchComments}
            className="
              flex
              items-center
              gap-2
              text-sm
              font-medium
              hover:underline
              cursor-pointer
            "
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* ==========================================
          COMMENTS CONTAINER
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
        {/* ==========================================
            TABLE HEADER
            ========================================== */}

        <div
          className="
            p-6
            border-b border-[var(--ad-rule)]
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
            "
          >
            <div>
              <h3 className="text-lg font-bold text-[var(--ad-ink)]">
                All Comments
              </h3>

              <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                Approve, reject or delete comments from your readers.
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
                placeholder="Search comments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  md:w-64
                  pl-9 pr-4
                  py-2.5
                  rounded-lg
                  border border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  text-[var(--ad-ink)]
                  placeholder:text-[var(--ad-ink-faint)]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--ad-accent-soft)]
                  focus:border-[var(--ad-accent)]
                  transition-colors duration-200
                "
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            TABLE
            ========================================== */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="
                  bg-[var(--ad-surface-2)]
                  border-b border-[var(--ad-rule)]
                "
              >
                <th
                  className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[var(--ad-ink-faint)]
                  "
                >
                  Comment
                </th>

                <th
                  className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[var(--ad-ink-faint)]
                  "
                >
                  Author
                </th>

                <th
                  className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[var(--ad-ink-faint)]
                  "
                >
                  Post
                </th>

                <th
                  className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[var(--ad-ink-faint)]
                  "
                >
                  Status
                </th>

                <th
                  className="
                    text-left
                    px-6 py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[var(--ad-ink-faint)]
                  "
                >
                  Date
                </th>

                <th
                  className="
                    text-right
                    px-6 py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-[var(--ad-ink-faint)]
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredComments.length > 0 ? (
                filteredComments.map((comment) => {
                  const author =
                    comment.user?.username ||
                    comment.user?.name ||
                    comment.user?.email ||
                    "Unknown User";

                  const post =
                    comment.blog?.title || comment.blog?.slug || "Unknown Post";

                  const date = comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  const isActionLoading = actionLoading === comment._id;

                  return (
                    <tr
                      key={comment._id}
                      className="
                        border-b border-[var(--ad-rule)]
                        hover:bg-[var(--ad-surface-2)]
                        transition-colors duration-200
                      "
                    >
                      {/* COMMENT */}

                      <td className="px-6 py-4 max-w-md">
                        <div className="flex items-start gap-3">
                          <div
                            className="
                              w-10 h-10
                              rounded-lg
                              bg-[var(--ad-accent-soft)]
                              flex
                              items-center
                              justify-center
                              flex-shrink-0
                            "
                          >
                            <MessageSquare
                              size={18}
                              className="text-[var(--ad-accent-ink)]"
                            />
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                font-medium
                                text-[var(--ad-ink)]
                                break-words
                              "
                            >
                              {comment.content}
                            </p>

                            <p
                              className="
                                text-xs
                                text-[var(--ad-ink-faint)]
                                mt-1
                              "
                            >
                              ID: {comment._id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* AUTHOR */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="
                              w-8 h-8
                              rounded-full
                              bg-[var(--ad-surface-2)]
                              border border-[var(--ad-rule)]
                              flex
                              items-center
                              justify-center
                            "
                          >
                            {comment.user?.avatar ? (
                              <img
                                src={comment.user.avatar}
                                alt={author}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <User
                                size={15}
                                className="text-[var(--ad-ink-faint)]"
                              />
                            )}
                          </div>

                          <span
                            className="
                              text-sm
                              text-[var(--ad-ink-soft)]
                              whitespace-nowrap
                            "
                          >
                            {author}
                          </span>
                        </div>
                      </td>

                      {/* POST */}

                      <td className="px-6 py-4">
                        <span
                          className="
                            inline-flex
                            items-center
                            px-3 py-1
                            rounded-full
                            text-xs
                            font-medium
                            bg-[var(--ad-accent-soft)]
                            text-[var(--ad-accent-ink)]
                            max-w-[220px]
                            truncate
                          "
                          title={post}
                        >
                          {post}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <StatusBadge status={comment.status} />
                      </td>

                      {/* DATE */}

                      <td className="px-6 py-4">
                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-[var(--ad-ink-faint)]
                            whitespace-nowrap
                          "
                        >
                          <Calendar size={14} />

                          {date}
                        </div>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* APPROVE */}

                          {comment.status !== "approved" && (
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => approveComment(comment._id)}
                              title="Approve comment"
                              className="
                                flex
                                items-center
                                gap-1.5
                                px-3 py-1.5
                                rounded-lg
                                bg-green-50
                                text-green-600
                                hover:bg-green-100
                                dark:bg-green-950/40
                                dark:text-green-400
                                dark:hover:bg-green-950/70
                                transition-colors
                                duration-200
                                cursor-pointer
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                              "
                            >
                              <Check size={15} />
                              Approve
                            </button>
                          )}

                          {/* REJECT */}

                          {comment.status !== "rejected" && (
                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => rejectComment(comment._id)}
                              title="Reject comment"
                              className="
                                flex
                                items-center
                                gap-1.5
                                px-3 py-1.5
                                rounded-lg
                                bg-yellow-50
                                text-yellow-600
                                hover:bg-yellow-100
                                dark:bg-yellow-950/40
                                dark:text-yellow-400
                                dark:hover:bg-yellow-950/70
                                transition-colors
                                duration-200
                                cursor-pointer
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                              "
                            >
                              <X size={15} />
                              Reject
                            </button>
                          )}

                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => deleteComment(comment._id)}
                            title="Delete comment"
                            className="
                              flex
                              items-center
                              gap-1.5
                              px-3 py-1.5
                              rounded-lg
                              bg-red-50
                              text-red-600
                              hover:bg-red-100
                              dark:bg-red-950/40
                              dark:text-red-400
                              dark:hover:bg-red-950/70
                              transition-colors
                              duration-200
                              cursor-pointer
                              disabled:opacity-50
                              disabled:cursor-not-allowed
                            "
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <MessageSquare
                      size={40}
                      className="
                        mx-auto
                        text-[var(--ad-ink-faint)]
                        opacity-40
                        mb-3
                      "
                    />

                    <p
                      className="
                        font-medium
                        text-[var(--ad-ink)]
                      "
                    >
                      {search ? "No comments found" : "No comments yet"}
                    </p>

                    <p
                      className="
                        text-sm
                        text-[var(--ad-ink-faint)]
                        mt-1
                      "
                    >
                      {search
                        ? "Try another search term."
                        : "Comments submitted by readers will appear here."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Comments;
