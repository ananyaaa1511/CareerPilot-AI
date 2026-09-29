import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const googleClient = new OAuth2Client();

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, picture: user.picture };
}

export async function googleSignIn(req, res) {
  const { credential } = req.body;

  if (!credential || typeof credential !== "string") {
    return res.status(400).json({ message: "A Google sign-in credential is required." });
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
    console.error("Google authentication environment variables are missing.");
    return res.status(500).json({ message: "Authentication is not configured on the server." });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      return res.status(401).json({ message: "Your Google account could not be verified." });
    }

    const profile = {
      googleId: payload.sub,
      name: payload.name || payload.email.split("@")[0],
      email: payload.email,
      picture: payload.picture || "",
    };

    let user = await User.findOne({ googleId: profile.googleId });
    if (user) {
      user.name = profile.name;
      user.email = profile.email;
      user.picture = profile.picture;
      await user.save();
    } else {
      user = await User.findOneAndUpdate(
        { email: profile.email },
        profile,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: publicUser(user) });
  } catch (error) {
    if (error?.name === "TokenExpiredError" || error?.message?.toLowerCase().includes("token")) {
      return res.status(401).json({ message: "Your Google sign-in session is invalid or expired. Please try again." });
    }
    console.error("Google sign-in failed:", error.message);
    return res.status(500).json({ message: "Unable to sign in right now. Please try again." });
  }
}
