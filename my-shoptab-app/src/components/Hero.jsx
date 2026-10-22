function Hero({ onGetStarted, onSignup, onLogin, user }) {
  // Opens WhatsApp with a demo reminder message to show how it works
  function handleSampleReminder() {
    const message = encodeURIComponent(
      "Hello Mrs. Adebayo, this is a polite reminder from ShopTab that your current balance is ₦2,500. Please settle it when you can. Thank you!"
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  }

  return (
    <section className="hero">
      <div className="hero-text">
        <p className="eyebrow">Debt tracker for shopkeepers</p>
        <h1>Know who owes you, and get paid on time.</h1>
        <p className="hero-sub">
          Track credits, record payments and send WhatsApp reminders in a few taps.
        </p>

        <div className="hero-buttons">
          {user ? (
            <>
              <button type="button" className="btn" onClick={onGetStarted}>
                Open ShopTab Notebook →
              </button>
              <a href="#steps" className="btn btn-outline">
                See how it works
              </a>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn"
                onClick={onSignup}
                title="Create free shop account"
              >
                Sign up for free
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={onLogin}
                title="Sign in to your shop"
              >
                Log in
              </button>
              <a href="#steps" className="btn btn-outline">
                See how it works
              </a>
            </>
          )}
        </div>

        <p className="hero-note">
          ✓ 100% Free &bull; No credit card required
        </p>

      </div>

      <div className="loan-card">
        <span className="pill">Sample customer</span>
        <p className="loan-label">Mrs. Adebayo owes</p>
        <p className="loan-amount">₦2,500</p>
        <div className="card-row">
          <span>Credit · Rice</span>
          <span>+₦4,500</span>
        </div>
        <div className="card-row">
          <span>Payment · Cash</span>
          <span>-₦2,000</span>
        </div>
        <button
          type="button"
          className="wa-btn"
          onClick={handleSampleReminder}
        >
          Send WhatsApp Reminder
        </button>
      </div>
    </section>
  );
}

export default Hero;
