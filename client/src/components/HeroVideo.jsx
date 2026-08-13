import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, ArrowRight, ShieldCheck, Sparkles, Compass } from "lucide-react";

export function HeroVideo({ onExploreClick, onBrowseClick }) {
  const [isMuted, setIsMuted] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const POSTER_IMAGE = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&auto=format&fit=crop&q=80";

  return (
    <div className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* ── BACKGROUND VIDEO PLAYER WITH POSTER FALLBACK ── */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={POSTER_IMAGE}
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 z-0 size-full object-cover object-center scale-105 transition-opacity duration-1000"
        >
          {/* Cinematic Supercars Driving / Aircraft Flying Video Footage */}
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-road-41555-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-private-jet-flying-over-clouds-42862-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-supercars-driving-on-a-road-in-the-desert-41554-large.mp4"
            type="video/mp4"
          />
        </video>
      ) : (
        <img
          src={POSTER_IMAGE}
          alt="NexRide X Hero"
          className="absolute inset-0 z-0 size-full object-cover object-center"
        />
      )}

      {/* ── CINEMATIC DARK GRADIENT OVERLAY FOR HIGH CONTRAST & READABILITY ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-black/60" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-neutral-950" />

      {/* ── SOUND TOGGLE CONTROL BUTTON (POSITIONED BELOW NAVBAR) ── */}
      {!videoFailed && (
        <button
          onClick={toggleSound}
          className="absolute top-28 right-6 sm:top-32 sm:right-10 z-30 flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md hover:border-cyan-glow hover:text-white transition-all cursor-pointer shadow-xl"
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
      )}

      {/* ── HERO CONTENT (STARTS CLEANLY BELOW NAVBAR WITH RESPONSIVE TOP OFFSET) ── */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 pt-32 sm:pt-40 md:pt-44 lg:pt-48 pb-20 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-glow/30 bg-cyan-glow/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,242,255,0.15)]"
        >
          <Sparkles className="text-cyan-glow size-3.5 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-glow">
            NEXRIDE X • DRIVE. FLY. RIDE. SAIL.
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
          Explore premium cars, motorcycles, private jets and luxury vessels from around the world.
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
    </div>
  );
}
