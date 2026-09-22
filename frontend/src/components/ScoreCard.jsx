import React from "react"
export default function ScoreCard({ score }) {
  return (
    <div className="score-card">
      <div className="score-ring" style={{ "--score": `${score * 3.6}deg` }}>
        <strong>{score}%</strong>
      </div>
      <div>
        <h3>Resume Match</h3>
        <p>Based on relevant terms found in the job description.</p>
      </div>
    </div>
  );
}
