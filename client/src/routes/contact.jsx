import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
export const Route = createFileRoute("/contact")({
    head: () => ({ meta: [{ title: "Contact — NexRide X" }] }),
    component: ContactPage,
});
function ContactPage() {
    return (<>
      <PageHeader eyebrow="Concierge" title={<>GET IN <span className="text-cyan-glow">TOUCH</span></>} description="Direct line to our acquisition specialists."/>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2 sm:px-8">
        <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-morph space-y-5 rounded-2xl p-8" onSubmit={(e) => e.preventDefault()}>
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" placeholder="Full Name"/>
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" placeholder="Email" type="email"/>
          <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" placeholder="Subject"/>
          <textarea className="min-h-40 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none" placeholder="Message"/>
          <button className="w-full rounded-xl bg-cyan-glow py-4 text-xs font-bold uppercase tracking-widest text-black">
            Send Message
          </button>
        </motion.form>
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "concierge@nexride.x" },
            { icon: Phone, label: "Phone", value: "+1 800 NEX RIDE" },
            { icon: MapPin, label: "Headquarters", value: "Mayfair, London W1K" },
        ].map((c) => (<div key={c.label} className="glass-morph flex items-center gap-5 rounded-2xl p-6">
              <div className="flex size-12 items-center justify-center rounded-full bg-cyan-glow/10 text-cyan-glow">
                <c.icon size={20}/>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{c.label}</p>
                <p className="mt-1 font-display text-lg font-bold">{c.value}</p>
              </div>
            </div>))}
        </div>
      </section>
    </>);
}
