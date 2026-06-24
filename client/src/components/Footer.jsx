import { Link } from "@tanstack/react-router";
export function Footer() {
    return (<footer className="px-8 py-20">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 border-t border-white/10 pt-12 md:flex-row">
        <div className="space-y-6">
          <div className="font-display text-2xl font-bold tracking-tighter">
            <span className="text-cyan-glow">NEX</span>RIDE X
          </div>
          <p className="max-w-xs text-sm text-white/40">
            The world's first multi-category luxury vehicle ecosystem for the discerning collector.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-cyan-glow">Platform</h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/cars" className="transition-colors hover:text-white">Cars</Link></li>
              <li><Link to="/bikes" className="transition-colors hover:text-white">Bikes</Link></li>
              <li><Link to="/jets" className="transition-colors hover:text-white">Private Jets</Link></li>
              <li><Link to="/ships" className="transition-colors hover:text-white">Ships & Yachts</Link></li>
              <li><Link to="/sell" className="transition-colors hover:text-white">Consign / Sell</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-cyan-glow">Network</h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link to="/dealers" className="transition-colors hover:text-white">Dealers</Link></li>
              <li><Link to="/dashboard" className="transition-colors hover:text-white">Portal</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-white">Concierge</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-cyan-glow">Global</h5>
            <ul className="space-y-2 text-sm text-white/60">
              <li>London</li>
              <li>Dubai</li>
              <li>New York</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 flex max-w-7xl justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
        <span>© 2026 NEXRIDE X TECHNOLOGY GROUP</span>
        <span>PRIVACY / TERMS / DISCLOSURES</span>
      </div>
    </footer>);
}
