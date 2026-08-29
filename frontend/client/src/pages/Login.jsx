import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

// ---------------------------------------------------------------------------
// Design: same "Signal" system as Categories / BlogDetails — dark ink shell,
// violet accent, DM Serif Display for the headline, JetBrains Mono for
// labels and status text. The auth card reads as an "access panel": a
// pulsing eyebrow dot, a mode switch styled like the category pills, and
// underline-style inputs instead of boxed ones to keep it quiet and precise.
// ---------------------------------------------------------------------------

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(credentials);
    } else {
      result = await register(credentials);
    }

    setLoading(false);

    if (result.success) {
      console.log("LOGIN RESULT:", result);
      console.log("USER ROLE:", result.user?.role);

      const role = result.user?.role?.toLowerCase();

      if (role === "admin" || role === "editor") {
        navigate("/admin/overview");
      } else {
        navigate("/");
      }
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="auth-shell">
      <style>{styles}</style>

      <div className="auth-glow auth-glow--violet" />
      <div className="auth-glow auth-glow--pink" />

      <div className="auth-card">
        <div className="auth-eyebrow">
          <span className="auth-eyebrow-dot" />
          SECURE CHANNEL
        </div>

        <h1 className="auth-title">
          {isLogin ? (
            <>
              Welcome back to the <em>MyBlog</em>
            </>
          ) : (
            <>
              Join the <em className="ml-3">signal</em>
            </>
          )}
        </h1>
        <p className="auth-subtitle">
          {isLogin
            ? "Sign in to pick up right where you left off."
            : "Create an account to start reading and saving articles."}
        </p>

        <div className="auth-switch" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={`auth-switch-btn ${isLogin ? "is-active" : ""}`}
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={`auth-switch-btn ${!isLogin ? "is-active" : ""}`}
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
          >
            Create account
          </button>
        </div>

        {message && (
          <div className="auth-error">
            <span className="auth-error-tag">AUTH // ERROR</span>
            <p>{message}</p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="username" className="auth-label">
                <User size={12} /> Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="auth-input"
                placeholder="yourname"
                value={credentials.username || ""}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              <Mail size={12} /> Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="auth-input"
              placeholder="you@example.com"
              value={credentials.email}
              onChange={handleChange}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              <Lock size={12} /> Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="auth-input pr-12"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleChange}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Connecting…" : isLogin ? "Sign in" : "Create account"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="auth-footnote">
          {isLogin ? "Need an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="auth-footnote-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Create one" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

.auth-shell {
  --ink: #0a0a0f;
  --ink-soft: rgba(255, 255, 255, 0.03);
  --ink-line: rgba(255, 255, 255, 0.08);
  --paper: #e8e8f0;
  --paper-dim: #5e5e78;
  --signal: #8B5CF6;
  --signal-dim: rgba(139, 92, 246, 0.16);
  --danger: #f87171;

  position: relative;
  min-height: 100vh;
  background: var(--ink);
  color: var(--paper);
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  overflow: hidden;
}

.auth-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.auth-glow--violet {
  top: -80px;
  right: -60px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%);
}
.auth-glow--pink {
  bottom: -60px;
  left: -60px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.12) 0%, transparent 70%);
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: var(--ink-soft);
  border: 1px solid var(--ink-line);
  border-radius: 16px;
  padding: 36px 32px 32px;
  backdrop-filter: blur(6px);
}

.auth-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  color: var(--signal);
  margin-bottom: 18px;
}
.auth-eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--signal);
  flex-shrink: 0;
  animation: auth-pulse 1.8s ease-in-out infinite;
}
@keyframes auth-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.auth-title {
  font-family: 'DM Serif Display', serif;
  font-weight: 400;
  font-size: 30px;
  line-height: 1.2;
  margin: 0 0 10px;
  color: #f1f0ff;
}
.auth-title em {
  font-style: italic;
  color: var(--signal);
}

.auth-subtitle {
  font-size: 13px;
  font-weight: 300;
  line-height: 1.6;
  color: var(--paper-dim);
  margin: 0 0 24px;
  max-width: 34ch;
}

.auth-switch {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--ink-line);
  border-radius: 999px;
  padding: 4px;
  margin-bottom: 22px;
}
.auth-switch-btn {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--paper-dim);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}
.auth-switch-btn.is-active {
  background: var(--signal);
  color: #ffffff;
}

.auth-error {
  background: rgba(248, 113, 113, 0.06);
  border-left: 2px solid var(--danger);
  border-radius: 0 8px 8px 0;
  padding: 12px 14px;
  margin-bottom: 20px;
}
.auth-error-tag {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--danger);
  margin-bottom: 4px;
}
.auth-error p {
  margin: 0;
  font-size: 13px;
  color: rgba(232, 232, 240, 0.85);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--paper-dim);
}

.auth-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--ink-line);
  color: var(--paper);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  padding: 8px 2px;
  outline: none;
  transition: border-color 150ms ease;
}
.auth-input::placeholder {
  color: rgba(94, 94, 120, 0.6);
}
.auth-input:focus {
  border-bottom-color: var(--signal);
}

.auth-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  background: var(--signal);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 20px;
  cursor: pointer;
  transition: transform 150ms ease, background 150ms ease, opacity 150ms ease;
}
.auth-submit:hover {
  background: #7c4de8;
  transform: translateY(-1px);
}
.auth-submit:disabled {
  opacity: 0.6;
  cursor: default;
  transform: none;
}

.auth-footnote {
  text-align: center;
  font-size: 12px;
  color: var(--paper-dim);
  margin: 22px 0 0;
}
.auth-footnote-link {
  background: none;
  border: none;
  padding: 0;
  color: var(--signal);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}
.auth-footnote-link:hover {
  text-decoration: underline;
}

@media (max-width: 420px) {
  .auth-card { padding: 28px 22px 26px; }
  .auth-title { font-size: 26px; }
}
`;

export default Login;
