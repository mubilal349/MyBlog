import React, { useState } from "react";
import { MessageSquare, Search, Trash2, User, Calendar } from "lucide-react";

const Comments = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      text: "Great article!",
      author: "Ali",
      post: "React Hooks Guide",
      date: "Aug 28, 2026",
    },
    {
      id: 2,
      text: "Thanks for sharing.",
      author: "Sara",
      post: "Next.js vs React",
      date: "Aug 27, 2026",
    },
  ]);

  const [search, setSearch] = useState("");

  const deleteComment = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmDelete) return;

    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== id),
    );
  };

  const filteredComments = comments.filter(
    (comment) =>
      comment.text.toLowerCase().includes(search.toLowerCase()) ||
      comment.author.toLowerCase().includes(search.toLowerCase()) ||
      comment.post.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* ==========================================
          HEADER
          ========================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2
            className="
              text-2xl
              font-bold
              text-[var(--ad-ink)]
            "
          >
            Manage Comments
          </h2>

          <p
            className="
              text-sm
              text-[var(--ad-ink-faint)]
              mt-1
            "
          >
            Review and manage comments posted on your blog.
          </p>
        </div>

        {/* Comment Count */}

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
            {comments.length} Comments
          </span>
        </div>
      </div>

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
              <h3
                className="
                  text-lg
                  font-bold
                  text-[var(--ad-ink)]
                "
              >
                All Comments
              </h3>

              <p
                className="
                  text-sm
                  text-[var(--ad-ink-faint)]
                  mt-1
                "
              >
                View and moderate comments from your readers.
              </p>
            </div>

            {/* ==========================================
                SEARCH
                ========================================== */}

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
                filteredComments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="
                      border-b border-[var(--ad-rule)]
                      hover:bg-[var(--ad-surface-2)]
                      transition-colors duration-200
                    "
                  >
                    {/* ==========================================
                        COMMENT
                        ========================================== */}

                    <td className="px-6 py-4">
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

                        <div>
                          <p
                            className="
                              font-medium
                              text-[var(--ad-ink)]
                            "
                          >
                            {comment.text}
                          </p>

                          <p
                            className="
                              text-xs
                              text-[var(--ad-ink-faint)]
                              mt-1
                            "
                          >
                            Comment ID: #{comment.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ==========================================
                        AUTHOR
                        ========================================== */}

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
                          <User
                            size={15}
                            className="text-[var(--ad-ink-faint)]"
                          />
                        </div>

                        <span
                          className="
                            text-sm
                            text-[var(--ad-ink-soft)]
                          "
                        >
                          {comment.author}
                        </span>
                      </div>
                    </td>

                    {/* ==========================================
                        POST
                        ========================================== */}

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
                        "
                      >
                        {comment.post}
                      </span>
                    </td>

                    {/* ==========================================
                        DATE
                        ========================================== */}

                    <td className="px-6 py-4">
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-[var(--ad-ink-faint)]
                        "
                      >
                        <Calendar size={14} />

                        {comment.date}
                      </div>
                    </td>

                    {/* ==========================================
                        ACTIONS
                        ========================================== */}

                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => deleteComment(comment.id)}
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
                            transition-colors duration-200 cursor-pointer
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
                /* ==========================================
                    EMPTY STATE
                    ========================================== */

                <tr>
                  <td
                    colSpan="5"
                    className="
                      px-6 py-12
                      text-center
                    "
                  >
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
                      No comments found
                    </p>

                    <p
                      className="
                        text-sm
                        text-[var(--ad-ink-faint)]
                        mt-1
                      "
                    >
                      Try another search term.
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
