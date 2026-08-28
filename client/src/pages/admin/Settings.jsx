import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Trash2,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  KeyRound,
  UserX,
  ArrowLeft,
} from "lucide-react";

import api from "../../services/api";

const Settings = () => {
  const navigate = useNavigate();

  // ==========================================
  // PASSWORD STATE
  // ==========================================

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // ==========================================
  // DELETE ACCOUNT STATE
  // ==========================================

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ==========================================
  // PASSWORD VALIDATION
  // ==========================================

  const validatePassword = () => {
    if (!currentPassword.trim()) {
      return "Please enter your current password.";
    }

    if (!newPassword.trim()) {
      return "Please enter your new password.";
    }

    if (newPassword.length < 6) {
      return "New password must be at least 6 characters.";
    }

    if (!confirmPassword.trim()) {
      return "Please confirm your new password.";
    }

    if (newPassword !== confirmPassword) {
      return "New passwords do not match.";
    }

    if (currentPassword === newPassword) {
      return "New password must be different from your current password.";
    }

    return "";
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    const validationError = validatePassword();

    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setPasswordError("Your session has expired. Please login again.");
      return;
    }

    try {
      setPasswordLoading(true);

      const response = await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(
        response.data?.message ||
          "Your password has been changed successfully.",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);

      setPasswordError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to change password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // ==========================================
  // DELETE ACCOUNT
  // ==========================================

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setDeleteError("Your session has expired. Please login again.");
      return;
    }

    try {
      setDeleteLoading(true);
      setDeleteError("");

      const response = await api.delete("/auth/account");

      console.log("DELETE ACCOUNT RESPONSE:", response.data);

      // Clear authentication
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Close modal
      setShowDeleteModal(false);

      // Redirect to login
      navigate("/login", {
        replace: true,
        state: {
          message:
            response.data?.message ||
            "Your account has been deleted successfully.",
        },
      });
    } catch (error) {
      console.error("DELETE ACCOUNT ERROR:", error);

      setDeleteError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to delete your account.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================
  // PASSWORD INPUT
  // ==========================================

  const PasswordInput = ({
    label,
    value,
    onChange,
    visible,
    setVisible,
    placeholder,
    autoComplete,
  }) => {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--ad-ink)]">
          {label}
        </label>

        <div className="relative">
          <Lock
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
            type={visible ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="
              w-full
              rounded-lg
              border border-[var(--ad-rule)]
              bg-[var(--ad-surface-2)]
              py-3
              pl-10
              pr-11
              text-sm
              text-[var(--ad-ink)]
              placeholder:text-[var(--ad-ink-faint)]
              focus:border-[var(--ad-accent)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--ad-accent-soft)]
              transition-all
              duration-200
            "
          />

          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              rounded-md
              p-1.5
              text-[var(--ad-ink-faint)]
              hover:bg-[var(--ad-surface)]
              hover:text-[var(--ad-ink)]
              transition-colors
              cursor-pointer
            "
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="space-y-8">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border border-[var(--ad-rule)]
              bg-[var(--ad-surface)]
              text-[var(--ad-ink-faint)]
              hover:bg-[var(--ad-surface-2)]
              hover:text-[var(--ad-ink)]
              transition-colors
              cursor-pointer
            "
            title="Go back"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <h2 className="text-2xl font-bold text-[var(--ad-ink)]">
              Settings
            </h2>

            <p className="mt-1 text-sm text-[var(--ad-ink-faint)]">
              Manage your account security and account settings.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          SECURITY CARD
      ========================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-[var(--ad-rule)]
          bg-[var(--ad-surface)]
          shadow-sm
        "
      >
        {/* CARD HEADER */}

        <div
          className="
            border-b border-[var(--ad-rule)]
            p-6
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[var(--ad-accent-soft)]
                text-[var(--ad-accent-ink)]
              "
            >
              <ShieldCheck size={21} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--ad-ink)]">
                Security
              </h3>

              <p className="mt-1 text-sm text-[var(--ad-ink-faint)]">
                Protect your account by keeping your password up to date.
              </p>
            </div>
          </div>
        </div>

        {/* PASSWORD FORM */}

        <form onSubmit={handleChangePassword} className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-[var(--ad-surface-2)]
                text-[var(--ad-ink-faint)]
              "
            >
              <KeyRound size={18} />
            </div>

            <div>
              <h4 className="font-semibold text-[var(--ad-ink)]">
                Change Password
              </h4>

              <p className="text-xs text-[var(--ad-ink-faint)]">
                Use a strong password that you do not use elsewhere.
              </p>
            </div>
          </div>

          {/* CURRENT PASSWORD */}

          <div className="grid gap-5">
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              visible={showCurrentPassword}
              setVisible={setShowCurrentPassword}
              placeholder="Enter your current password"
              autoComplete="current-password"
            />

            {/* NEW + CONFIRM */}

            <div className="grid gap-5 md:grid-cols-2">
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                visible={showNewPassword}
                setVisible={setShowNewPassword}
                placeholder="Enter your new password"
                autoComplete="new-password"
              />

              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                visible={showConfirmPassword}
                setVisible={setShowConfirmPassword}
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
            </div>

            {/* PASSWORD REQUIREMENTS */}

            <div
              className="
                rounded-xl
                border border-[var(--ad-rule)]
                bg-[var(--ad-surface-2)]
                p-4
              "
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--ad-ink-faint)]">
                Password requirements
              </p>

              <div className="grid gap-2 text-sm md:grid-cols-2">
                <div
                  className={
                    newPassword.length >= 6
                      ? "text-green-600 dark:text-green-400"
                      : "text-[var(--ad-ink-faint)]"
                  }
                >
                  {newPassword.length >= 6 ? "✓" : "○"} At least 6 characters
                </div>

                <div
                  className={
                    newPassword && newPassword === confirmPassword
                      ? "text-green-600 dark:text-green-400"
                      : "text-[var(--ad-ink-faint)]"
                  }
                >
                  {newPassword && newPassword === confirmPassword ? "✓" : "○"}{" "}
                  Passwords must match
                </div>

                <div
                  className={
                    newPassword && currentPassword !== newPassword
                      ? "text-green-600 dark:text-green-400"
                      : "text-[var(--ad-ink-faint)]"
                  }
                >
                  {newPassword && currentPassword !== newPassword ? "✓" : "○"}{" "}
                  Different from current password
                </div>
              </div>
            </div>

            {/* ERROR */}

            {passwordError && (
              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-red-700
                  dark:border-red-900
                  dark:bg-red-950/30
                  dark:text-red-400
                "
              >
                <AlertTriangle size={17} className="mt-0.5 shrink-0" />

                <span className="text-sm">{passwordError}</span>
              </div>
            )}

            {/* SUCCESS */}

            {passwordSuccess && (
              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-lg
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-green-700
                  dark:border-green-900
                  dark:bg-green-950/30
                  dark:text-green-400
                "
              >
                <CheckCircle2 size={17} className="mt-0.5 shrink-0" />

                <span className="text-sm">{passwordSuccess}</span>
              </div>
            )}

            {/* SUBMIT */}

            <div
              className="
                flex
                justify-end
                border-t border-[var(--ad-rule)]
                pt-5
              "
            >
              <button
                type="submit"
                disabled={passwordLoading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[var(--ad-accent)]
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  hover:opacity-90
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  transition-all
                  duration-200
                  cursor-pointer
                  md:w-auto
                "
              >
                {passwordLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ==========================================
          DANGER ZONE
      ========================================== */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-red-200
          bg-[var(--ad-surface)]
          shadow-sm
          dark:border-red-900
        "
      >
        {/* HEADER */}

        <div
          className="
            border-b
            border-red-100
            bg-red-50
            p-6
            dark:border-red-900/50
            dark:bg-red-950/20
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-red-100
                text-red-600
                dark:bg-red-950/50
                dark:text-red-400
              "
            >
              <UserX size={21} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400">
                Danger Zone
              </h3>

              <p className="mt-1 text-sm text-red-600/70 dark:text-red-400/60">
                Permanent account actions.
              </p>
            </div>
          </div>
        </div>

        {/* DELETE */}

        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h4 className="font-semibold text-[var(--ad-ink)]">
              Delete Account
            </h4>

            <p className="mt-1.5 text-sm leading-6 text-[var(--ad-ink-faint)]">
              Permanently delete your account and associated data. This action
              cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setDeleteError("");
              setShowDeleteModal(true);
            }}
            className="
              flex
              w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-5
              py-2.5
              text-sm
              font-medium
              text-red-600
              hover:bg-red-100
              dark:border-red-900
              dark:bg-red-950/30
              dark:text-red-400
              dark:hover:bg-red-950/50
              transition-colors
              cursor-pointer
              md:w-auto
            "
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>

        {/* DELETE ERROR */}

        {deleteError && (
          <div
            className="
              border-t
              border-red-100
              px-6
              py-4
              dark:border-red-900
            "
          >
            <div className="flex items-start gap-3 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle size={17} className="mt-0.5 shrink-0" />

              <span>{deleteError}</span>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          DELETE MODAL
      ========================================== */}

      {showDeleteModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/60
            px-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              if (!deleteLoading) {
                setShowDeleteModal(false);
              }
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              border border-[var(--ad-rule)]
              bg-[var(--ad-surface)]
              shadow-2xl
            "
          >
            {/* MODAL HEADER */}

            <div
              className="
                border-b
                border-[var(--ad-rule)]
                p-6
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-100
                    text-red-600
                    dark:bg-red-950/40
                    dark:text-red-400
                  "
                >
                  <AlertTriangle size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--ad-ink)]">
                    Delete your account?
                  </h3>

                  <p className="mt-1 text-sm text-[var(--ad-ink-faint)]">
                    This action is permanent and cannot be reversed.
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">
              <div
                className="
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  p-4
                  dark:border-red-900
                  dark:bg-red-950/20
                "
              >
                <p className="text-sm leading-6 text-red-700 dark:text-red-400">
                  Deleting your account will permanently remove your account and
                  associated data. You will be logged out immediately.
                </p>
              </div>

              {deleteError && (
                <div
                  className="
                    mt-4
                    rounded-lg
                    border border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                    dark:border-red-900
                    dark:bg-red-950/30
                    dark:text-red-400
                  "
                >
                  {deleteError}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-[var(--ad-rule)]
                p-5
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-[var(--ad-rule)]
                  bg-[var(--ad-surface-2)]
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-[var(--ad-ink-soft)]
                  hover:bg-[var(--ad-surface)]
                  disabled:opacity-50
                  transition-colors
                  cursor-pointer
                  sm:w-auto
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-red-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  transition-colors
                  cursor-pointer
                  sm:w-auto
                "
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
