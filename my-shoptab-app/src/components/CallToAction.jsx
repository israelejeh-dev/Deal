function CallToAction({ onGetStarted, onSignup, onLogin, user }) {
  return (
    <section className="cta-wrap">
      <div className="cta">
        <h2>Ready to stop chasing debts?</h2>
        <p>Start your digital credit notebook today.</p>

        {user ? (
          <button type="button" className="btn" onClick={onGetStarted}>
            Open ShopTab Notebook →
          </button>
        ) : (
          <div className="cta-buttons">
            <button
              type="button"
              className="btn"
              onClick={onSignup}
              title="Create your account"
            >
              Sign up for free
            </button>
            <button
              type="button"
              className="btn btn-outline cta-login-btn"
              onClick={onLogin}
              title="Log in to existing shop"
            >
              Log in to your shop
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default CallToAction;
