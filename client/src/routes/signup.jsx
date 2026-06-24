import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, User, Mail, Phone, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader } from "../components/PageHeader.jsx";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const { user, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    const result = await signup(name, email, password, phone);
    if (!result.success) {
      setError(result.error || "Failed to register. Please check details.");
      setLoading(false);
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Authentication"
        title={<>CREATE <span className="text-cyan-glow">ACCOUNT</span></>}
        description="Register to bookmark favorite listings, inquire on assets, and sell your vehicles."
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
              Get Started
            </h2>
            <p className="text-xs text-white/50 mt-1">Create your account to unlock premium marketplace access</p>
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
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-12"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

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
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input pl-12"
                  placeholder="+1 (555) 012-3456"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60">
                Password
              </label>
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

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>Registering...</span>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-xs text-white/40">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-cyan-glow hover:underline ml-1">
                Log in here
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
