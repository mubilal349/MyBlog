import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Edit,
  Trash2,
  ShieldCheck,
  UserCog,
  X,
  Save,
} from "lucide-react";

import api from "../../services/api";

const UsersPage = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // FETCH USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      console.log("USERS RESPONSE:", response.data);

      const usersData = response.data?.users || [];

      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD USERS
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEditUser = (user) => {
    setEditingUser(user);

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    });

    setError("");
    setSuccess("");

    setShowEditModal(true);
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  const closeEditModal = () => {
    if (saving) return;

    setShowEditModal(false);
    setEditingUser(null);

    setEditForm({
      name: "",
      email: "",
      role: "",
    });
  };

  // ==========================================
  // EDIT FORM CHANGE
  // ==========================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE USER
  // ==========================================

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editingUser?._id) {
      setError("User ID is missing.");
      return;
    }

    if (!editForm.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!editForm.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(`/users/${editingUser._id}`, {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
      });

      console.log("UPDATE USER RESPONSE:", response.data);

      const updatedUser = response.data?.user || {
        ...editingUser,
        ...editForm,
      };

      // Update user immediately in UI
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === editingUser._id
            ? {
                ...user,
                ...updatedUser,
              }
            : user,
        ),
      );

      setSuccess("User updated successfully.");

      closeEditModal();
    } catch (err) {
      console.error("UPDATE USER ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update user.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE USER
  // ==========================================

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find((user) => user._id === userId);

    const userName =
      userToDelete?.name || userToDelete?.username || "this user";

    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(userId);
      setError("");
      setSuccess("");

      const response = await api.delete(`/users/${userId}`);

      console.log("DELETE USER RESPONSE:", response.data);

      // Remove deleted user from UI
      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== userId),
      );

      setSuccess("User deleted successfully.");
    } catch (err) {
      console.error("DELETE USER ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete user.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const username = user.username || "";
    const email = user.email || "";
    const role = user.role || "";

    const searchValue = search.toLowerCase();

    return (
      name.toLowerCase().includes(searchValue) ||
      username.toLowerCase().includes(searchValue) ||
      email.toLowerCase().includes(searchValue) ||
      role.toLowerCase().includes(searchValue)
    );
  });

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ad-ink)]">
            Manage Users
          </h2>

          <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
            Manage users, roles and account access.
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
          <Users
            size={40}
            className="
              mx-auto
              text-[var(--ad-ink-faint)]
              opacity-40
              mb-3
              animate-pulse
            "
          />

          <p className="font-medium text-[var(--ad-ink)]">Loading users...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="space-y-8">
      {/* ==========================================
          HEADER
          ========================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--ad-ink)]">
            Manage Users
          </h2>

          <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
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
          ERROR MESSAGE
          ========================================== */}

      {error && (
        <div
          className="
            px-4 py-3
            rounded-xl
            border
            border-red-200
            dark:border-red-900
            bg-red-50
            dark:bg-red-950/30
            text-red-600
            dark:text-red-400
            text-sm
          "
        >
          {error}
        </div>
      )}

      {/* ==========================================
          SUCCESS MESSAGE
          ========================================== */}

      {success && (
        <div
          className="
            px-4 py-3
            rounded-xl
            border
            border-green-200
            dark:border-green-900
            bg-green-50
            dark:bg-green-950/30
            text-green-600
            dark:text-green-400
            text-sm
          "
        >
          {success}
        </div>
      )}

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
        {/* TABLE HEADER */}

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
                All Users
              </h3>

              <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                View and manage registered users.
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
                  transition-colors
                  duration-200
                "
              />
            </div>
          </div>
        </div>

        {/* TABLE */}

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
                filteredUsers.map((user) => {
                  const userName = user.name || user.username || "Unknown User";

                  const userEmail = user.email || "No email";

                  const userRole = user.role || "user";

                  const isOnline = user.isOnline === true;

                  const status =
                    user.status || (isOnline ? "Active" : "Offline");

                  return (
                    <tr
                      key={user._id}
                      className="
                        border-b border-[var(--ad-rule)]
                        hover:bg-[var(--ad-surface-2)]
                        transition-colors
                        duration-200
                      "
                    >
                      {/* USER */}

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
                            {userName.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p
                              className="
                                font-medium
                                text-[var(--ad-ink)]
                              "
                            >
                              {userName}
                            </p>

                            <p
                              className="
                                text-xs
                                text-[var(--ad-ink-faint)]
                                mt-1
                              "
                            >
                              ID: {String(user._id).slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-4">
                        <span
                          className="
                            text-sm
                            text-[var(--ad-ink-soft)]
                          "
                        >
                          {userEmail}
                        </span>
                      </td>

                      {/* ROLE */}

                      <td className="px-6 py-4">
                        {userRole === "admin" ? (
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

                            {userRole.charAt(0).toUpperCase() +
                              userRole.slice(1)}
                          </span>
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            ${
                              isOnline || status === "Active"
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          `}
                        >
                          <span
                            className={`
                              w-2
                              h-2
                              rounded-full
                              ${
                                isOnline || status === "Active"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }
                            `}
                          />

                          {status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() => handleEditUser(user)}
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
                              transition-colors
                              duration-200
                              cursor-pointer
                            "
                          >
                            <Edit size={15} />
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={deletingId === user._id}
                            onClick={() => handleDeleteUser(user._id)}
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

                            {deletingId === user._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
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
                      {search
                        ? "Try another search term."
                        : "No registered users found."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
          EDIT USER MODAL
          ========================================== */}

      {showEditModal && editingUser && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            p-4
            bg-black/50
            backdrop-blur-sm
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-lg
              bg-[var(--ad-surface)]
              border border-[var(--ad-rule)]
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >
            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                p-6
                border-b border-[var(--ad-rule)]
              "
            >
              <div>
                <h3
                  className="
                    text-xl
                    font-bold
                    text-[var(--ad-ink)]
                  "
                >
                  Edit User
                </h3>

                <p
                  className="
                    text-sm
                    text-[var(--ad-ink-faint)]
                    mt-1
                  "
                >
                  Update this user's account information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="
                  w-9 h-9
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-[var(--ad-ink-faint)]
                  hover:bg-[var(--ad-surface-2)]
                  hover:text-[var(--ad-ink)]
                  transition
                  cursor-pointer
                  disabled:opacity-50
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleUpdateUser} className="p-6 space-y-5">
              {/* NAME */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-[var(--ad-ink)]
                    mb-2
                  "
                >
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
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
                  placeholder="Enter name"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-[var(--ad-ink)]
                    mb-2
                  "
                >
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
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
                  placeholder="Enter email"
                />
              </div>

              {/* ROLE */}

              <div>
                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-[var(--ad-ink)]
                    mb-2
                  "
                >
                  Role
                </label>

                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
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
                  <option value="user">User</option>

                  <option value="editor">Editor</option>

                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* BUTTONS */}

              <div
                className="
                  flex
                  justify-end
                  gap-3
                  pt-3
                "
              >
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="
                    px-4 py-2.5
                    rounded-lg
                    border border-[var(--ad-rule)]
                    text-[var(--ad-ink-soft)]
                    hover:bg-[var(--ad-surface-2)]
                    transition
                    cursor-pointer
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex
                    items-center
                    gap-2
                    px-4 py-2.5
                    rounded-lg
                    bg-[var(--ad-accent)]
                    text-white
                    hover:opacity-90
                    transition
                    cursor-pointer
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  <Save size={16} />

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
