import React, { useEffect, useState } from "react";
import api from "../api";
import ScoreCard from "../components/ScoreCard";
import TagList from "../components/TagList";

const initialForm = {
  candidateName: "",
  resumeText: "",
  jobDescription: ""
};

export default function Analyze() {
  const [form, setForm] = useState(() => {
    const savedForm = localStorage.getItem("careerpilot-form");
    return savedForm ? JSON.parse(savedForm) : initialForm;
  });

  const [result, setResult] = useState(() => {
    const savedResult = localStorage.getItem("careerpilot-result");
    return savedResult ? JSON.parse(savedResult) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Save form whenever it changes
  useEffect(() => {
    localStorage.setItem("careerpilot-form", JSON.stringify(form));
  }, [form]);

  // Save result whenever it changes
  useEffect(() => {
    if (result) {
      localStorage.setItem("careerpilot-result", JSON.stringify(result));
    }
  }, [result]);

  function update(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/analyze", form);

      setResult(data);

      // Save latest analysis
      localStorage.setItem(
        "careerpilot-result",
        JSON.stringify(data)
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not analyze the resume."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="eyebrow">AI CAREER ASSISTANT</p>

        <h1>
          Turn your resume into a <span>job-ready</span> application.
        </h1>

        <p>
          Paste your resume and a job description. CareerPilot combines
          keyword analysis with Gemini-powered feedback to show what to improve.
        </p>
      </section>

      <form className="analysis-grid" onSubmit={handleSubmit}>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Your Resume</h2>
              <p>Paste the text from your resume.</p>
            </div>
          </div>

          <input
            value={form.candidateName}
            onChange={e =>
              update("candidateName", e.target.value)
            }
            placeholder="Candidate name (optional)"
          />

          <textarea
            required
            value={form.resumeText}
            onChange={e =>
              update("resumeText", e.target.value)
            }
            placeholder="Example: B.Tech IT student with experience in React, Node.js, MongoDB..."
          />
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Job Description</h2>
              <p>Paste the target role description.</p>
            </div>
          </div>

          <textarea
            required
            value={form.jobDescription}
            onChange={e =>
              update("jobDescription", e.target.value)
            }
            placeholder="Example: We are looking for a software engineering intern with React, Node.js..."
          />
        </div>

        <button
          className="primary-btn analyze-btn"
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Analyze with AI →"}
        </button>

      </form>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {result && (
        <section className="results">

          <div className="results-header">
            <div>
              <p className="eyebrow">
                ANALYSIS COMPLETE
              </p>

              <h2>
                Application insights
              </h2>
            </div>

            <ScoreCard score={result.matchScore} />
          </div>

          <div className="result-grid">

            <div className="panel">
              <h3>AI Summary</h3>

              <p>
                {result.aiFeedback?.summary}
              </p>

              <TagList
                title="Matched keywords"
                items={result.matchedKeywords}
              />

              <TagList
                title="Potential gaps"
                items={result.missingKeywords}
                variant="warning"
              />
            </div>

            <div className="panel">
              <h3>What to improve</h3>

              <ul className="insight-list">
                {(result.aiFeedback?.suggestions || [])
                  .map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
              </ul>
            </div>

            <div className="panel">
              <h3>Strengths</h3>

              <ul className="insight-list">
                {(result.aiFeedback?.strengths || [])
                  .map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
              </ul>
            </div>

            <div className="panel">
              <h3>Interview preparation</h3>

              <ul className="insight-list">
                {(result.aiFeedback?.interviewTopics || [])
                  .map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
              </ul>
            </div>

          </div>
        </section>
      )}
    </div>
  );
}