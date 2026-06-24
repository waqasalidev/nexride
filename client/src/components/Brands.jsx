import { motion } from "framer-motion";

const brandsList = [
  // Cars
  {
    name: "Bugatti",
    color: "#E00034",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <ellipse cx="50" cy="20" rx="36" ry="18" fill="none" strokeWidth="2.5" className="stroke-current" />
        <text x="50" y="25" textAnchor="middle" fontStyle="italic" fontWeight="900" fontSize="12" fontFamily="Space Grotesk">BUGATTI</text>
        <circle cx="50" cy="8" r="1.5" />
      </svg>
    ),
  },
  {
    name: "Ferrari",
    color: "#EF0A0A",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <path d="M 50,5 C 38,10 38,28 50,35 C 62,28 62,10 50,5 Z" fill="none" strokeWidth="2" className="stroke-current" />
        <text x="50" y="27" textAnchor="middle" fontWeight="900" fontSize="16" fontFamily="serif">SF</text>
        <path d="M 48,15 L 53,10 L 52,18 Z" />
      </svg>
    ),
  },
  {
    name: "Lamborghini",
    color: "#DDB86C",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <polygon points="50,4 78,14 68,34 50,37 32,34 22,14" fill="none" strokeWidth="2.5" className="stroke-current" />
        <text x="50" y="16" textAnchor="middle" fontWeight="800" fontSize="7" fontFamily="Space Grotesk" letterSpacing="1.5">LAMBO</text>
        <path d="M 46,20 L 52,26 L 56,22 L 50,29 Z" />
      </svg>
    ),
  },
  {
    name: "Porsche",
    color: "#B59A57",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <polygon points="50,4 72,12 62,34 50,37 38,34 28,12" fill="none" strokeWidth="2" className="stroke-current" />
        <text x="50" y="24" textAnchor="middle" fontWeight="900" fontSize="8" fontFamily="Space Grotesk">PORSCHE</text>
      </svg>
    ),
  },
  {
    name: "BMW",
    color: "#0066B2",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <circle cx="50" cy="20" r="16" fill="none" strokeWidth="2" className="stroke-current" />
        <circle cx="50" cy="20" r="12" fill="none" strokeWidth="1" className="stroke-current" />
        <path d="M 50,8 A 12,12 0 0,1 62,20 L 50,20 Z" />
        <path d="M 50,32 A 12,12 0 0,1 38,20 L 50,20 Z" />
        <text x="50" y="19" textAnchor="middle" fontWeight="900" fontSize="5" fontFamily="Space Grotesk">BMW</text>
      </svg>
    ),
  },
  {
    name: "Mercedes",
    color: "#A6A6A6",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <circle cx="50" cy="20" r="16" fill="none" strokeWidth="2" className="stroke-current" />
        <path d="M 50,4 L 50,20 L 36,28 M 50,20 L 64,28" strokeWidth="2" strokeLinecap="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "Audi",
    color: "#C3002F",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <circle cx="35" cy="20" r="9" fill="none" strokeWidth="2.5" className="stroke-current" />
        <circle cx="45" cy="20" r="9" fill="none" strokeWidth="2.5" className="stroke-current" />
        <circle cx="55" cy="20" r="9" fill="none" strokeWidth="2.5" className="stroke-current" />
        <circle cx="65" cy="20" r="9" fill="none" strokeWidth="2.5" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "Tesla",
    color: "#CC0000",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <path d="M 35,8 C 45,8 55,8 65,8 M 50,8 L 50,32 M 36,16 C 45,18 55,18 64,16" strokeWidth="2.5" strokeLinecap="round" className="stroke-current" />
        <path d="M 40,32 Q 50,34 60,32" strokeWidth="1.5" fill="none" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "Bentley",
    color: "#003A2F",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <text x="50" y="24" textAnchor="middle" fontWeight="900" fontSize="16" fontFamily="sans-serif">B</text>
        <path d="M 25,20 C 35,10 40,20 44,20 M 75,20 C 65,10 60,20 56,20" strokeWidth="2" strokeLinecap="round" fill="none" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "Rolls Royce",
    color: "#3B215E",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <rect x="38" y="4" width="24" height="32" rx="2" fill="none" strokeWidth="2.2" className="stroke-current" />
        <text x="47" y="22" fontWeight="900" fontSize="11" fontFamily="serif">R</text>
        <text x="53" y="32" fontWeight="900" fontSize="11" fontFamily="serif">R</text>
      </svg>
    ),
  },
  // Bikes
  {
    name: "Yamaha",
    color: "#E60012",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <circle cx="50" cy="20" r="14" fill="none" strokeWidth="2" className="stroke-current" />
        <path d="M 50,6 L 50,34 M 36,20 L 64,20 M 40,10 L 60,30 M 40,30 L 60,10" strokeWidth="1.5" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "Honda",
    color: "#E60012",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <rect x="38" y="8" width="24" height="24" rx="2" fill="none" strokeWidth="2.5" className="stroke-current" />
        <path d="M 44,14 L 44,26 M 56,14 L 56,26 M 44,20 L 56,20" strokeWidth="2.5" strokeLinecap="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "Kawasaki",
    color: "#50B848",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <text x="50" y="26" textAnchor="middle" fontWeight="900" fontSize="15" fontFamily="Space Grotesk">K</text>
        <path d="M 38,28 L 62,28" strokeWidth="2" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "Ducati",
    color: "#D6001C",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <path d="M 50,4 C 38,4 38,24 50,36 C 62,24 62,4 50,4 Z" fill="none" strokeWidth="2" className="stroke-current" />
        <path d="M 42,12 Q 52,14 56,26" fill="none" strokeWidth="2.5" strokeLinecap="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "KTM",
    color: "#FF6600",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <text x="50" y="26" textAnchor="middle" fontWeight="900" fontSize="16" fontFamily="sans-serif" letterSpacing="-1">KTM</text>
      </svg>
    ),
  },
  {
    name: "Suzuki",
    color: "#005CA9",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <path d="M 60,6 L 40,6 L 38,18 L 58,22 L 56,34 L 38,34" fill="none" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "BMW Motorrad",
    color: "#0066B2",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <circle cx="35" cy="20" r="14" fill="none" strokeWidth="2" className="stroke-current" />
        <path d="M 35,6 A 14,14 0 0,1 49,20 L 35,20 Z" />
        <path d="M 35,34 A 14,14 0 0,1 21,20 L 35,20 Z" />
        <text x="70" y="24" fontWeight="800" fontSize="8" fontFamily="Space Grotesk">MOTO</text>
      </svg>
    ),
  },
  // Jets
  {
    name: "Gulfstream",
    color: "#005A9C",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <path d="M 20,20 Q 50,6 80,20 Q 50,34 20,20 Z" fill="none" strokeWidth="2.2" className="stroke-current" />
        <text x="50" y="23" textAnchor="middle" fontWeight="900" fontSize="7" fontFamily="Space Grotesk" letterSpacing="0.5">GULFSTREAM</text>
      </svg>
    ),
  },
  {
    name: "Bombardier",
    color: "#8C7247",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <path d="M 50,4 L 75,18 L 62,36 L 50,28 L 38,36 L 25,18 Z" fill="none" strokeWidth="2.2" className="stroke-current" />
        <text x="50" y="22" textAnchor="middle" fontWeight="900" fontSize="5" fontFamily="Space Grotesk">BOMBARDIER</text>
      </svg>
    ),
  },
  {
    name: "Embraer",
    color: "#0B2545",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <polygon points="20,10 80,10 70,30 30,30" fill="none" strokeWidth="2.2" className="stroke-current" />
        <text x="50" y="23" textAnchor="middle" fontWeight="900" fontSize="7" fontFamily="Space Grotesk">EMBRAER</text>
      </svg>
    ),
  },
  {
    name: "Dassault",
    color: "#004C97",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <polygon points="50,4 85,32 50,22 15,32" fill="none" strokeWidth="2.2" className="stroke-current" />
      </svg>
    ),
  },
  {
    name: "Cessna",
    color: "#004C99",
    svg: (
      <svg viewBox="0 0 100 40" className="w-16 h-8 fill-current">
        <path d="M 20,10 L 60,10 L 80,30 L 40,30 Z" fill="none" strokeWidth="2.2" className="stroke-current" />
        <text x="48" y="23" textAnchor="middle" fontWeight="900" fontSize="8" fontFamily="Space Grotesk">CESSNA</text>
      </svg>
    ),
  },
];

// Double the list for seamless infinite loop
const carouselBrands = [...brandsList, ...brandsList];

export function Brands() {
  return (
    <section className="border-y border-white/5 py-20 bg-black/40 overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <p className="mb-12 text-center text-[10px] font-mono uppercase tracking-[0.5em] text-white/40">
          Authenticated Heritage Partners
        </p>

        {/* Marquee viewport */}
        <div className="marquee-container relative w-full overflow-hidden mask-gradient">
          <div className="marquee-content flex gap-12 w-max">
            {carouselBrands.map((brand, i) => (
              <motion.div
                key={`${brand.name}-${i}`}
                whileHover={{ scale: 1.12 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="brand-item flex items-center justify-center cursor-pointer text-white/20 hover:text-white transition-all duration-300"
                style={{ "--hover-color": brand.color }}
              >
                {brand.svg}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        
        .marquee-container {
          display: flex;
          width: 100%;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 24px)); /* Adjust for half width and spacing */
          }
        }

        .marquee-content {
          animation: marquee 35s linear infinite;
        }

        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }

        .brand-item:hover {
          color: var(--hover-color) !important;
          filter: drop-shadow(0 0 8px var(--hover-color));
        }
      `}</style>
    </section>
  );
}
