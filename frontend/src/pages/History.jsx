import React from "react"
import { useEffect, useState } from "react";
import api from "../api";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const { data } = await api.get("/analyze");
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    await api.delete(`/analyze/${id}`);
    setItems(items.filter(item => item._id !== id));
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <section className="hero compact">
        <p className="eyebrow">YOUR WORKSPACE</p>
        <h1>Analysis history</h1>
        <p>Review recent resume-to-job analyses stored in MongoDB.</p>
      </section>

      {loading ? <p className="muted">Loading...</p> : (
        <div className="history-list">
          {!items.length && <div className="panel"><p>No analyses yet. Run your first analysis.</p></div>}
          {items.map(item => (
            <article className="history-item" key={item._id}>
              <div>
                <strong>{item.candidateName}</strong>
                <p>{item.aiFeedback?.summary}</p>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
              <div className="history-actions">
                <b>{item.matchScore}%</b>
                <button onClick={() => remove(item._id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
