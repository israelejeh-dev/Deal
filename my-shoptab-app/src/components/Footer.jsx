import { brand, footerColumns } from "../data";

function Footer() {
  // Smoothly scrolls back to the top of the page
  function goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="footer-logo">{brand}</p>
          <p>Simple funding for growing businesses.</p>
        </div>

        <div className="footer-columns">
          {footerColumns.map((column) => (
            <div key={column.title} className="footer-column">
              <p className="footer-heading">{column.title}</p>
              {column.links.map((link) => (
                <a key={link} href="#top">{link}</a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {brand}. All rights reserved</p>
        <button className="top-btn" onClick={goToTop}>↑ Back to top</button>
      </div>
    </footer>
  );
}

export default Footer;
