import { Router } from "express";
import {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
} from "../controllers/analysisController.js";

const router = Router();

router.post("/", createAnalysis);
router.get("/", getAnalyses);
router.get("/:id", getAnalysisById);
router.delete("/:id", deleteAnalysis);

export default router;
