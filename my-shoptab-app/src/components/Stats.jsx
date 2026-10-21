import { stats } from "../data";

function Stats() {
  // Edit these facts in data.js
  return (
    <section className="stats">
      {stats.map((stat) => (
        <div key={stat.label} className="stat">
          <h3>{stat.number}</h3>
          <p>{stat.label}</p>
        </div>
      ))}
    </section>
  );
}

export default Stats;
