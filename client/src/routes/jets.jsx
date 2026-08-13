import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/lib/vehicles";
import { useProducts } from "@/lib/api";
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

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
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const limit = 12;

    const { data: apiResponse, isLoading } = useProducts({
        category: "jet",
        page,
        limit,
        search: searchQuery,
        status: statusFilter !== "All" ? statusFilter : undefined,
        sort: sortBy,
    });

    const dbProducts = apiResponse?.products;
    const totalPages = apiResponse?.totalPages || 1;
    const totalProducts = apiResponse?.totalProducts || 0;

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fallbackJets = vehicles.filter((v) => v.category === "jet");
    const activeList = isMounted && dbProducts && dbProducts.length > 0 ? dbProducts : fallbackJets;

    const filterOptions = ["All", "Available", "Featured", "Discounted", "Coming Soon", "Sold"];

    return (<>
      <PageHeader eyebrow="Inventory / Aviation" title={<>PRIVATE<br /><span className="text-cyan-glow">JETS</span></>} description="Executive aviation assets, curated for global mobility."/>
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 space-y-8">
        {/* Status Filter Tab Layout */}
        <div className="flex flex-wrap justify-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => { setStatusFilter(opt); setPage(1); }}
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

        {/* Controls: Search + Sort */}
        <div className="glass-morph p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 text-white/40" size={14} />
            <input
              type="text"
              placeholder="Search manufacturer, model, city..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/30 outline-none focus:border-cyan-glow transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-cyan-glow"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="featured">Featured First</option>
              <option value="a_z">Brand (A-Z)</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 glass-morph rounded-2xl border border-white/5">
            <RefreshCw className="animate-spin mx-auto text-cyan-glow mb-3" size={24} />
            <p className="text-white/50 text-xs uppercase tracking-wider">Loading jets from MongoDB...</p>
          </div>
        ) : activeList.length === 0 ? (
          <div className="text-center py-20 glass-morph rounded-2xl border border-dashed border-white/10">
            <p className="text-white/40 text-sm uppercase tracking-wider">No jets found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {activeList.map((v, i) => <VehicleCard key={v._id || v.id} vehicle={v} index={i}/>)}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between glass-morph p-4 rounded-xl border border-white/5 mt-8">
                <span className="text-[10px] text-white/50 uppercase tracking-wider">
                  Page {page} of {totalPages} ({totalProducts} listings)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 cursor-pointer hover:border-cyan-glow"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`size-8 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        page === pg
                          ? "bg-cyan-glow text-black"
                          : "bg-white/5 border border-white/10 text-white hover:border-cyan-glow"
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 cursor-pointer hover:border-cyan-glow"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>);
}
