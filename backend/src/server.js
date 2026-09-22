import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import analysisRoutes from "./routes/analysisRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "CareerPilot AI API" });
});

app.use("/api/analyze", analysisRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
