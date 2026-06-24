import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Phone, Award } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
export const Route = createFileRoute("/dealers")({
    head: () => ({ meta: [{ title: "Authorized Dealers — NexRide X" }] }),
    component: DealersPage,
});
const dealers = [
    { name: "NexRide London", city: "Mayfair, London", phone: "+44 20 7946 0001", specialty: "Hypercars & Jets" },
    { name: "NexRide Dubai", city: "DIFC, Dubai", phone: "+971 4 555 0100", specialty: "Hypercars & Bikes" },
    { name: "NexRide New York", city: "Manhattan, NYC", phone: "+1 212 555 0199", specialty: "Full Inventory" },
    { name: "NexRide Tokyo", city: "Ginza, Tokyo", phone: "+81 3 5555 0123", specialty: "Bikes & Sports" },
    { name: "NexRide Monaco", city: "Monte Carlo", phone: "+377 9999 0000", specialty: "Hypercars & Yachts" },
    { name: "NexRide Geneva", city: "Geneva, CH", phone: "+41 22 555 0144", specialty: "Jets & Aviation" },
];
function DealersPage() {
    return (<>
      <PageHeader eyebrow="Global Network" title={<>AUTHORIZED <span className="text-cyan-glow">DEALERS</span></>} description="Hand-picked partners in the world's wealth capitals."/>
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dealers.map((d, i) => (<motion.div key={d.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass-morph group rounded-2xl p-6 transition-all hover:border-cyan-glow/40">
              <Award className="mb-4 text-cyan-glow" size={28}/>
              <h3 className="font-display text-xl font-bold">{d.name}</h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-cyan-glow">
                {d.specialty}
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/60">
                <p className="flex items-center gap-2"><MapPin size={14}/> {d.city}</p>
                <p className="flex items-center gap-2"><Phone size={14}/> {d.phone}</p>
              </div>
            </motion.div>))}
        </div>
      </section>
    </>);
}
