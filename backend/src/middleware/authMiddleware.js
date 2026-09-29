import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Authentication is required." });
  if (!process.env.JWT_SECRET) return res.status(500).json({ message: "Authentication is not configured on the server." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("_id name email picture");
    if (!user) return res.status(401).json({ message: "Your session is no longer valid. Please sign in again." });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Your session is invalid or expired. Please sign in again." });
  }
}
