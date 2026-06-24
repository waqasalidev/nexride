import { motion } from "framer-motion";
import engine from "@/assets/engine3d.jpg";
export function Inspection3D() {
    return (<section id="3d" className="border-y border-white/5 bg-neutral-900/40 py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-8">
          <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            PRECISION
            <br />
            <span className="text-cyan-glow">3D INSPECTION</span>
          </h2>
          <p className="leading-relaxed text-white/60">
            Don't just look at photos. Our proprietary NEX-SCAN technology lets you inspect every
            weld, stitch, and turbine blade in full interactive 3D with high-fidelity lighting.
          </p>
          <ul className="space-y-4">
            {[
            "8K Texture Mapping",
            "Interactive Aerodynamics Simulation",
            "Interior X-Ray Vision",
            "Cinematic Lighting Presets",
        ].map((f) => (<li key={f} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/80">
                <span className="size-2 rounded-full bg-cyan-glow shadow-[0_0_12px_#00f2ff]"/>
                {f}
              </li>))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="glass-morph relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl">
          <motion.img src={engine} alt="3D engine wireframe" loading="lazy" animate={{ rotate: [0, 360] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute h-full w-full object-cover opacity-40"/>
          <div className="relative z-10 flex flex-col items-center">
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }} className="flex size-24 items-center justify-center rounded-full border border-cyan-glow/40 bg-cyan-glow/10 backdrop-blur">
              <div className="flex size-14 items-center justify-center rounded-full bg-cyan-glow font-bold text-black">
                3D
              </div>
            </motion.div>
            <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-glow">
              Initialize Viewer
            </span>
          </div>
        </motion.div>
      </div>
    </section>);
}
