import React from "react"
export default function TagList({ title, items = [], variant = "" }) {
  return (
    <section className={`tag-section ${variant}`}>
      <h4>{title}</h4>
      <div className="tags">
        {items.length
          ? items.map((item, index) => <span className="tag" key={`${item}-${index}`}>{item}</span>)
          : <span className="muted">None detected</span>}
      </div>
    </section>
  );
}
