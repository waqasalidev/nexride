import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Check, AlertCircle } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit recovery request");
      }

      setSubmitted(true);
      setMessage(data.message || "Password recovery instructions sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Authentication"
        title={<>PASSWORD <span className="text-cyan-glow">RECOVERY</span></>}
        description="Reset your password to regain access to your NexRide portal."
      />

      <section className="mx-auto max-w-md px-6 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-morph rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Cyan Glow Top Highlight */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-glow to-transparent shadow-[0_0_15px_#00f2ff]"></div>

          {submitted ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-cyan-glow text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                <Check size={28} />
              </div>
              <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                Request Sent
              </h2>
              <p className="text-xs text-white/60 mt-3 leading-relaxed">
                {message}
              </p>
              <div className="mt-8 border-t border-white/5 pt-6">
                <Link to="/login" className="rounded-xl border border-white/10 hover:border-cyan-glow px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-cyan-glow inline-block">
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                  Reset Password
                </h2>
                <p className="text-xs text-white/50 mt-1">
                  Enter your registered email and we'll send you recovery details
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-12"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-glow py-4 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Recovery Link</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-xs text-white/40">
                  Remember your password?{" "}
                  <Link to="/login" className="font-bold text-cyan-glow hover:underline ml-1">
                    Log in here
                  </Link>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </section>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus { 
          border-color: var(--cyan-glow);
          box-shadow: 0 0 10px rgba(0, 242, 255, 0.1);
        }
      `}</style>
    </>
  );
}
