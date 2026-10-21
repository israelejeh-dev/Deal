import { features } from "../data";

function Features() {
  return (
    <section className="section" id="features">
      <h2 className="section-title">Why shopkeepers choose ShopTab</h2>
      <div className="feature-grid">
        {features.map((item) => (
          <div key={item.number} className="feature">
            <span className="feature-number">{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
