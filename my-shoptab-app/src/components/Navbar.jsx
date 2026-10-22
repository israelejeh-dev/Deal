import { useState } from "react";
import { brand, navLinks } from "../data";

function Navbar({ onGetStarted, onLogin, onSignup, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <a href="#top" className="logo">
        {brand}
      </a>

      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}

        {/* Mobile menu auth buttons */}
        <div className="mobile-auth-actions">
          {user ? (
            <>
              <div className="mobile-user-info">
                <span>Signed in as:</span>
                <strong>{user.displayName || user.email}</strong>
              </div>
              <button
                type="button"
                className="btn nav-btn"
                onClick={() => {
                  setMenuOpen(false);
                  onGetStarted();
                }}
              >
                Open ShopTab Notebook
              </button>
              <button
                type="button"
                className="btn-nav-logout"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-nav-login"
                onClick={() => {
                  setMenuOpen(false);
                  onLogin();
                }}
              >
                Log in
              </button>
              <button
                type="button"
                className="btn nav-btn"
                onClick={() => {
                  setMenuOpen(false);
                  onSignup();
                }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Desktop auth buttons */}
      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user-badge" title={user.email}>
              👤 {user.displayName || user.email?.split("@")[0] || "Shopkeeper"}
            </span>
            <button
              type="button"
              className="btn nav-btn"
              onClick={onGetStarted}
            >
              Open ShopTab
            </button>
            <button
              type="button"
              className="btn-nav-logout"
              onClick={onLogout}
              title="Sign out"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn-nav-login"
              onClick={onLogin}
            >
              Log in
            </button>
            <button
              type="button"
              className="btn nav-btn"
              onClick={onSignup}
            >
              Sign up
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </header>
  );
}

export default Navbar;
