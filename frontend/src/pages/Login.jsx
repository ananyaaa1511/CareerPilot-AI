import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleButtonWidth, setGoogleButtonWidth] = useState(() => Math.min(320, Math.max(220, window.innerWidth - 80)));
  const destination = location.state?.from?.pathname || "/";

  useEffect(() => {
    const updateGoogleButtonWidth = () => setGoogleButtonWidth(Math.min(320, Math.max(220, window.innerWidth - 80)));
    window.addEventListener("resize", updateGoogleButtonWidth);
    return () => window.removeEventListener("resize", updateGoogleButtonWidth);
  }, []);

  async function handleSuccess(credentialResponse) {
    if (!credentialResponse.credential) {
      setError("Google did not return a valid sign-in credential.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const session = await signInWithGoogle(credentialResponse.credential);
      login(session);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "We could not sign you in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-mark">CP</div>
        <p className="eyebrow">WELCOME TO CAREERPILOT AI</p>
        <h1>Make every application count.</h1>
        <p>AI-powered resume and job analysis, kept private to your workspace.</p>
        <div className="google-login-wrap">
          <GoogleLogin onSuccess={handleSuccess} onError={() => setError("Google sign-in was cancelled or unavailable. Please try again.")} text="continue_with" theme="outline" size="large" width={googleButtonWidth} />
        </div>
        {loading && <p className="muted">Signing you in securely…</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
