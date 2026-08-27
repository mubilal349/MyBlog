import React, { useState } from "react";
import {
  Users,
  Search,
  Edit,
  Trash2,
  ShieldCheck,
  UserCog,
} from "lucide-react";

const UsersPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Bilal",
      email: "bilal@example.com",
      role: "admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Ali",
      email: "ali@example.com",
      role: "editor",
      status: "Active",
    },
  ]);

  const [search, setSearch] = useState("");

  const deleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase()),
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
            Manage Users
          </h2>

          <p
            className="
              text-sm
              text-[var(--ad-ink-faint)]
              mt-1
            "
          >
            Manage users, roles and account access.
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
          <Users size={17} />

          <span className="text-sm font-medium">{users.length} Users</span>
        </div>
      </div>

      {/* ==========================================
          USERS TABLE
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
                All Users
              </h3>

              <p
                className="
                  text-sm
                  text-[var(--ad-ink-faint)]
                  mt-1
                "
              >
                View and manage registered users.
              </p>
            </div>

            {/* Search */}

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
                placeholder="Search users..."
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
                  User
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
                  Email
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
                  Role
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="
                      border-b border-[var(--ad-rule)]
                      hover:bg-[var(--ad-surface-2)]
                      transition-colors duration-200
                    "
                  >
                    {/* User */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-10 h-10
                            rounded-full
                            bg-[var(--ad-accent-soft)]
                            text-[var(--ad-accent-ink)]
                            flex
                            items-center
                            justify-center
                            font-semibold
                            text-sm
                          "
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p
                            className="
                              font-medium
                              text-[var(--ad-ink)]
                            "
                          >
                            {user.name}
                          </p>

                          <p
                            className="
                              text-xs
                              text-[var(--ad-ink-faint)]
                              mt-1
                            "
                          >
                            User ID: #{user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}

                    <td className="px-6 py-4">
                      <span
                        className="
                          text-sm
                          text-[var(--ad-ink-soft)]
                        "
                      >
                        {user.email}
                      </span>
                    </td>

                    {/* Role */}

                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            px-3 py-1
                            rounded-full
                            text-xs
                            font-medium
                            bg-purple-100
                            text-purple-700
                            dark:bg-purple-950/50
                            dark:text-purple-400
                          "
                        >
                          <ShieldCheck size={13} />
                          Admin
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
                            bg-blue-100
                            text-blue-700
                            dark:bg-blue-950/50
                            dark:text-blue-400
                          "
                        >
                          <UserCog size={13} />
                          Editor
                        </span>
                      )}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          text-green-600
                          dark:text-green-400
                        "
                      >
                        <span
                          className="
                            w-2
                            h-2
                            rounded-full
                            bg-green-500
                          "
                        />

                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* Edit */}

                        <button
                          type="button"
                          className="
                            flex
                            items-center
                            gap-1.5
                            px-3 py-1.5
                            rounded-lg
                            border border-[var(--ad-rule)]
                            bg-[var(--ad-surface)]
                            text-[var(--ad-ink-soft)]
                            hover:bg-[var(--ad-surface-2)]
                            hover:text-[var(--ad-ink)]
                            transition-colors duration-200 cursor-pointer
                          "
                        >
                          <Edit size={15} />
                          Edit
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() => deleteUser(user.id)}
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
                            transition-colors duration-200  cursor-pointer
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
                    NO USERS
                    ========================================== */

                <tr>
                  <td
                    colSpan="5"
                    className="
                      px-6 py-12
                      text-center
                    "
                  >
                    <Users
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
                      No users found
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

export default UsersPage;
