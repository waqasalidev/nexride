import { motion } from "framer-motion";
import heroImg from "@/assets/hero.jpg";
export function Hero() {
    return (<section className="hero-gradient relative flex h-screen min-h-[760px] flex-col items-center justify-center overflow-hidden">
      <motion.div initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 0.55 }} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 z-0">
        <img src={heroImg} alt="Hypercar driving on neon highway with private jet overhead" width={1920} height={1080} className="h-full w-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian"/>
      </motion.div>

      {/* animated scan line */}
      <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute top-0 z-0 h-px w-1/3 bg-gradient-to-r from-transparent via-cyan-glow to-transparent opacity-60"/>

      <div className="relative z-10 space-y-6 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-block rounded-full border border-cyan-glow/30 bg-cyan-glow/5 px-4 py-1 backdrop-blur">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-glow">
            Beyond Velocity
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="font-display text-6xl font-bold leading-[0.95] tracking-tighter sm:text-7xl lg:text-9xl">
          THE APEX
          <br />
          <span className="bg-gradient-to-r from-white to-white/30 bg-clip-text text-transparent">
            MARKETPLACE
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mx-auto max-w-xl text-sm leading-relaxed tracking-wide text-white/60">
          Acquire the world's most exclusive hypercars, custom superbikes, and executive private jets
          in a single unified ecosystem.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="flex flex-wrap justify-center gap-4 pt-6">
          <a href="#featured" className="rounded-full bg-cyan-glow px-10 py-4 text-xs font-bold uppercase tracking-widest text-black premium-hover-btn">
            Explore Collection
          </a>
          <a href="#3d" className="rounded-full border border-white/20 px-10 py-4 text-xs font-bold uppercase tracking-widest text-white premium-hover-btn">
            Virtual Gallery
          </a>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }} className="absolute bottom-12 z-10 flex w-full max-w-5xl justify-between border-t border-white/10 px-8 pt-8">
        {[
            { v: "1.2k+", l: "Active Listings" },
            { v: "$4.8B", l: "Inventory Value" },
            { v: "0.02s", l: "Inquiry Response" },
            { v: "42", l: "Global Showrooms" },
        ].map((s) => (<div key={s.l} className="flex flex-col">
            <span className="font-display text-2xl font-bold sm:text-3xl">{s.v}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">{s.l}</span>
          </div>))}
      </motion.div>
    </section>);
}
