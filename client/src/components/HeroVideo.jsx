import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ArrowRight, ShieldCheck, Sparkles, Compass, Car, Bike, Plane, Anchor } from "lucide-react";

const CATEGORIES = [
  { id: "car", label: "Cars", src: "/videos/nexride-car.mp4", icon: Car },
  { id: "bike", label: "Bikes", src: "/videos/nexride-bike.mp4", icon: Bike },
  { id: "jet", label: "Jets", src: "/videos/nexride-jet.mp4", icon: Plane },
  { id: "ship", label: "Ships", src: "/videos/nexride-ship.mp4", icon: Anchor },
];

export function HeroVideo({ onExploreClick, onBrowseClick }) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const videoRef = useRef(null);

  const activeCategory = CATEGORIES[activeCategoryIndex];

  // Rotate category clips automatically on clip end or 8-second interval
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveCategoryIndex((prev) => (prev + 1) % CATEGORIES.length);
    }, 8000);
    return () => clearTimeout(timer);
  }, [activeCategoryIndex]);

  // Programmatic Autoplay initialization whenever active clip changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAutoplayBlocked(false);
          })
          .catch((err) => {
            console.warn("Browser autoplay policy deferred video:", err);
            setIsAutoplayBlocked(true);
          });
      }
    }
  }, [activeCategoryIndex]);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const POSTER_IMAGE = "/images/nexride-hero-poster.jpg";

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* ── MULTI-CATEGORY HERO BACKGROUND VIDEO PLAYER ── */}
      <AnimatePresence mode="wait">
        <motion.video
          key={activeCategory.id}
          ref={videoRef}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.3 }}
          transition={{ duration: 0.8 }}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          poster={POSTER_IMAGE}
          onEnded={() => setActiveCategoryIndex((prev) => (prev + 1) % CATEGORIES.length)}
          className="absolute inset-0 z-0 size-full object-cover object-center scale-105"
        >
          <source src={activeCategory.src} type="video/mp4" />
          <source src="/videos/nexride-hero.mp4" type="video/mp4" />
        </motion.video>
      </AnimatePresence>

      {/* Local Poster Fallback Image behind video */}
      <img
        src={POSTER_IMAGE}
        alt="NexRide X Hero Poster"
        className="absolute inset-0 z-0 size-full object-cover object-center pointer-events-none opacity-40"
      />

      {/* ── CINEMATIC GRADIENT OVERLAY (DARK GRADIENT FOR READABILITY) ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-black/60" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-neutral-950" />

      {/* ── CATEGORY INDICATOR BADGES (CARS • BIKES • JETS • SHIPS) ── */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-30 flex items-center gap-2">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          const isActive = idx === activeCategoryIndex;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryIndex(idx)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-glow text-black shadow-[0_0_15px_rgba(0,242,255,0.5)] scale-105"
                  : "bg-black/60 text-white/60 border border-white/10 hover:border-cyan-glow/40 hover:text-white"
              }`}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── SOUND TOGGLE CONTROL BUTTON ── */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-30">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md hover:border-cyan-glow hover:text-white transition-all cursor-pointer shadow-xl"
          title={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? (
            <>
              <VolumeX size={14} className="text-white/50" />
              <span>Sound Off</span>
            </>
          ) : (
            <>
              <Volume2 size={14} className="text-cyan-glow animate-pulse" />
              <span className="text-cyan-glow">Sound On</span>
            </>
          )}
        </button>
      </div>

      {/* ── HERO CONTENT (CENTERED CLEANLY INSIDE HERO SECTION BELOW NAVBAR) ── */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 py-20 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,242,255,0.15)]"
        >
          <Sparkles className="text-cyan-glow size-3.5 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-glow">
            NEXRIDE X • DRIVE. RIDE. FLY. SAIL.
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.95]"
        >
          Experience Luxury <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow via-white to-cyan-glow">
            Without Limits
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base text-white/70 uppercase tracking-widest font-medium leading-relaxed"
        >
          Discover premium cars, motorcycles, private jets and luxury vessels from around the world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={onExploreClick}
            className="group flex items-center gap-3 rounded-full bg-cyan-glow px-8 py-4 text-xs font-bold uppercase tracking-widest text-black hover:bg-white active:scale-95 transition-all cursor-pointer shadow-[0_0_30px_rgba(0,242,255,0.4)]"
          >
            <span>Explore Vehicles</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onBrowseClick}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur hover:border-cyan-glow hover:bg-cyan-glow/10 transition-all cursor-pointer"
          >
            <Compass size={14} className="text-cyan-glow" />
            <span>View Collection</span>
          </button>
        </motion.div>

        {/* Floating Verified Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-10 flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest text-white/40 border-t border-white/10 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-glow" />
            <span>Verified Title Logistics</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-glow" />
            <span>Escrow Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-glow" />
            <span>Global Delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
