import { steps } from "../data";

function Steps() {
  return (
    <section className="section steps" id="steps">
      <h2 className="section-title">How it works</h2>
      <div className="step-row">
        {steps.map((step, index) => (
          <div key={step.title} className="step">
            <span className="step-circle">{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Steps;
