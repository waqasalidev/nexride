import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Authentication"
        title={<>ACCESS <span className="text-cyan-glow">PORTAL</span></>}
        description="Sign in to manage your collection, inquiries, and listings."
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

          <div className="text-center mb-8">
            <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Welcome Back
            </h2>
            <p className="text-xs text-white/50 mt-1">Enter your credentials to access your portal</p>
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold uppercase tracking-widest text-cyan-glow hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-12"
                  placeholder="••••••••"
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
                <span>Verifying...</span>
              ) : (
                <>
                  <LogIn size={14} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-white/40">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-cyan-glow hover:underline ml-1">
                Register here
              </Link>
            </p>
          </div>
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
