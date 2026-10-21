import { partners } from "../data";

function Partners() {
  return (
    <section className="partners">
      <p>Built for small shops like</p>
      <div className="partner-row">
        {partners.map((name) => (
          <span key={name} className="partner">{name}</span>
        ))}
      </div>
    </section>
  );
}

export default Partners;
