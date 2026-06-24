import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, X, Shield, Gauge, Zap, CircleDollarSign, Send } from "lucide-react";
import { formatPrice } from "@/lib/vehicles";
import { useAuth } from "@/context/AuthContext.jsx";
import { useFavorites, useAddFavorite, useRemoveFavorite, useCreateInquiry } from "@/lib/api";
import { VehicleViewer3D } from "./VehicleViewer3D.jsx";

export function VehicleCard({ vehicle, index = 0 }) {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  
  // Inquiry form states
  const [inqName, setInqName] = useState(user?.name || "");
  const [inqEmail, setInqEmail] = useState(user?.email || "");
  const [inqPhone, setInqPhone] = useState(user?.phone || "");
  const [inqMsg, setInqMsg] = useState("");
  const [inqSuccess, setInqSuccess] = useState(false);
  const [inqLoading, setInqLoading] = useState(false);

  // Favorite APIs
  const { data: dbFavorites } = useFavorites(user?.token);
  const addFavoriteMutation = useAddFavorite(user?.token);
  const removeFavoriteMutation = useRemoveFavorite(user?.token);
  const createInquiryMutation = useCreateInquiry(user?.token);

  const vehicleId = vehicle._id || vehicle.id;
  const isFavorited = dbFavorites?.some((fav) => (fav.vehicle?._id || fav.vehicle?.id) === vehicleId);

  // Sync inquiry fields with user when logged in
  useEffect(() => {
    if (user) {
      setInqName(user.name);
      setInqEmail(user.email);
      setInqPhone(user.phone || "");
    }
  }, [user]);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Authentication required. Please log in to bookmark vehicles.");
      return;
    }

    try {
      if (isFavorited) {
        await removeFavoriteMutation.mutateAsync(vehicleId);
      } else {
        await addFavoriteMutation.mutateAsync(vehicleId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInspect = () => {
    setShowDetails(true);
    // Add to recently viewed list in localStorage
    try {
      const items = localStorage.getItem("recently_viewed_list");
      let list = items ? JSON.parse(items) : [];
      // Remove duplicates
      list = list.filter((item) => (item._id || item.id) !== vehicleId);
      // Prepend and slice first 4
      list.unshift(vehicle);
      localStorage.setItem("recently_viewed_list", JSON.stringify(list.slice(0, 4)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInqLoading(true);
    try {
      await createInquiryMutation.mutateAsync({
        vehicleId,
        name: inqName,
        email: inqEmail,
        phone: inqPhone,
        message: inqMsg || `I'm interested in acquiring this ${vehicle.brand} ${vehicle.model}. Please contact me.`,
      });
      setInqSuccess(true);
      setInqMsg("");
    } catch (err) {
      console.error(err);
    } finally {
      setInqLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="group relative space-y-5 premium-hover-card rounded-2xl p-3 bg-neutral-900/30 border border-white/5"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/5 bg-neutral-900">
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${vehicle.status === "Sold" ? "grayscale opacity-50" : ""}`}
          />
          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            {vehicle.status === "Sold" && (
              <div className="bg-red-600 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white rounded-md shadow-lg">
                SOLD
              </div>
            )}
            {vehicle.status === "Coming Soon" && (
              <div className="bg-amber-500 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black rounded-md shadow-lg">
                COMING SOON
              </div>
            )}
            {(vehicle.status === "Featured" || vehicle.isFeatured) && (
              <div className="bg-cyan-glow px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black rounded-md shadow-lg shadow-cyan-glow/20">
                FEATURED
              </div>
            )}
            {(vehicle.status === "Discounted" || (vehicle.discountPercentage && vehicle.discountPercentage > 0)) && (
              <div className="bg-emerald-500 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white rounded-md shadow-lg">
                {vehicle.discountPercentage || 10}% OFF
              </div>
            )}
            {/* Fallback to original tag if no status badge matches */}
            {!(vehicle.status === "Sold" || vehicle.status === "Coming Soon" || vehicle.status === "Featured" || vehicle.isFeatured || vehicle.status === "Discounted" || (vehicle.discountPercentage && vehicle.discountPercentage > 0)) && vehicle.tag && (
              <div className="bg-cyan-glow px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-black rounded-md shadow-lg">
                {vehicle.tag}
              </div>
            )}
          </div>

          {/* Wishlist Toggle Button */}
          {user && (
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 border border-white/5 hover:bg-black/60 hover:border-cyan-glow/20 transition-all cursor-pointer"
            >
              <Heart
                size={14}
                className={isFavorited ? "fill-red-500 text-red-500" : "text-white/80 hover:text-cyan-glow"}
              />
            </button>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {vehicle.status === "Sold" ? (
              <button
                disabled
                className="bg-white/10 text-white/40 cursor-not-allowed py-3 text-[10px] font-bold uppercase tracking-widest rounded-full col-span-2"
              >
                Sold Out
              </button>
            ) : (
              <>
                <button
                  onClick={handleInspect}
                  className="border border-white/15 bg-white/5 py-3 text-[10px] font-bold uppercase tracking-widest backdrop-blur rounded-full premium-hover-btn"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    setInqSuccess(false);
                    setShowInquiry(true);
                  }}
                  className="bg-cyan-glow py-3 text-[10px] font-bold uppercase tracking-widest text-black rounded-full premium-hover-btn"
                >
                  Inquire
                </button>
              </>
            )}
        </div>
        
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-display text-xl font-bold text-white">
              {vehicle.brand} {vehicle.model}
            </h4>
            <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
              {vehicle.year} • {vehicle.mileage} • {vehicle.fuel}
            </p>
          </div>
          {vehicle.discountPercentage > 0 ? (
            <div className="flex flex-col items-end">
              <span className="whitespace-nowrap font-bold text-cyan-glow">{formatPrice(vehicle.price)}</span>
              <span className="whitespace-nowrap text-[10px] line-through text-white/40">{formatPrice(vehicle.originalPrice || (vehicle.price / (1 - vehicle.discountPercentage / 100)))}</span>
            </div>
          ) : (
            <span className="whitespace-nowrap font-bold text-cyan-glow">{formatPrice(vehicle.price)}</span>
          )}
        </div>
      </motion.div>

      {/* Details & 3D Scan Modal */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
              >
                <X size={16} className="text-white" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {/* 3D Visualizer Tab */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-cyan-glow font-bold">
                    Interactive 3D Scan
                  </h3>
                  <VehicleViewer3D category={vehicle.category} />
                  
                  <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                    <Shield size={24} className="text-cyan-glow shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold uppercase text-white">Verified Provenance</h4>
                      <p className="text-[10px] text-white/50 mt-0.5">This asset has undergone rigorous 150-point diagnostics.</p>
                    </div>
                  </div>
                </div>

                {/* Specs Sheet & Actions */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-3xl font-bold text-white leading-tight">
                        {vehicle.brand} <span className="text-cyan-glow">{vehicle.model}</span>
                      </h2>
                      <p className="text-xs uppercase tracking-widest text-white/40 mt-1">
                        {vehicle.year} • {vehicle.subcategory}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Zap className="text-cyan-glow shrink-0" size={16} />
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-white/40">Output</p>
                          <p className="text-xs font-bold text-white">{vehicle.hp}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Gauge className="text-cyan-glow shrink-0" size={16} />
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-white/40">Vmax</p>
                          <p className="text-xs font-bold text-white">{vehicle.topSpeed}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="text-cyan-glow shrink-0" size={16} />
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-white/40">Usage</p>
                          <p className="text-xs font-bold text-white">{vehicle.mileage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CircleDollarSign className="text-cyan-glow shrink-0" size={16} />
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-white/40">Value</p>
                          {vehicle.discountPercentage > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-cyan-glow">{formatPrice(vehicle.price)}</span>
                              <span className="text-[9px] line-through text-white/40">{formatPrice(vehicle.originalPrice || (vehicle.price / (1 - vehicle.discountPercentage / 100)))}</span>
                            </div>
                          ) : (
                            <p className="text-xs font-bold text-cyan-glow">{formatPrice(vehicle.price)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Asset Overview</h4>
                      <p className="text-xs text-white/60 leading-relaxed">
                        Exquisite craftsmanship meets apex performance. This listing features original specifications, flawless service history, and verified logistics. Select 3D rotation to scan aerodynamics.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8 border-t border-white/5 pt-6">
                    <button
                      onClick={handleFavoriteToggle}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white premium-hover-btn"
                    >
                      <Heart size={14} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
                      <span>{isFavorited ? "Saved" : "Save Asset"}</span>
                    </button>
                    {vehicle.status === "Sold" ? (
                      <button
                        disabled
                        className="flex-1 rounded-full bg-white/10 py-4 text-xs font-bold uppercase tracking-widest text-white/40 cursor-not-allowed text-center"
                      >
                        Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowDetails(false);
                          setShowInquiry(true);
                        }}
                        className="flex-1 rounded-full bg-cyan-glow py-4 text-xs font-bold uppercase tracking-widest text-black premium-hover-btn text-center"
                      >
                        Acquire / Inquire
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Form Modal */}
      <AnimatePresence>
        {showInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 sm:p-8"
            >
              <button
                onClick={() => setShowInquiry(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
              >
                <X size={16} className="text-white" />
              </button>

              {inqSuccess ? (
                <div className="text-center py-6">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-cyan-glow text-black shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                    <Check size={28} />
                  </div>
                  <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                    Acquisition Logged
                  </h2>
                  <p className="text-xs text-white/60 mt-3 leading-relaxed">
                    Our concierge representative will contact you within 12 hours regarding the {vehicle.brand} {vehicle.model}.
                  </p>
                  <button
                    onClick={() => setShowInquiry(false)}
                    className="mt-8 rounded-xl bg-cyan-glow px-6 py-3 text-xs font-bold uppercase tracking-widest text-black cursor-pointer w-full"
                  >
                    Close Portal
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="font-display text-xl font-bold uppercase text-white">
                      Acquisition Inquiry
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-cyan-glow mt-1">
                      {vehicle.brand} {vehicle.model} • {formatPrice(vehicle.price)}
                    </p>
                  </div>

                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <label className="block">
                      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-white/50">Your Name</span>
                      <input
                        className="input"
                        type="text"
                        value={inqName}
                        onChange={(e) => setInqName(e.target.value)}
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-white/50">Email Address</span>
                      <input
                        className="input"
                        type="email"
                        value={inqEmail}
                        onChange={(e) => setInqEmail(e.target.value)}
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-white/50">Phone Number</span>
                      <input
                        className="input"
                        type="text"
                        placeholder="+1 (555) 000-0000"
                        value={inqPhone}
                        onChange={(e) => setInqPhone(e.target.value)}
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-white/50">Message</span>
                      <textarea
                        className="input min-h-20"
                        placeholder="Inquire about delivery, custom options, or financing..."
                        value={inqMsg}
                        onChange={(e) => setInqMsg(e.target.value)}
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={inqLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-cyan-glow py-3.5 text-xs font-bold uppercase tracking-widest text-black premium-hover-btn"
                    >
                      <Send size={12} />
                      <span>{inqLoading ? "Transmitting..." : "Submit Acquisition Form"}</span>
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: white;
          outline: none;
        }
        .input:focus { border-color: var(--cyan-glow); }
      `}</style>
    </>
  );
}
