import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function extractResumeText(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume file.",
      });
    }

    const file = req.file;

    let extractedText = "";

    // =========================
    // PDF
    // =========================
    if (file.mimetype === "application/pdf") {
      const parser = new PDFParse({
        data: file.buffer,
      });

      const result = await parser.getText();

      extractedText = result.text;

      await parser.destroy();
    }

    // =========================
    // DOCX
    // =========================
    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: file.buffer,
      });

      extractedText = result.value;
    }

    // =========================
    // Unsupported file
    // =========================
    else {
      return res.status(400).json({
        message: "Only PDF and DOCX files are supported.",
      });
    }

    // Clean extracted text
    extractedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!extractedText) {
      return res.status(400).json({
        message:
          "Could not extract text from this resume. Please upload a text-based PDF or DOCX file.",
      });
    }

    return res.status(200).json({
      message: "Resume uploaded and text extracted successfully.",
      fileName: file.originalname,
      resumeText: extractedText,
    });
  } catch (error) {
    console.error("Resume extraction error:", error);

    return res.status(500).json({
      message: "Failed to extract resume text.",
      error: error.message,
    });
  }
}