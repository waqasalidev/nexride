import { motion } from "framer-motion";
import { useState } from "react";
import { vehicles } from "@/lib/vehicles";
import { VehicleCard } from "./VehicleCard";
import { useVehicles } from "@/lib/api";
import { useAuth } from "@/context/AuthContext.jsx";
const tabs = [
    { key: "all", label: "All" },
    { key: "car", label: "Cars" },
    { key: "bike", label: "Bikes" },
    { key: "jet", label: "Jets" },
    { key: "ship", label: "Ships" },
];
export function FeaturedVehicles() {
    const [tab, setTab] = useState("all");
    const { user } = useAuth();
    const { data: dbVehicles } = useVehicles(user?.token);
    const activeVehicles = dbVehicles && dbVehicles.length > 0 ? dbVehicles : vehicles;
    const list = tab === "all" ? activeVehicles : activeVehicles.filter((v) => v.category === tab);
    return (<section id="featured" className="mx-auto max-w-7xl px-6 py-32 sm:px-8">
      <div className="mb-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="mb-4 text-sm uppercase tracking-[0.5em] text-cyan-glow">
            Curated Excellence
          </h2>
          <h3 className="font-display text-4xl font-bold sm:text-5xl">FEATURED ASSETS</h3>
        </motion.div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (<button key={t.key} onClick={() => setTab(t.key)} className={`rounded-full border px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === t.key
                ? "border-cyan-glow bg-cyan-glow/10 text-cyan-glow"
                : "border-white/10 text-white/60 hover:border-white/30"}`}>
              {t.label}
            </button>))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {list.map((v, i) => (<VehicleCard key={v._id || v.id} vehicle={v} index={i}/>))}
      </div>
    </section>);
}
