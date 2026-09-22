import { GoogleGenAI } from "@google/genai";

export async function generateAIAnalysis({ resumeText, jobDescription, matchScore, matchedKeywords, missingKeywords }) {
  if (!process.env.GEMINI_API_KEY) {
    return {
      summary: "AI feedback is unavailable because GEMINI_API_KEY is not configured.",
      strengths: matchedKeywords.slice(0, 5).map(k => `Resume mentions ${k}.`),
      missingSkills: missingKeywords.slice(0, 8),
      suggestions: [
        "Add measurable outcomes to important project bullets.",
        "Use job-relevant keywords only when they genuinely match your experience.",
        "Keep the resume concise and focused on the target role."
      ],
      interviewTopics: missingKeywords.slice(0, 6)
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
You are a career assistant for a computer science student.

Analyze this resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Keyword match score from the application: ${matchScore}%
Matched keywords: ${matchedKeywords.join(", ")}
Potentially missing keywords: ${missingKeywords.join(", ")}

Return ONLY valid JSON with this exact shape:
{
  "summary": "short paragraph",
  "strengths": ["3-5 concise points"],
  "missingSkills": ["5-8 skills or concepts"],
  "suggestions": ["5 practical resume/job-preparation suggestions"],
  "interviewTopics": ["5-7 technical topics to prepare"]
}

Do not invent experience. If a skill is missing from the resume, describe it as a gap rather than claiming the candidate has it.
`;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json"
    }
  });

  const text = response.text?.trim() || "{}";
  return JSON.parse(text);
}
