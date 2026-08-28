import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  User,
  X,
  Loader2,
} from "lucide-react";

import api from "../../services/api";

const Settings = () => {
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
      return "Your new password must be different from your current password.";
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

    try {
      setPasswordLoading(true);

      const response = await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setPasswordSuccess(
        response.data?.message || "Password changed successfully.",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error.response?.data || error.message,
      );

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
    try {
      setDeleteLoading(true);
      setDeleteError("");

      await api.delete("/auth/account");

      // Remove authentication information
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error(
        "DELETE ACCOUNT ERROR:",
        error.response?.data || error.message,
      );

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
    setValue,
    visible,
    setVisible,
    placeholder,
    autoComplete,
  }) => {
    return (
      <div className="field">
        <label>{label}</label>

        <div className="relative">
          <Lock
            size={16}
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
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="!pl-10 !pr-11"
          />

          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              rounded-lg
              p-2
              text-[var(--ad-ink-faint)]
              hover:bg-[var(--ad-surface-2)]
              hover:text-[var(--ad-ink)]
              transition-colors
              cursor-pointer
            "
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    );
  };

  // ==========================================
  // PASSWORD REQUIREMENT
  // ==========================================

  const Requirement = ({ valid, children }) => {
    return (
      <div
        className={`
          flex
          items-center
          gap-2
          text-xs
          transition-colors
          ${
            valid
              ? "text-green-600 dark:text-green-400"
              : "text-[var(--ad-ink-faint)]"
          }
        `}
      >
        {valid ? <CheckCircle2 size={14} /> : <span>•</span>}
        {children}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* ==========================================
          PAGE HEADER
          ========================================== */}

      <div>
        <p className="eyebrow">Account</p>

        <h2 className="serif page-title">Settings</h2>

        <p className="mt-1 text-sm text-[var(--ad-ink-faint)]">
          Manage your account security and personal settings.
        </p>
      </div>

      {/* ==========================================
          ACCOUNT SECURITY
          ========================================== */}

      <section
        className="
          bg-[var(--ad-surface)]
          border border-[var(--ad-rule)]
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        {/* HEADER */}

        <div
          className="
            p-6
            border-b border-[var(--ad-rule)]
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                w-11 h-11
                rounded-xl
                bg-[var(--ad-accent-soft)]
                text-[var(--ad-accent-ink)]
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <ShieldCheck size={21} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--ad-ink)]">
                Account security
              </h3>

              <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                Keep your account secure by regularly updating your password.
              </p>
            </div>
          </div>
        </div>

        {/* PASSWORD FORM */}

        <form onSubmit={handleChangePassword} className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="
                w-9 h-9
                rounded-lg
                bg-[var(--ad-surface-2)]
                border border-[var(--ad-rule)]
                flex
                items-center
                justify-center
              "
            >
              <KeyRound size={17} className="text-[var(--ad-accent-ink)]" />
            </div>

            <div>
              <h4 className="font-semibold text-[var(--ad-ink)]">
                Change password
              </h4>

              <p className="text-xs text-[var(--ad-ink-faint)] mt-0.5">
                Choose a strong password that you don't use elsewhere.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {/* CURRENT PASSWORD */}

            <PasswordInput
              label="Current password"
              value={currentPassword}
              setValue={setCurrentPassword}
              visible={showCurrentPassword}
              setVisible={setShowCurrentPassword}
              placeholder="Enter your current password"
              autoComplete="current-password"
            />

            {/* NEW PASSWORDS */}

            <div className="grid gap-5 md:grid-cols-2">
              <PasswordInput
                label="New password"
                value={newPassword}
                setValue={setNewPassword}
                visible={showNewPassword}
                setVisible={setShowNewPassword}
                placeholder="Enter a new password"
                autoComplete="new-password"
              />

              <PasswordInput
                label="Confirm new password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                visible={showConfirmPassword}
                setVisible={setShowConfirmPassword}
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
            </div>

            {/* REQUIREMENTS */}

            <div
              className="
                rounded-xl
                border border-[var(--ad-rule)]
                bg-[var(--ad-surface-2)]
                p-4
              "
            >
              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-[var(--ad-ink-faint)]
                  mb-3
                "
              >
                Password requirements
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                <Requirement valid={newPassword.length >= 6}>
                  At least 6 characters
                </Requirement>

                <Requirement
                  valid={
                    newPassword.length > 0 && newPassword === confirmPassword
                  }
                >
                  Passwords match
                </Requirement>

                <Requirement
                  valid={
                    currentPassword.length > 0 &&
                    newPassword.length > 0 &&
                    currentPassword !== newPassword
                  }
                >
                  Different from current password
                </Requirement>
              </div>
            </div>

            {/* ERROR */}

            {passwordError && (
              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  px-4 py-3
                  text-sm
                  text-red-700
                  dark:bg-red-950/30
                  dark:border-red-900
                  dark:text-red-400
                "
              >
                <AlertTriangle size={17} className="mt-0.5 flex-shrink-0" />

                <span>{passwordError}</span>
              </div>
            )}

            {/* SUCCESS */}

            {passwordSuccess && (
              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border border-green-200
                  bg-green-50
                  px-4 py-3
                  text-sm
                  text-green-700
                  dark:bg-green-950/30
                  dark:border-green-900
                  dark:text-green-400
                "
              >
                <CheckCircle2 size={17} className="mt-0.5 flex-shrink-0" />

                <span>{passwordSuccess}</span>
              </div>
            )}

            {/* FOOTER */}

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
                  btn-primary
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {passwordLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Change password
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ==========================================
          ACCOUNT INFORMATION
          ========================================== */}

      <section
        className="
          bg-[var(--ad-surface)]
          border border-[var(--ad-rule)]
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        <div className="p-6 border-b border-[var(--ad-rule)]">
          <div className="flex items-center gap-3">
            <div
              className="
                w-10 h-10
                rounded-xl
                bg-[var(--ad-accent-soft)]
                flex
                items-center
                justify-center
                text-[var(--ad-accent-ink)]
              "
            >
              <User size={18} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--ad-ink)]">
                Account information
              </h3>

              <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                Your account details and authentication information.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div
            className="
              rounded-xl
              border border-[var(--ad-rule)]
              bg-[var(--ad-surface-2)]
              p-4
            "
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 text-[var(--ad-accent-ink)]"
              />

              <div>
                <p className="font-medium text-[var(--ad-ink)]">
                  Account security
                </p>

                <p className="text-sm text-[var(--ad-ink-faint)] mt-1">
                  Your password is securely hashed on the server and is never
                  displayed in your account settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          DANGER ZONE
          ========================================== */}

      <section
        className="
          bg-[var(--ad-surface)]
          border border-red-200
          dark:border-red-900
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >
        {/* HEADER */}

        <div
          className="
            p-6
            border-b
            border-red-200
            dark:border-red-900
            bg-red-50
            dark:bg-red-950/20
          "
        >
          <div className="flex items-start gap-4">
            <div
              className="
                w-11 h-11
                rounded-xl
                bg-red-100
                dark:bg-red-950/50
                text-red-600
                dark:text-red-400
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >
              <Trash2 size={20} />
            </div>

            <div>
              <h3
                className="
                  text-lg
                  font-bold
                  text-red-700
                  dark:text-red-400
                "
              >
                Danger zone
              </h3>

              <p className="text-sm text-red-600/70 dark:text-red-400/60 mt-1">
                Permanent account actions. Proceed carefully.
              </p>
            </div>
          </div>
        </div>

        {/* DELETE ACCOUNT */}

        <div className="p-6">
          <div
            className="
              flex
              flex-col
              gap-5
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            <div className="max-w-2xl">
              <h4 className="font-semibold text-[var(--ad-ink)]">
                Delete your account
              </h4>

              <p className="text-sm text-[var(--ad-ink-faint)] mt-1.5 leading-6">
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
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                px-4 py-2.5
                bg-red-50
                text-red-600
                border border-red-200
                hover:bg-red-100
                dark:bg-red-950/40
                dark:text-red-400
                dark:border-red-900
                dark:hover:bg-red-950/70
                transition-colors
                duration-200
                cursor-pointer
                flex-shrink-0
              "
            >
              <Trash2 size={16} />
              Delete account
            </button>
          </div>
        </div>
      </section>

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
            backdrop-blur-sm
            p-4
          "
          onClick={(event) => {
            if (event.target === event.currentTarget && !deleteLoading) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              bg-[var(--ad-surface)]
              border border-[var(--ad-rule)]
              shadow-2xl
              overflow-hidden
            "
          >
            {/* MODAL HEADER */}

            <div
              className="
                p-6
                border-b border-[var(--ad-rule)]
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className="
                      w-10 h-10
                      rounded-xl
                      bg-red-100
                      dark:bg-red-950/50
                      text-red-600
                      dark:text-red-400
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <AlertTriangle size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold text-[var(--ad-ink)]">
                      Delete account?
                    </h3>

                    <p className="text-xs text-[var(--ad-ink-faint)] mt-1">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="
                    p-2
                    rounded-lg
                    text-[var(--ad-ink-faint)]
                    hover:bg-[var(--ad-surface-2)]
                    hover:text-[var(--ad-ink)]
                    transition-colors
                    cursor-pointer
                  "
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}

            <div className="p-6">
              <p className="text-sm leading-6 text-[var(--ad-ink-soft)]">
                Are you absolutely sure you want to delete your account? All
                account-related information will be permanently removed.
              </p>

              <div
                className="
                  mt-4
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  dark:bg-red-950/30
                  dark:border-red-900
                  px-4 py-3
                "
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    size={16}
                    className="
                      mt-0.5
                      text-red-600
                      dark:text-red-400
                      flex-shrink-0
                    "
                  />

                  <p
                    className="
                      text-xs
                      leading-5
                      text-red-700
                      dark:text-red-400
                    "
                  >
                    This operation is permanent. You will be logged out
                    immediately after your account is deleted.
                  </p>
                </div>
              </div>

              {/* ERROR */}

              {deleteError && (
                <div
                  className="
                    mt-4
                    rounded-lg
                    border border-red-200
                    bg-red-50
                    dark:bg-red-950/30
                    dark:border-red-900
                    px-4 py-3
                    text-sm
                    text-red-700
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
                sm:flex-row
                sm:justify-end
                p-6
                border-t border-[var(--ad-rule)]
              "
            >
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="
                  btn-ghost
                  w-full
                  sm:w-auto
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-4 py-2.5
                  bg-red-600
                  text-white
                  hover:bg-red-700
                  transition-colors
                  duration-200
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  w-full
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
                    Yes, delete account
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
