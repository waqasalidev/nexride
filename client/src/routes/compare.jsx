import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { vehicles, formatPrice } from "@/lib/vehicles";
import { useVehicles } from "@/lib/api";

import { PremiumDropdown } from "../components/ui/PremiumDropdown.jsx";

export const Route = createFileRoute("/compare")({
  head: () => ({ meta: [{ title: "Compare Vehicles — NexRide X" }] }),
  component: ComparePage,
});

function Selector({ value, onChange, label, list }) {
  const options = list.map((v) => ({
    label: `${v.brand} ${v.model}`,
    value: v._id || v.id,
  }));

  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-cyan-glow">{label}</p>
      <PremiumDropdown
        value={value}
        onChange={onChange}
        options={options}
        placeholder="Select Asset..."
      />
    </div>
  );
}

function Column({ v }) {
  if (!v) return null;
  const rows = [
    ["Brand", v.brand],
    ["Model", v.model],
    ["Year", String(v.year)],
    ["Category", v.subcategory],
    ["Horsepower", v.hp],
    ["Top Speed", v.topSpeed],
    ["Mileage", v.mileage],
    ["Fuel", v.fuel],
    ["Price", formatPrice(v.price)],
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morph overflow-hidden rounded-2xl"
    >
      <img src={v.image} alt={v.model} className="aspect-[4/3] w-full object-cover" loading="lazy" />
      <div className="p-6">
        <h3 className="font-display text-xl font-bold">
          {v.brand} {v.model}
        </h3>
        <dl className="mt-4 divide-y divide-white/5">
          {rows.map(([k, val]) => (
            <div key={k} className="flex justify-between py-3 text-sm">
              <dt className="text-[10px] font-bold uppercase tracking-widest text-white/40">{k}</dt>
              <dd className="font-medium text-white">{val}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}

function ComparePage() {
  const { data: dbVehicles } = useVehicles();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeList = isMounted && dbVehicles && dbVehicles.length > 0 ? dbVehicles : vehicles;

  const [a, setA] = useState("");
  const [b, setB] = useState("");

  useEffect(() => {
    if (activeList && activeList.length > 1) {
      const idA = activeList[0]._id || activeList[0].id;
      const idB = (activeList[2] || activeList[1] || activeList[0])._id || (activeList[2] || activeList[1] || activeList[0]).id;
      if (!a) setA(idA);
      if (!b) setB(idB);
    }
  }, [activeList, a, b]);

  const va = activeList.find((v) => (v._id || v.id) === a) || activeList[0];
  const vb = activeList.find((v) => (v._id || v.id) === b) || activeList[1] || activeList[0];

  return (
    <>
      <PageHeader
        eyebrow="Tools / Compare"
        title={
          <>
            SIDE BY <span className="text-cyan-glow">SIDE</span>
          </>
        }
        description="Benchmark any two assets across performance, price, and specification."
      />
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Selector label="Asset A" value={a} onChange={setA} list={activeList} />
          <Selector label="Asset B" value={b} onChange={setB} list={activeList} />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Column v={va} />
          <Column v={vb} />
        </div>
      </section>
    </>
  );
}
