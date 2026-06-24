import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Check, AlertCircle, LogIn } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { PremiumDropdown } from "../components/ui/PremiumDropdown.jsx";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "Sell Your Vehicle — NexRide X" }] }),
  component: SellPage,
});

function SellPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [category, setCategory] = useState("car");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [hp, setHp] = useState("");
  const [topSpeed, setTopSpeed] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Default premium images depending on category if no URL is provided
    let finalImageUrl = imageUrl;
    if (!finalImageUrl) {
      if (category === "car") {
        finalImageUrl = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80";
      } else if (category === "bike") {
        finalImageUrl = "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80";
      } else if (category === "ship") {
        finalImageUrl = "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&auto=format&fit=crop&q=80";
      } else {
        finalImageUrl = "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?w=600&auto=format&fit=crop&q=80";
      }
    }

    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          brand,
          model,
          year: Number(year),
          price: Number(price),
          mileage: mileage || "0 mi",
          fuel: "Gasoline", // default
          category,
          subcategory: category === "car" ? "Supercar" : category === "bike" ? "Sports Bike" : category === "ship" ? "Luxury Yacht" : "Executive Jet",
          image: finalImageUrl,
          hp: hp || "450 HP",
          topSpeed: topSpeed || "180 mph",
          tag: "New Arrival",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit vehicle listing");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <PageHeader
          eyebrow="Consign / Sell"
          title={<>LIST YOUR <span className="text-cyan-glow">MASTERPIECE</span></>}
          description="Reach a global network of verified collectors and acquisition specialists."
        />
        <section className="mx-auto max-w-md px-6 py-16 sm:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morph rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden"
          >
            {/* Cyan Glow Top Highlight */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-glow to-transparent shadow-[0_0_15px_#00f2ff]"></div>
            
            <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
              Authentication Required
            </h2>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Consignment listings require a verified collector account. Please sign in to consign your vehicle.
            </p>
            <div className="mt-8">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-glow py-4 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <LogIn size={14} />
                <span>Go to Login</span>
              </Link>
            </div>
          </motion.div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Consign / Sell"
        title={<>LIST YOUR <span className="text-cyan-glow">MASTERPIECE</span></>}
        description="Reach a global network of verified collectors and acquisition specialists."
      />
      <section className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morph rounded-2xl p-12 text-center"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-cyan-glow text-black">
              <Check size={32} />
            </div>
            <h2 className="font-display text-3xl font-bold">Listing Submitted</h2>
            <p className="mt-3 text-white/60">
              Your vehicle listing has been submitted for review. It will become live once approved by an administrator.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => setSubmitted(false)}
                className="rounded-full border border-white/10 hover:border-cyan-glow px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-cyan-glow"
              >
                List Another
              </button>
              <Link
                to="/dashboard"
                className="rounded-full bg-cyan-glow px-6 py-3 text-xs font-bold uppercase tracking-widest text-black"
              >
                Go to Portal
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-morph space-y-6 rounded-2xl p-8">
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Category">
                <PremiumDropdown
                  value={category}
                  onChange={setCategory}
                  options={[
                    { label: "Car", value: "car" },
                    { label: "Bike", value: "bike" },
                    { label: "Jet", value: "jet" },
                    { label: "Ship / Yacht", value: "ship" },
                  ]}
                  placeholder="Select Category"
                />
              </Field>
              <Field label="Brand">
                <input
                  className="input"
                  placeholder="Bugatti"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </Field>
              <Field label="Model">
                <input
                  className="input"
                  placeholder="Chiron Mistral"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </Field>
              <Field label="Year">
                <input
                  className="input"
                  type="number"
                  placeholder="2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </Field>
              <Field label="Mileage / Hours">
                <input
                  className="input"
                  placeholder="1,200 mi"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                />
              </Field>
              <Field label="Asking Price (USD)">
                <input
                  className="input"
                  type="number"
                  placeholder="5000000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Field>
              <Field label="Horsepower (e.g. 1500 HP)">
                <input
                  className="input"
                  placeholder="1,500 HP"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  required
                />
              </Field>
              <Field label="Top Speed (e.g. 261 mph)">
                <input
                  className="input"
                  placeholder="261 mph"
                  value={topSpeed}
                  onChange={(e) => setTopSpeed(e.target.value)}
                  required
                />
              </Field>
            </div>
            <Field label="Vehicle Image URL (Optional)">
              <input
                className="input"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </Field>
            <Field label="Description">
              <textarea
                className="input min-h-32"
                placeholder="Provenance, modifications, service history..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-glow py-4 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.01] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Submitting for review..." : "Submit For Review"}
            </button>
          </form>
        )}
      </section>
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

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60">
        {label}
      </span>
      {children}
    </label>
  );
}
