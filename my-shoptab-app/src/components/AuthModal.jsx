import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import { getFriendlyErrorMessage } from "../auth/authHelpers";
import "../styles/AuthModal.css";

function AuthModal({ initialMode = "login", onClose, onSuccess }) {
  const [isSignup, setIsSignup] = useState(initialMode === "signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();


  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="auth-modal-header">
          <span className="auth-modal-brand">📒 ShopTab</span>
          <h2 className="auth-modal-title">
            {isSignup ? "Create your shop account" : "Welcome back"}
          </h2>
          <p className="auth-modal-sub">
            {isSignup
              ? "Track debts, log payments, and get paid on time."
              : "Sign in to access your digital credit notebook."}
          </p>
        </div>

        {/* Tab switch */}
        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn ${!isSignup ? "active" : ""}`}
            onClick={() => {
              setIsSignup(false);
              setError("");
            }}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isSignup ? "active" : ""}`}
            onClick={() => {
              setIsSignup(true);
              setError("");
            }}
          >
            Sign up
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-name">
                Shop or Owner Name
              </label>
              <input
                id="auth-name"
                type="text"
                className="auth-input"
                placeholder="e.g. Mama Chidi Provision Store"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus={isSignup}
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              className="auth-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={!isSignup}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="auth-input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        <div className="auth-footer-toggle">
          {isSignup ? (
            <>
              Already have an account?
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setIsSignup(false);
                  setError("");
                }}
              >
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account yet?
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setIsSignup(true);
                  setError("");
                }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
