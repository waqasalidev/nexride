import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import bugatti from "@/assets/bugatti.jpg";
import kawasaki from "@/assets/kawasaki.jpg";
import gulfstream from "@/assets/gulfstream.jpg";
import yacht from "@/assets/yacht.jpg";
const cats = [
    { to: "/cars", label: "Hypercars", count: "320+ listings", img: bugatti },
    { to: "/bikes", label: "Superbikes", count: "180+ listings", img: kawasaki },
    { to: "/jets", label: "Private Jets", count: "64+ listings", img: gulfstream },
    { to: "/ships", label: "Luxury Ships", count: "80+ listings", img: yacht },
];
export function Categories() {
    return (<section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 font-display text-4xl font-bold sm:text-5xl">
        EXPLORE BY <span className="text-cyan-glow">CATEGORY</span>
      </motion.h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c, i) => (<motion.div key={c.to} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
            <Link to={c.to} className="group relative block aspect-[4/5] overflow-hidden rounded-sm border border-white/5">
              <img src={c.img} alt={c.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent"/>
              <div className="absolute inset-x-6 bottom-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-glow">
                  {c.count}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-tight">{c.label}</h3>
                <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-white/60 transition-colors group-hover:text-cyan-glow">
                  Browse Collection →
                </span>
              </div>
            </Link>
          </motion.div>))}
      </div>
    </section>);
}
