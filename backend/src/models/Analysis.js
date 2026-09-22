import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    candidateName: { type: String, default: "Student" },
    resumeText: { type: String, required: true },
    jobDescription: { type: String, required: true },
    matchScore: { type: Number, required: true },
    matchedKeywords: [String],
    missingKeywords: [String],
    aiFeedback: {
      summary: String,
      strengths: [String],
      missingSkills: [String],
      suggestions: [String],
      interviewTopics: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
