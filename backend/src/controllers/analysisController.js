import Analysis from "../models/Analysis.js";
import { calculateMatch } from "../utils/matcher.js";
import { generateAIAnalysis } from "../services/gemini.js";

export async function createAnalysis(req, res) {
  try {
    const { candidateName, resumeText, jobDescription } = req.body;

    if (!resumeText?.trim() || !jobDescription?.trim()) {
      return res.status(400).json({
        message: "Resume text and job description are required."
      });
    }

    const match = calculateMatch(resumeText, jobDescription);

    const aiFeedback = await generateAIAnalysis({
      resumeText,
      jobDescription,
      matchScore: match.score,
      matchedKeywords: match.matchedKeywords,
      missingKeywords: match.missingKeywords
    });

    const analysis = await Analysis.create({
      candidateName: candidateName?.trim() || "Student",
      resumeText,
      jobDescription,
      matchScore: match.score,
      matchedKeywords: match.matchedKeywords,
      missingKeywords: match.missingKeywords,
      aiFeedback
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Analysis failed.",
      error: error.message
    });
  }
}

export async function getAnalyses(req, res) {
  try {
    const analyses = await Analysis.find()
      .select("candidateName matchScore matchedKeywords missingKeywords aiFeedback.summary createdAt")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch analysis history." });
  }
}

export async function getAnalysisById(req, res) {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ message: "Analysis not found." });
    res.json(analysis);
  } catch {
    res.status(400).json({ message: "Invalid analysis id." });
  }
}

export async function deleteAnalysis(req, res) {
  try {
    const deleted = await Analysis.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Analysis not found." });
    res.json({ message: "Analysis deleted." });
  } catch {
    res.status(400).json({ message: "Invalid analysis id." });
  }
}
