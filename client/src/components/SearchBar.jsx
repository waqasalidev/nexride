import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { PremiumDropdown } from "./ui/PremiumDropdown.jsx";

export function SearchBar() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [query, setQuery] = useState("");

  const categories = [
    { label: "All Categories", value: "all" },
    { label: "Cars", value: "car" },
    { label: "Bikes", value: "bike" },
    { label: "Jets", value: "jet" },
    { label: "Ships", value: "ship" },
  ];

  const brands = [
    { label: "Any Brand", value: "all" },
    { label: "Bugatti", value: "Bugatti" },
    { label: "Ferrari", value: "Ferrari" },
    { label: "Lamborghini", value: "Lamborghini" },
    { label: "Porsche", value: "Porsche" },
    { label: "Gulfstream", value: "Gulfstream" },
    { label: "Azimut", value: "Azimut" },
    { label: "Sunseeker", value: "Sunseeker" },
  ];

  const handleSearch = () => {
    const targetRoute = category === "all" ? "/cars" : `/${category}s`;
    navigate({ to: targetRoute });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-5xl px-6 py-16 sm:px-8"
    >
      <div className="glass-morph rounded-2xl p-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1.5fr_auto] items-center">
          <PremiumDropdown
            value={category}
            onChange={setCategory}
            options={categories}
            placeholder="Category"
          />
          <PremiumDropdown
            value={brand}
            onChange={setBrand}
            options={brands}
            placeholder="Brand"
          />
          <input
            type="text"
            placeholder="Model, year, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-cyan-glow/40 transition-all duration-300"
          />
          <button
            onClick={handleSearch}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-glow px-8 text-xs font-bold uppercase tracking-widest text-black hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,242,255,0.25)] hover:shadow-[0_0_25px_rgba(0,242,255,0.45)]"
          >
            <Search size={14} /> Search
          </button>
        </div>
      </div>
    </motion.div>
  );
}

