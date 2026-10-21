function Hero({ onGetStarted }) {
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
          <button className="btn" onClick={onGetStarted}>Get started</button>
          <a href="#steps" className="btn btn-outline">See how it works</a>
        </div>
      </div>

      <div className="loan-card">
        <span className="pill">Sample customer</span>
        <p className="loan-label">Mrs. Adebayo owes</p>
        <p className="loan-amount">₦2,500</p>
        <div className="card-row"><span>Credit · Rice</span><span>+₦4,500</span></div>
        <div className="card-row"><span>Payment · Cash</span><span>-₦2,000</span></div>
        <button className="wa-btn" onClick={handleSampleReminder}>
          Send WhatsApp Reminder
        </button>
      </div>
    </section>
  );
}

export default Hero;
