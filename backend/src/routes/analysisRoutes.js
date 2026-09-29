import { Router } from "express";
import {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis
} from "../controllers/analysisController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);
router.post("/", createAnalysis);
router.get("/", getAnalyses);
router.get("/:id", getAnalysisById);
router.delete("/:id", deleteAnalysis);

export default router;
