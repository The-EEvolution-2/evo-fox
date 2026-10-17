"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, KeyRound, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export const AuthView: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/user-not-found") || msg.includes("auth/wrong-password")) {
        setError("Invalid email or password. Please check and retry.");
      } else if (msg.includes("auth/email-already-in-use")) {
        setError("An account already exists with this email. Try logging in.");
      } else if (msg.includes("auth/weak-password")) {
        setError("Password should be at least 6 characters.");
      } else {
        setError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google authentication failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col justify-center items-center p-4 selection:bg-[#18181B] selection:text-white">
      <div className="w-full max-w-md bg-white border border-[#E4E4E7] shadow-xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center p-1 shadow-xs border border-blue-200">
            <img src="/logo.png" alt="EVOFOX Logo" className="w-10 h-10 object-contain rounded-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#09090B]">EVOFOX</h1>
            <p className="text-xs text-[#71717A]">
              Personal Academic OS & Management Suite
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-[#FAFAFA] border border-[#E4E4E7] p-3 flex items-start gap-2.5 text-xs text-[#71717A]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            This workspace is private and secured by Firebase Auth. Only authenticated owner credentials can access personal notes, finances, and data.
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#09090B] text-[#09090B]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#09090B] text-[#09090B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-9 bg-[#18181B] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSignUp ? "Create Workspace Account" : "Access Workspace"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E4E4E7] w-full" />
          <span className="bg-white px-2 text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider absolute">
            Or
          </span>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={submitting}
          type="button"
          className="w-full h-9 border border-[#E4E4E7] hover:bg-[#FAFAFA] text-[#09090B] text-xs font-medium flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle sign in / sign up */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            type="button"
            className="text-xs text-[#2563EB] hover:underline font-medium"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account yet? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
