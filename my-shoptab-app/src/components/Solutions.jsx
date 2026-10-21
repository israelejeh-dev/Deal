import { useState } from "react";
import { solutions } from "../data";

function Solutions() {
  const [active, setActive] = useState(0);
  const current = solutions[active];

  // Clicking a tab swaps the content on the right
  return (
    <section className="section" id="solutions">
      <h2 className="section-title">Everything you need, nothing extra</h2>

      <div className="tabs-layout">
        <div className="tab-list">
          {solutions.map((item, index) => (
            <button
              key={item.tab}
              className={index === active ? "tab active" : "tab"}
              onClick={() => setActive(index)}
            >
              {item.tab}
            </button>
          ))}
        </div>

        <div className="tab-panel">
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <ul>
            {current.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Solutions;
