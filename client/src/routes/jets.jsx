import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/lib/vehicles";
import { useJets } from "@/lib/api";
import { useState } from "react";

export const Route = createFileRoute("/jets")({
    head: () => ({
        meta: [
            { title: "Private Jets — NexRide X" },
            { name: "description", content: "Executive, luxury, and business jets ready for acquisition." },
        ],
    }),
    component: JetsPage,
});

function JetsPage() {
    const { data: dbJets } = useJets();
    const [statusFilter, setStatusFilter] = useState("All");

    const activeJets = dbJets && dbJets.length > 0 ? dbJets : vehicles.filter((v) => v.category === "jet");

    const filteredList = activeJets.filter((v) => {
        if (statusFilter === "All") return true;
        if (statusFilter === "Discounted") return v.status === "Discounted" || v.discountPercentage > 0;
        return v.status === statusFilter;
    });

    const filterOptions = ["All", "Available", "Featured", "Discounted", "Coming Soon", "Sold"];

    return (<>
      <PageHeader eyebrow="Inventory / Aviation" title={<>PRIVATE<br /><span className="text-cyan-glow">JETS</span></>} description="Executive aviation assets, curated for global mobility."/>
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* Status Filter Tab Layout */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={`px-5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                statusFilter === opt
                  ? "bg-cyan-glow border-cyan-glow text-black shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {filteredList.length === 0 ? (
          <div className="text-center py-20 glass-morph rounded-2xl border border-dashed border-white/10">
            <p className="text-white/40 text-sm uppercase tracking-wider">No vehicles found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((v, i) => <VehicleCard key={v._id || v.id} vehicle={v} index={i}/>)}
          </div>
        )}
      </section>
    </>);
}
