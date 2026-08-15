import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, ArrowRight, ShieldCheck, Sparkles, Compass, Play, Activity } from "lucide-react";

export function HeroVideo({ onExploreClick, onBrowseClick }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  const videoRef = useRef(null);

  // Real-time video telemetry debug state
  const [telemetry, setTelemetry] = useState({
    url: "/videos/nexride-hero.mp4",
    readyState: 0,
    networkState: 0,
    duration: 0,
    currentTime: 0,
    paused: true,
    muted: true,
    error: null,
  });

  const updateTelemetry = () => {
    if (videoRef.current) {
      const v = videoRef.current;
      setTelemetry({
        url: v.currentSrc || "/videos/nexride-hero.mp4",
        readyState: v.readyState,
        networkState: v.networkState,
        duration: v.duration || 0,
        currentTime: v.currentTime || 0,
        paused: v.paused,
        muted: v.muted,
        error: v.error ? `Code ${v.error.code}: ${v.error.message}` : "NULL",
      });
      setIsPlaying(!v.paused);
      setIsMuted(v.muted);
    }
  };

  // Programmatic Autoplay Initialization
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsAutoplayBlocked(false);
            updateTelemetry();
          })
          .catch((err) => {
            console.warn("Browser Autoplay Policy Deferred Video Playback:", err);
            setIsAutoplayBlocked(true);
            setIsPlaying(false);
            updateTelemetry();
          });
      }
    }
  }, []);

  // Update telemetry periodically while playing
  useEffect(() => {
    const interval = setInterval(updateTelemetry, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
          updateTelemetry();
        })
        .catch((err) => {
          console.error("Manual Play error:", err);
        });
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      updateTelemetry();
    }
  };

  const handleVideoError = (e) => {
    const v = e.target;
    const err = v.error ? `Code ${v.error.code} - ${v.error.message}` : "Failed to load video stream";
    console.error("Video Error Event Captured:", err);
    setVideoError(err);
    updateTelemetry();
  };

  const POSTER_IMAGE = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&auto=format&fit=crop&q=80";

  return (
    <div className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* ── BACKGROUND VIDEO PLAYER WITH POSTER FALLBACK ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={POSTER_IMAGE}
        onLoadedMetadata={updateTelemetry}
        onCanPlay={updateTelemetry}
        onPlay={updateTelemetry}
        onPause={updateTelemetry}
        onError={handleVideoError}
        className="absolute inset-0 z-0 size-full object-cover object-center scale-105 transition-opacity duration-1000"
      >
        {/* Verified Local MP4 Video Asset (Served 200 OK directly by Vite/Nitro) */}
        <source src="/videos/nexride-hero.mp4" type="video/mp4" />
        Your browser does not support HTML5 video playback.
      </video>

      {/* Poster Fallback Image behind video for instant render */}
      <img
        src={POSTER_IMAGE}
        alt="NexRide X Hero Poster"
        className={`absolute inset-0 z-0 size-full object-cover object-center transition-opacity duration-1000 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* ── CINEMATIC DARK GRADIENT OVERLAY FOR HIGH CONTRAST & READABILITY ── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/65 to-black/60" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-neutral-950" />

      {/* ── CONTROL BUTTONS (SOUND & PLAY EXPERIENCE) ── */}
      <div className="absolute top-28 right-6 sm:top-32 sm:right-10 z-30 flex items-center gap-3">
        {isAutoplayBlocked && (
          <button
            onClick={handleManualPlay}
            className="flex items-center gap-2 rounded-full border border-cyan-glow bg-cyan-glow/20 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-cyan-glow backdrop-blur-md hover:bg-cyan-glow hover:text-black transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.4)] animate-pulse"
          >
            <Play size={12} className="fill-current" />
            <span>Play Experience</span>
          </button>
        )}

        <button
          onClick={toggleSound}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/80 backdrop-blur-md hover:border-cyan-glow hover:text-white transition-all cursor-pointer shadow-xl"
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

      {/* ── REAL-TIME VIDEO DEBUG PANEL (DEV TELEMETRY OVERLAY) ── */}
      {showDebugPanel && (
        <div className="absolute bottom-6 left-6 z-30 max-w-xs rounded-xl border border-cyan-glow/30 bg-black/80 p-3.5 text-[10px] font-mono text-cyan-glow/90 backdrop-blur-md shadow-2xl space-y-1">
          <div className="flex items-center justify-between border-b border-cyan-glow/20 pb-1 font-bold uppercase text-white">
            <span className="flex items-center gap-1.5">
              <Activity size={12} className="text-cyan-glow animate-spin" />
              Video Telemetry Debug
            </span>
            <button
              onClick={() => setShowDebugPanel(false)}
              className="text-white/40 hover:text-white text-[9px] uppercase cursor-pointer"
            >
              [Hide]
            </button>
          </div>
          <div><span className="text-white/50">URL:</span> {telemetry.url}</div>
          <div><span className="text-white/50">readyState:</span> {telemetry.readyState} (4=HAVE_ENOUGH_DATA)</div>
          <div><span className="text-white/50">networkState:</span> {telemetry.networkState} (1=IDLE)</div>
          <div><span className="text-white/50">Status:</span> {telemetry.paused ? "Paused" : "Playing"} ({telemetry.muted ? "Muted" : "Unmuted"})</div>
          <div><span className="text-white/50">Time:</span> {telemetry.currentTime.toFixed(1)}s / {telemetry.duration.toFixed(1)}s</div>
          <div><span className="text-white/50">Error:</span> <span className={telemetry.error !== "NULL" ? "text-red-400 font-bold" : "text-emerald-400"}>{telemetry.error}</span></div>
        </div>
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
