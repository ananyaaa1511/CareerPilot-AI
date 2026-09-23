import React, { useEffect, useState } from "react";
import { uploadResume, analyzeResume } from "../api";
import "./Analyze.css";

const STORAGE_KEY = "careerPilotAnalysis";

function Analyze() {
  const [candidateName, setCandidateName] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeText, setResumeText] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [result, setResult] = useState(null);

  // --------------------------------------------------
  // RESTORE PREVIOUS DATA WHEN PAGE OPENS
  // --------------------------------------------------

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);

      if (!savedData) {
        return;
      }

      const data = JSON.parse(savedData);

      setCandidateName(data.candidateName || "");
      setResumeFileName(data.resumeFileName || "");
      setResumeText(data.resumeText || "");
      setJobDescription(data.jobDescription || "");
      setResult(data.result || null);

      if (data.resumeText || data.result) {
        setSuccess("Previous analysis restored.");
      }
    } catch (error) {
      console.error("Failed to restore saved analysis:", error);

      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // --------------------------------------------------
  // SAVE DATA TO LOCAL STORAGE
  // --------------------------------------------------

  useEffect(() => {
    // Don't create an empty localStorage entry when
    // the user has not entered anything yet.

    if (
      !candidateName &&
      !resumeFileName &&
      !resumeText &&
      !jobDescription &&
      !result
    ) {
      return;
    }

    const dataToSave = {
      candidateName,
      resumeFileName,
      resumeText,
      jobDescription,
      result,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(dataToSave)
    );
  }, [
    candidateName,
    resumeFileName,
    resumeText,
    jobDescription,
    result,
  ]);

  // --------------------------------------------------
  // UPLOAD RESUME
  // --------------------------------------------------

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");
    setResult(null);

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file.");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Resume file must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
    setResumeText("");
    setUploading(true);

    try {
      const data = await uploadResume(file);

      if (!data.resumeText) {
        throw new Error(
          "No text could be extracted from the resume."
        );
      }

      setResumeText(data.resumeText);

      setSuccess(
        "Resume uploaded and read successfully."
      );
    } catch (err) {
      console.error("Resume upload error:", err);

      setResumeFile(null);
      setResumeFileName("");
      setResumeText("");

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload and read the resume."
      );

      event.target.value = "";
    } finally {
      setUploading(false);
    }
  };

  // --------------------------------------------------
  // REMOVE RESUME
  // --------------------------------------------------

  const removeResume = () => {
    setResumeFile(null);
    setResumeFileName("");
    setResumeText("");
    setResult(null);
    setSuccess("");
    setError("");

    const fileInput =
      document.getElementById("resume-upload");

    if (fileInput) {
      fileInput.value = "";
    }

    // Remove saved resume and result
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        const updatedData = {
          ...data,
          resumeFileName: "",
          resumeText: "",
          result: null,
        };

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updatedData)
        );
      } catch (error) {
        console.error(
          "Failed to update saved data:",
          error
        );
      }
    }
  };

  // --------------------------------------------------
  // START NEW ANALYSIS
  // --------------------------------------------------

  const startNewAnalysis = () => {
    setCandidateName("");
    setResumeFile(null);
    setResumeFileName("");
    setResumeText("");
    setJobDescription("");
    setResult(null);
    setError("");
    setSuccess("");

    const fileInput =
      document.getElementById("resume-upload");

    if (fileInput) {
      fileInput.value = "";
    }

    localStorage.removeItem(STORAGE_KEY);
  };

  // --------------------------------------------------
  // ANALYZE RESUME
  // --------------------------------------------------

  const handleAnalyze = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setResult(null);

    if (!resumeText) {
      setError("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    setAnalyzing(true);

    try {
      const data = await analyzeResume({
        candidateName:
          candidateName.trim() || "Student",
        resumeText,
        jobDescription,
      });

      console.log("Analysis result:", data);

      setResult(data);

      setSuccess(
        "Resume analysis completed successfully."
      );
    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to analyze the resume."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="analyze-page">
      <div className="analyze-container">

        {/* HEADER */}
        <div className="analyze-header">
          <h1>CareerPilot AI</h1>

          <p>
            Upload your resume and compare it with a job
            description using AI-powered resume analysis.
          </p>
        </div>

        <form onSubmit={handleAnalyze}>

          {/* CANDIDATE NAME */}
          <div className="form-group">
            <label htmlFor="candidateName">
              Candidate Name
            </label>

            <input
              id="candidateName"
              type="text"
              placeholder="Enter your name"
              value={candidateName}
              onChange={(e) =>
                setCandidateName(e.target.value)
              }
            />
          </div>

          {/* RESUME UPLOAD */}
          <div className="form-group">
            <label htmlFor="resume-upload">
              Upload Resume
            </label>

            <div className="upload-box">

              {!resumeFileName ? (
                <>
                  <div className="upload-icon">
                    📄
                  </div>

                  <h3>Upload your resume</h3>

                  <p>
                    PDF or DOCX files only
                    <br />
                    Maximum size: 5 MB
                  </p>

                  <label
                    htmlFor="resume-upload"
                    className="upload-button"
                  >
                    Choose Resume
                  </label>

                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    hidden
                  />
                </>
              ) : (
                <div className="uploaded-file">

                  <div className="file-icon">
                    📄
                  </div>

                  <div className="file-info">
                    <strong>
                      {resumeFileName}
                    </strong>

                    <span>
                      {resumeFile
                        ? `${(
                            resumeFile.size /
                            1024 /
                            1024
                          ).toFixed(2)} MB`
                        : "Previously uploaded"}
                    </span>
                  </div>

                  {uploading ? (
                    <span className="upload-status">
                      Reading...
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="remove-button"
                      onClick={removeResume}
                    >
                      Remove
                    </button>
                  )}

                </div>
              )}

            </div>
          </div>

          {/* JOB DESCRIPTION */}
          <div className="form-group">
            <label htmlFor="jobDescription">
              Job Description
            </label>

            <textarea
              id="jobDescription"
              rows="12"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(e.target.value)
              }
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {/* ANALYZE BUTTON */}
          <button
            type="submit"
            className="analyze-button"
            disabled={
              uploading ||
              analyzing ||
              !resumeText ||
              !jobDescription.trim()
            }
          >
            {analyzing
              ? "Analyzing..."
              : uploading
              ? "Reading Resume..."
              : "Analyze Resume"}
          </button>

        </form>

        {/* RESULT */}
        {result && (
          <div className="result-section">

            <div className="result-header">
              <h2>Analysis Result</h2>

              <button
                type="button"
                className="new-analysis-button"
                onClick={startNewAnalysis}
              >
                New Analysis
              </button>
            </div>

            {/* SCORE */}
            {result.matchScore !== undefined && (
              <div className="score">
                Match Score: {result.matchScore}%
              </div>
            )}

            {/* MATCHED KEYWORDS */}
            {Array.isArray(result.matchedKeywords) &&
              result.matchedKeywords.length > 0 && (
                <div className="result-box">

                  <h3>Matched Skills</h3>

                  <div className="tags">
                    {result.matchedKeywords.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="tag matched"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>

                </div>
              )}

            {/* MISSING KEYWORDS */}
            {Array.isArray(result.missingKeywords) &&
              result.missingKeywords.length > 0 && (
                <div className="result-box">

                  <h3>Missing Skills</h3>

                  <div className="tags">
                    {result.missingKeywords.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="tag missing"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>

                </div>
              )}

            {/* AI FEEDBACK */}
            {result.aiFeedback && (
              <div className="result-box">

                <h3>AI Feedback</h3>

                {/* SUMMARY */}
                {result.aiFeedback.summary && (
                  <div className="feedback-section">

                    <h4>Summary</h4>

                    <p>
                      {result.aiFeedback.summary}
                    </p>

                  </div>
                )}

                {/* STRENGTHS */}
                {Array.isArray(
                  result.aiFeedback.strengths
                ) &&
                  result.aiFeedback.strengths.length >
                    0 && (
                    <div className="feedback-section">

                      <h4>Strengths</h4>

                      <ul>
                        {result.aiFeedback.strengths.map(
                          (strength, index) => (
                            <li key={index}>
                              {strength}
                            </li>
                          )
                        )}
                      </ul>

                    </div>
                  )}

                {/* MISSING SKILLS */}
                {Array.isArray(
                  result.aiFeedback.missingSkills
                ) &&
                  result.aiFeedback.missingSkills.length >
                    0 && (
                    <div className="feedback-section">

                      <h4>Skills to Improve</h4>

                      <ul>
                        {result.aiFeedback.missingSkills.map(
                          (skill, index) => (
                            <li key={index}>
                              {skill}
                            </li>
                          )
                        )}
                      </ul>

                    </div>
                  )}

                {/* SUGGESTIONS */}
                {Array.isArray(
                  result.aiFeedback.suggestions
                ) &&
                  result.aiFeedback.suggestions.length >
                    0 && (
                    <div className="feedback-section">

                      <h4>Suggestions</h4>

                      <ul>
                        {result.aiFeedback.suggestions.map(
                          (suggestion, index) => (
                            <li key={index}>
                              {suggestion}
                            </li>
                          )
                        )}
                      </ul>

                    </div>
                  )}

                {/* INTERVIEW TOPICS */}
                {Array.isArray(
                  result.aiFeedback.interviewTopics
                ) &&
                  result.aiFeedback.interviewTopics.length >
                    0 && (
                    <div className="feedback-section">

                      <h4>Interview Topics</h4>

                      <ul>
                        {result.aiFeedback.interviewTopics.map(
                          (topic, index) => (
                            <li key={index}>
                              {topic}
                            </li>
                          )
                        )}
                      </ul>

                    </div>
                  )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Analyze;