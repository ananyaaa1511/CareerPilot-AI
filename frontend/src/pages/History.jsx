import React from "react"
import { useEffect, useState } from "react";
import api from "../api";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const { data } = await api.get("/analyze");
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your analysis history.");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/analyze/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this analysis.");
    }
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
          {error && <div className="error-message">{error}</div>}
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
