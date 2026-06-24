import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export function PremiumDropdown({ value, onChange, options = [], placeholder = "Select...", className = "", triggerClassName = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between rounded-xl border border-white/8 bg-neutral-900/60 backdrop-blur-md px-4 py-3 text-sm text-white hover:border-cyan-glow/40 transition-all duration-300 shadow-lg cursor-pointer ${triggerClassName}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/60 shrink-0"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur-xl p-1.5 shadow-2xl focus:outline-none scrollbar-thin select-none"
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-white/40 text-center">No options available</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all duration-200 cursor-pointer ${
                    option.value === value
                      ? "bg-cyan-glow text-black font-bold"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check size={14} className="shrink-0 text-black ml-2" />
                  )}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
