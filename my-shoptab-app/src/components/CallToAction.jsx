function CallToAction({ onGetStarted }) {
  return (
    <section className="cta-wrap">
      <div className="cta">
        <h2>Ready to stop chasing debts?</h2>
        <p>Start your digital credit notebook today.</p>
        <button className="btn" onClick={onGetStarted}>Get started</button>
      </div>
    </section>
  );
}

export default CallToAction;
