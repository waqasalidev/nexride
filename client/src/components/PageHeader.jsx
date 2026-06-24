import { motion } from "framer-motion";
export function PageHeader({ eyebrow, title, description, children, }) {
    return (<section className="hero-gradient relative overflow-hidden px-6 pb-16 pt-40 sm:px-8 sm:pt-48">
      <div className="mx-auto max-w-7xl">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-[10px] font-bold uppercase tracking-[0.5em] text-cyan-glow">
          {eyebrow}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-5xl font-bold tracking-tighter sm:text-7xl">
          {title}
        </motion.h1>
        {description && (<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            {description}
          </motion.p>)}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>);
}
