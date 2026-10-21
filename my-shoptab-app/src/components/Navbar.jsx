import { useState } from "react";
import { brand, navLinks } from "../data";

function Navbar({ onGetStarted }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // The menu icon only shows on small screens
  return (
    <header className="navbar">
      <a href="#top" className="logo">{brand}</a>

      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>

      <button className="btn nav-btn" onClick={onGetStarted}>Get started</button>
      <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
    </header>
  );
}

export default Navbar;
