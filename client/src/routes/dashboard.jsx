import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageSquare, Tag, User, Settings, Check, LogOut, LayoutDashboard, Eye, TrendingUp, DollarSign, AlertCircle, ShoppingCart, ShieldAlert } from "lucide-react";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useFavorites, useRemoveFavorite, useInquiries, useVehicles } from "../lib/api.js";
import { formatPrice } from "../lib/vehicles.js";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NexRide X" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dbFavorites } = useFavorites(user?.token);
  const { data: dbInquiries } = useInquiries(user?.token);
  const { data: dbVehicles } = useVehicles(user?.token);
  const removeFavoriteMutation = useRemoveFavorite(user?.token);

  // General Tabs: favorites, listings, inquiries, settings
  const [activeTab, setActiveTab] = useState("listings");
  // Listings Filters: all, pending, approved, rejected, sold
  const [listingFilter, setListingFilter] = useState("all");
  // Inquiries Sub-tabs: received, sent
  const [inquirySubTab, setInquirySubTab] = useState("received");

  // Profile Form States
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [recentVehicles, setRecentVehicles] = useState([]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  // Load recently viewed vehicles from localStorage
  useEffect(() => {
    const items = localStorage.getItem("recently_viewed_list");
    if (items) {
      try {
        setRecentVehicles(JSON.parse(items));
      } catch (e) {
        localStorage.removeItem("recently_viewed_list");
      }
    }
  }, []);

  if (!user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setUpdating(true);

    const profileData = { name, phone, profileImage };
    if (password) profileData.password = password;

    const result = await updateProfile(profileData);
    if (result.success) {
      setSuccess("Profile updated successfully");
      setPassword("");
    } else {
      setError(result.error || "Failed to update profile");
    }
    setUpdating(false);
  };

  const handleRemoveFavorite = async (vehicleId) => {
    await removeFavoriteMutation.mutateAsync(vehicleId);
  };

  const handleMarkAsSold = async (vehicleId) => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: "Sold" }),
      });
      if (!res.ok) throw new Error("Failed to mark as sold");
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["jets"] });
      queryClient.invalidateQueries({ queryKey: ["ships"] });
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  // Safe arrays
  const favorites = dbFavorites || [];
  const inquiries = dbInquiries || [];
  const vehiclesList = dbVehicles || [];

  // Filter listings owned by this user
  const myVehicles = vehiclesList.filter(v => 
    v.sellerId === user._id || v.sellerId?._id === user._id || 
    v.user === user._id || v.user?._id === user._id
  );

  // Deterministic view calculator
  const getViews = (v) => Math.floor(((v.price || 0) % 947) + (v.year % 10) * 15 + 10);
  const totalViews = myVehicles.reduce((acc, v) => acc + getViews(v), 0);

  const statsApproved = myVehicles.filter(v => ["Approved", "Featured"].includes(v.status)).length;
  const statsPending = myVehicles.filter(v => v.status === "Pending").length;
  const statsSold = myVehicles.filter(v => v.status === "Sold").length;

  // Filter inquiries (Sent / Received)
  const sentInquiries = inquiries.filter(inq => 
    inq.user === user._id || inq.user?._id === user._id || inq.email === user.email
  );
  
  const receivedInquiries = inquiries.filter(inq => 
    inq.vehicle && (
      inq.vehicle.sellerId === user._id || inq.vehicle.sellerId?._id === user._id ||
      inq.vehicle.user === user._id || inq.vehicle.user?._id === user._id
    )
  );

  // Filter listings based on sub-tab status
  const filteredListings = myVehicles.filter(v => {
    if (listingFilter === "all") return true;
    if (listingFilter === "pending") return v.status === "Pending";
    if (listingFilter === "approved") return ["Approved", "Featured"].includes(v.status);
    if (listingFilter === "rejected") return v.status === "Rejected";
    if (listingFilter === "sold") return v.status === "Sold";
    return true;
  });

  return (
    <>
      <PageHeader
        eyebrow="Portal"
        title={
          <>
            YOUR <span className="text-cyan-glow">PORTAL</span>
          </>
        }
        description={`Welcome back, ${user.name}. Manage your listings, statistics, and inquiries.`}
      />
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        {/* User Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12 glass-morph rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <img
              src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
              className="size-16 rounded-full border border-cyan-glow/20 object-cover"
              alt={user.name}
            />
            <div>
              <h2 className="font-display text-lg font-bold text-white uppercase">{user.name}</h2>
              <p className="text-xs text-white/50">{user.email}</p>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-glow border border-cyan-glow/10">
                {user.role} Account
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-cyan-glow hover:bg-cyan-glow hover:text-black transition-all"
              >
                <LayoutDashboard size={12} />
                <span>Admin Dashboard</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-full border border-white/10 hover:border-red-500/30 px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dynamic Stats Row (Listing Stats) */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mb-12">
          <div className="glass-morph rounded-2xl p-6">
            <Tag className="mb-4 text-cyan-glow" size={20} />
            <div className="font-display text-3xl font-bold text-white">{myVehicles.length}</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/40">
              Total Listings
            </div>
          </div>
          <div className="glass-morph rounded-2xl p-6">
            <Check className="mb-4 text-emerald-400" size={20} />
            <div className="font-display text-3xl font-bold text-white">{statsApproved}</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/40">
              Approved / Live
            </div>
          </div>
          <div className="glass-morph rounded-2xl p-6">
            <TrendingUp className="mb-4 text-amber-400" size={20} />
            <div className="font-display text-3xl font-bold text-white">{statsPending}</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/40">
              Pending Review
            </div>
          </div>
          <div className="glass-morph rounded-2xl p-6">
            <Eye className="mb-4 text-purple-400" size={20} />
            <div className="font-display text-3xl font-bold text-white">{totalViews}</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/40">
              Listing Views
            </div>
          </div>
          <div className="glass-morph rounded-2xl p-6 col-span-2 md:col-span-1">
            <DollarSign className="mb-4 text-cyan-glow" size={20} />
            <div className="font-display text-3xl font-bold text-white">{statsSold}</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/40">
              Assets Sold
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/5 gap-6 mb-8 overflow-x-auto">
          {[
            { id: "listings", label: "My Listings", icon: Tag },
            { id: "favorites", label: "My Wishlist", icon: Heart },
            { id: "inquiries", label: "Inquiries Hub", icon: MessageSquare },
            { id: "settings", label: "Profile Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-cyan-glow text-cyan-glow"
                  : "border-transparent text-white/40 hover:text-white/80"
              }`}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panel Content */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            {/* Listing Sub-navigation filter */}
            <div className="flex flex-wrap gap-2 pb-2">
              {[
                { id: "all", label: `All (${myVehicles.length})` },
                { id: "approved", label: `Live (${statsApproved})` },
                { id: "pending", label: `Pending (${statsPending})` },
                { id: "rejected", label: `Rejected (${myVehicles.filter(v => v.status === "Rejected").length})` },
                { id: "sold", label: `Sold (${statsSold})` },
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setListingFilter(subTab.id)}
                  className={`rounded-full border px-4 py-2 text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    listingFilter === subTab.id
                      ? "border-cyan-glow bg-cyan-glow/10 text-cyan-glow"
                      : "border-white/10 text-white/60 hover:border-white/20"
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {filteredListings.length === 0 ? (
              <div className="text-center py-16 glass-morph rounded-2xl">
                <Tag className="mx-auto mb-4 text-white/20" size={36} />
                <p className="text-sm text-white/50">No listings found in this category.</p>
                <Link to="/sell" className="mt-4 inline-block rounded-full bg-cyan-glow px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-black">
                  Create New Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((v) => (
                  <div key={v._id || v.id} className="glass-morph rounded-2xl p-5 flex flex-col justify-between border border-white/5 relative overflow-hidden">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                      <span className={`size-2 rounded-full ${
                        v.status === "Pending" ? "bg-amber-400 animate-pulse" :
                        v.status === "Approved" || v.status === "Featured" ? "bg-cyan-glow" :
                        v.status === "Rejected" ? "bg-red-500" :
                        "bg-white/40"
                      }`} />
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${
                        v.status === "Pending" ? "text-amber-400" :
                        v.status === "Approved" || v.status === "Featured" ? "text-cyan-glow" :
                        v.status === "Rejected" ? "text-red-400" :
                        "text-white/40"
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="flex gap-4">
                      <img src={v.image} className="size-24 rounded-xl object-cover border border-white/5" alt={v.model} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-base font-bold text-white truncate pr-16">
                          {v.brand} {v.model}
                        </h3>
                        <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1">
                          {v.year} • {v.category.toUpperCase()} • {v.subcategory}
                        </p>
                        <div className="mt-2 text-xs font-bold text-cyan-glow">
                          {formatPrice(v.price)}
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-[9px] text-white/50">
                          <span className="flex items-center gap-1"><Eye size={10} /> {getViews(v)} views</span>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Alert Box */}
                    {v.status === "Rejected" && v.rejectionReason && (
                      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-[10px] text-red-400 flex items-start gap-2">
                        <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold uppercase tracking-wider block">Rejection Reason:</span>
                          <span className="text-white/70 mt-0.5 block">"{v.rejectionReason}"</span>
                        </div>
                      </div>
                    )}

                    {/* Actions Panel */}
                    <div className="mt-5 border-t border-white/5 pt-4 flex justify-between items-center gap-3">
                      <span className="text-[9px] uppercase tracking-widest text-white/30">
                        Listing ID: {(v._id || v.id).slice(-6)}
                      </span>
                      <div className="flex gap-2">
                        {v.status !== "Sold" && (v.status === "Approved" || v.status === "Featured") && (
                          <button
                            onClick={() => handleMarkAsSold(v._id || v.id)}
                            className="rounded-full border border-cyan-glow/20 hover:border-cyan-glow px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-cyan-glow bg-cyan-glow/5 hover:bg-cyan-glow hover:text-black transition-all cursor-pointer"
                          >
                            Mark As Sold
                          </button>
                        )}
                        <Link
                          to={`/${v.category}s`}
                          className="rounded-full border border-white/10 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-12 glass-morph rounded-2xl">
                <Heart className="mx-auto mb-4 text-white/20" size={36} />
                <p className="text-sm text-white/50">Your wishlist is empty.</p>
                <Link to="/cars" className="mt-4 inline-block rounded-full bg-cyan-glow px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-black">
                  Browse Vehicles
                </Link>
              </div>
            ) : (
              favorites.map((fav) => {
                const v = fav.vehicle;
                if (!v) return null;
                const id = v._id || v.id;
                return (
                  <div key={id} className="glass-morph flex flex-wrap items-center justify-between gap-6 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center gap-4">
                      <img src={v.image} className="size-20 rounded-lg object-cover" alt={v.model} />
                      <div>
                        <h3 className="font-display text-base font-bold text-white">
                          {v.brand} {v.model}
                        </h3>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
                          {v.year} • {v.fuel} • {v.subcategory}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-cyan-glow text-sm">{formatPrice(v.price)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemoveFavorite(id)}
                          className="rounded-full border border-white/10 hover:border-red-500/20 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-red-400 hover:bg-red-500/5 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="space-y-6">
            {/* Inquiry sub-navigation */}
            <div className="flex border-b border-white/5 gap-4">
              <button
                onClick={() => setInquirySubTab("received")}
                className={`pb-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  inquirySubTab === "received" ? "border-cyan-glow text-cyan-glow" : "border-transparent text-white/40"
                }`}
              >
                Acquisition Offers Received ({receivedInquiries.length})
              </button>
              <button
                onClick={() => setInquirySubTab("sent")}
                className={`pb-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  inquirySubTab === "sent" ? "border-cyan-glow text-cyan-glow" : "border-transparent text-white/40"
                }`}
              >
                Inquiries Sent ({sentInquiries.length})
              </button>
            </div>

            {inquirySubTab === "received" ? (
              <div className="space-y-4">
                {receivedInquiries.length === 0 ? (
                  <div className="text-center py-12 glass-morph rounded-2xl">
                    <MessageSquare className="mx-auto mb-4 text-white/20" size={36} />
                    <p className="text-sm text-white/50">No inquiries received from buyers yet.</p>
                  </div>
                ) : (
                  receivedInquiries.map((inq) => {
                    const v = inq.vehicle;
                    if (!v) return null;
                    return (
                      <div key={inq._id} className="glass-morph rounded-2xl p-6 space-y-4 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-cyan-glow"></div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <img src={v.image} className="size-12 rounded object-cover" alt={v.model} />
                            <div>
                              <h4 className="font-display text-sm font-bold text-white">
                                Bid / Offer on {v.brand} {v.model}
                              </h4>
                              <span className="text-[9px] text-white/40 uppercase tracking-widest">
                                Received on {new Date(inq.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-cyan-glow">{formatPrice(v.price)}</span>
                        </div>

                        {/* Buyer Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-white/40 block">Buyer Name</span>
                            <span className="text-xs font-bold text-white mt-1 block">{inq.name}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-white/40 block">Email Address</span>
                            <span className="text-xs font-bold text-white mt-1 block">{inq.email}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-white/40 block">Phone Connection</span>
                            <span className="text-xs font-bold text-white mt-1 block">{inq.phone || "Not provided"}</span>
                          </div>
                        </div>

                        {/* Inquiry message box */}
                        <div className="text-xs text-white/70 leading-relaxed bg-cyan-glow/5 border border-cyan-glow/10 p-4 rounded-xl">
                          <p className="font-bold text-[9px] uppercase tracking-widest text-cyan-glow mb-1">Message Detail:</p>
                          "{inq.message}"
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sentInquiries.length === 0 ? (
                  <div className="text-center py-12 glass-morph rounded-2xl">
                    <MessageSquare className="mx-auto mb-4 text-white/20" size={36} />
                    <p className="text-sm text-white/50">No active inquiries submitted.</p>
                  </div>
                ) : (
                  sentInquiries.map((inq) => {
                    const v = inq.vehicle;
                    if (!v) return null;
                    return (
                      <div key={inq._id} className="glass-morph rounded-2xl p-6 space-y-4 border border-white/5">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <div className="flex items-center gap-3">
                            <img src={v.image} className="size-12 rounded object-cover" alt={v.model} />
                            <div>
                              <h4 className="font-display text-sm font-bold text-white">
                                Inquiry on {v.brand} {v.model}
                              </h4>
                              <span className="text-[9px] text-white/40 uppercase tracking-widest">
                                Submitted on {new Date(inq.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-cyan-glow">{formatPrice(v.price)}</span>
                        </div>
                        <div className="text-xs text-white/70 leading-relaxed bg-white/5 p-4 rounded-xl">
                          <p className="font-bold text-[9px] uppercase tracking-widest text-white/40 mb-1">Your Message:</p>
                          "{inq.message}"
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <form onSubmit={handleUpdateProfile} className="glass-morph rounded-2xl p-8 space-y-6 max-w-2xl border border-white/5">
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Profile Configurations
            </h3>

            {success && (
              <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-xs text-green-400">
                <Check size={16} />
                <span>{success}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
                <Settings size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60">Full Name</span>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60">Phone Number</span>
                <input
                  className="input"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60">Profile Image URL</span>
              <input
                className="input"
                type="text"
                placeholder="https://example.com/avatar.jpg"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </label>

            <label className="block border-t border-white/5 pt-6">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/60">Change Password (Leave blank to keep current)</span>
              <input
                className="input"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button
              type="submit"
              disabled={updating}
              className="rounded-xl bg-cyan-glow px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.01] cursor-pointer disabled:opacity-50"
            >
              {updating ? "Saving changes..." : "Save Configuration"}
            </button>
          </form>
        )}

        {/* Recently Viewed Section */}
        {recentVehicles.length > 0 && (
          <div className="mt-16">
            <h3 className="mb-6 font-display text-2xl font-bold uppercase text-white">Recently Viewed</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentVehicles.map((v) => (
                <div key={v._id || v.id} className="glass-morph overflow-hidden rounded-2xl group flex flex-col justify-between border border-white/5">
                  <img src={v.image} alt={v.model} className="aspect-[16/10] w-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display text-sm font-bold text-white">{v.brand} {v.model}</h4>
                      <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1">{v.year}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-xs font-bold text-cyan-glow">{formatPrice(v.price)}</span>
                      <Link to={`/${v.category}s`} className="text-[9px] font-bold uppercase tracking-widest text-white/60 hover:text-cyan-glow">
                        Inspect
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
