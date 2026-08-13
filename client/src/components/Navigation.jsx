import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Cars" },
  { to: "/bikes", label: "Bikes" },
  { to: "/jets", label: "Private Jets" },
  { to: "/ships", label: "Ships & Yachts" },
  { to: "/compare", label: "Compare" },
  { to: "/dealers", label: "Dealers" },
  { to: "/sell", label: "Sell" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/contact", label: "Contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 z-50 w-full px-4 py-4 sm:px-8 sm:py-6"
    >
      <div className="glass-morph mx-auto flex max-w-7xl items-center justify-between rounded-full px-6 py-3 sm:px-8 sm:py-4">
        <Link to="/" className="font-display text-xl font-bold tracking-tighter sm:text-2xl">
          <span className="text-cyan-glow">NEX</span>RIDE
          <span className="ml-1 text-[10px] font-light tracking-[0.3em] text-white/40">X</span>
        </Link>
        
        <div className="hidden gap-7 text-[11px] font-medium uppercase tracking-widest text-white/70 xl:flex">
          {links.slice(1, 7).map((l) => (
            <Link key={l.to} to={l.to} className="premium-hover-nav" activeProps={{ className: "text-cyan-glow" }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 sm:flex">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-full border border-cyan-glow/40 bg-cyan-glow/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-glow hover:bg-cyan-glow hover:text-black transition-all"
            >
              <Shield size={12} />
              <span>Admin Console</span>
            </Link>
          )}

          <Link to={user ? "/dashboard" : "/login"} className="premium-hover-nav text-[11px] font-medium uppercase tracking-widest text-white/70">
            {user ? "Portal" : "Sign In"}
          </Link>
          
          <Link to="/sell" className="rounded-full bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-black premium-hover-btn">
            Sell Vehicle
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="sm:hidden text-white" aria-label="menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morph mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-2xl p-4 sm:hidden bg-neutral-950/90"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-wider text-white/80 hover:bg-white/5 hover:text-cyan-glow"
            >
              {l.label}
            </Link>
          ))}
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider text-cyan-glow bg-cyan-glow/10"
            >
              <Shield size={16} />
              <span>Admin Console</span>
            </Link>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
