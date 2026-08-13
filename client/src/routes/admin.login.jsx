import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Portal Sign In — NexRide X" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        setError("Access Denied: Your account does not have administrator privileges.");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Invalid credentials. Administrator authentication failed.");
      setLoading(false);
    } else {
      // Check user role from localStorage or response
      const savedUser = JSON.parse(localStorage.getItem("nexride_user") || "{}");
      if (savedUser.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        setError("Forbidden: Account does not possess Admin privileges.");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Administrator Security Portal"
        title={<>ADMIN <span className="text-cyan-glow">CONSOLE</span></>}
        description="Authorized entry point for NexRide X platform administration."
      />

      <section className="mx-auto max-w-md px-6 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-morph rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-cyan-glow/20 bg-neutral-950/80"
        >
          {/* Cyan Glow Top Highlight */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-glow to-transparent shadow-[0_0_15px_#00f2ff]"></div>

          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow">
              <Shield size={28} />
            </div>
            <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Administrator Login
            </h2>
            <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400"
            >
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexride.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm text-white placeholder-white/30 focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-all"
                />
                <Mail size={16} className="absolute left-4 top-3.5 text-white/40" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm text-white placeholder-white/30 focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-all"
                />
                <Lock size={16} className="absolute left-4 top-3.5 text-white/40" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-glow py-3.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-white active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.3)] mt-6"
            >
              {loading ? "Authenticating..." : "Sign In to Admin Console"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => navigate({ to: "/" })}
              className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-cyan-glow transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Return to Customer Marketplace</span>
            </button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
