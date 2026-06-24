import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Car,
  Bike,
  Plane,
  Anchor,
  Users,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  X,
  Shield,
  Star,
  Eye,
  Zap,
  Gauge,
  CircleDollarSign,
  UserCheck,
  FileText,
  PieChart as PieChartIcon,
  Settings as SettingsIcon,
  Menu,
  Upload,
  AlertCircle,
  Package,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { PremiumDropdown } from "../components/ui/PremiumDropdown.jsx";
import {
  useVehicles,
  useBrands,
  useCategories,
  useInquiries,
  useReviews,
  useUpdateVehicleStatus,
} from "../lib/api.js";
import { formatPrice } from "../lib/vehicles.js";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — NexRide X" }] }),
  component: AdminPage,
});

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORY_LABELS = { car: "Cars", bike: "Bikes", jet: "Jets", ship: "Ships" };
const FUEL_OPTIONS = [
  { label: "Gasoline", value: "Gasoline" },
  { label: "Diesel", value: "Diesel" },
  { label: "Electric", value: "Electric" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Jet Fuel", value: "Jet Fuel" },
  { label: "Marine Diesel", value: "Marine Diesel" },
];
const STATUS_OPTIONS = [
  { label: "Available", value: "Available" },
  { label: "Sold", value: "Sold" },
  { label: "Featured", value: "Featured" },
  { label: "Discounted", value: "Discounted" },
  { label: "Coming Soon", value: "Coming Soon" },
  { label: "Pending Review", value: "Pending" },
  { label: "Rejected", value: "Rejected" },
];

const DISCOUNT_OPTIONS = [
  { label: "0%", value: 0 },
  { label: "5%", value: 5 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
  { label: "20%", value: 20 },
  { label: "25%", value: 25 },
  { label: "30%", value: 30 },
];
const DEFAULT_IMAGES = {
  car: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80",
  bike: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80",
  jet: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?w=600&auto=format&fit=crop&q=80",
  ship: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&auto=format&fit=crop&q=80",
};

// ─── INITIAL FORM STATE ────────────────────────────────────────────────────────
const BLANK_FORM = {
  category: "car",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  price: "",
  mileage: "",
  fuel: "Gasoline",
  subcategory: "",
  description: "",
  hp: "",
  topSpeed: "",
  tag: "",
  status: "Available",
  discountPercentage: 0,
  stock: 1,
  images: [],
  featuresText: "",
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  // React Query hooks
  const { data: vehicles = [], refetch: refetchVehicles } = useVehicles(user.token);
  const { data: brands = [], refetch: refetchBrands } = useBrands();
  const { data: categories = [] } = useCategories();
  const { data: inquiries = [] } = useInquiries(user.token);
  const { data: reviews = [], refetch: refetchReviews } = useReviews();
  const updateStatusMutation = useUpdateVehicleStatus(user.token);

  // Users state
  const [users, setUsers] = useState([]);
  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (e) { console.error(e); }
  }, [user.token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Layout state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [inspectVehicle, setInspectVehicle] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApprovalVehicle, setSelectedApprovalVehicle] = useState(null);
  const [showRejectReasonModal, setShowRejectReasonModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Form state
  const [form, setForm] = useState(BLANK_FORM);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Brands form state
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandCategory, setNewBrandCategory] = useState("car");

  // ─── FORM HELPERS ─────────────────────────────────────────────────────────
  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const clearForm = () => {
    setForm(BLANK_FORM);
    setNewImageUrl("");
    setFormError("");
  };

  const openAddModal = (category) => {
    clearForm();
    setField("category", category);
    setShowAddModal(true);
  };

  const openEditModal = (v) => {
    setEditingVehicle(v);
    setForm({
      category: v.category || "car",
      brand: v.brand || "",
      model: v.model || "",
      year: v.year || new Date().getFullYear(),
      price: v.originalPrice || v.price || "",
      mileage: v.mileage || "",
      fuel: v.fuel || "Gasoline",
      subcategory: v.subcategory || "",
      description: v.description || "",
      hp: v.hp || "",
      topSpeed: v.topSpeed || "",
      tag: v.tag || "",
      status: v.status || "Available",
      discountPercentage: v.discountPercentage !== undefined ? v.discountPercentage : 0,
      stock: v.stock !== undefined ? v.stock : 1,
      images: v.images && v.images.length > 0 ? [...v.images] : (v.image ? [v.image] : []),
      featuresText: v.features ? v.features.join("\n") : "",
    });
    setShowEditModal(true);
  };

  // ─── IMAGE MANAGEMENT ─────────────────────────────────────────────────────
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((f) => ({ ...f, images: [...f.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setForm((f) => ({ ...f, images: [...f.images, newImageUrl.trim()] }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (idx) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleReorderImage = (idx, dir) => {
    setForm((f) => {
      const imgs = [...f.images];
      if (dir === "left" && idx > 0) [imgs[idx], imgs[idx - 1]] = [imgs[idx - 1], imgs[idx]];
      else if (dir === "right" && idx < imgs.length - 1) [imgs[idx], imgs[idx + 1]] = [imgs[idx + 1], imgs[idx]];
      return { ...f, images: imgs };
    });
  };

  const handleSetPrimaryImage = (idx) => {
    setForm((f) => {
      const imgs = [...f.images];
      const [primary] = imgs.splice(idx, 1);
      return { ...f, images: [primary, ...imgs] };
    });
  };

  // ─── CRUD OPERATIONS ──────────────────────────────────────────────────────
  const buildPayload = () => ({
    brand: form.brand,
    model: form.model,
    year: Number(form.year),
    price: Number(form.price),
    mileage: form.mileage || "0 mi",
    fuel: form.fuel || "Gasoline",
    category: form.category,
    subcategory: form.subcategory || "",
    description: form.description || "",
    image: form.images[0] || DEFAULT_IMAGES[form.category],
    images: form.images.length > 0 ? form.images : [DEFAULT_IMAGES[form.category]],
    features: form.featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
    hp: form.hp || "",
    topSpeed: form.topSpeed || "",
    tag: form.tag || "",
    status: form.status || "Available",
    discountPercentage: Number(form.discountPercentage) || 0,
    stock: Number(form.stock) || 1,
  });

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create vehicle");
      setShowAddModal(false);
      clearForm();
      refetchVehicles();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditVehicle = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const res = await fetch(`/api/vehicles/${editingVehicle._id || editingVehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update vehicle");
      setShowEditModal(false);
      setEditingVehicle(null);
      clearForm();
      refetchVehicles();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDeleteVehicle = (v) => {
    setVehicleToDelete(v);
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    try {
      const id = vehicleToDelete._id || vehicleToDelete.id;
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        refetchVehicles();
        setVehicleToDelete(null);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete vehicle");
      }
    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
    }
  };

  const handleApproveListing = async (id) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: "Approved" });
      setShowApprovalModal(false);
      setSelectedApprovalVehicle(null);
      refetchVehicles();
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleRejectListingSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason) { alert("Please provide a rejection reason."); return; }
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedApprovalVehicle._id || selectedApprovalVehicle.id,
        status: "Rejected",
        rejectionReason: rejectReason,
      });
      setShowRejectReasonModal(false);
      setRejectReason("");
      setShowApprovalModal(false);
      setSelectedApprovalVehicle(null);
      refetchVehicles();
    } catch (err) { alert("Error: " + err.message); }
  };

  const toggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`/api/users/${targetUser._id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch (e) { console.error(e); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) fetchUsers();
    } catch (e) { console.error(e); }
  };

  const handleCreateBrand = async (e) => {
    e.preventDefault();
    if (!newBrandName) return;
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ name: newBrandName, category: newBrandCategory }),
      });
      if (res.ok) { setNewBrandName(""); refetchBrands(); }
    } catch (e) { console.error(e); }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm("Delete this brand?")) return;
    try {
      const res = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) refetchBrands();
    } catch (e) { console.error(e); }
  };

  // ─── COMPUTED STATS ───────────────────────────────────────────────────────
  const totalCars = vehicles.filter((v) => v.category === "car").length;
  const totalBikes = vehicles.filter((v) => v.category === "bike").length;
  const totalJets = vehicles.filter((v) => v.category === "jet").length;
  const totalShips = vehicles.filter((v) => v.category === "ship").length;
  const pendingCount = vehicles.filter((v) => v.status === "Pending").length;
  const featuredCount = vehicles.filter((v) => v.status === "Featured").length;
  const soldCount = vehicles.filter((v) => v.status === "Sold").length;
  const totalRevenue = vehicles.filter((v) => v.status === "Sold").reduce((s, v) => s + (v.price || 0), 0);
  const outOfStock = vehicles.filter((v) => (v.stock || 1) <= 0).length;
  const lowStock = vehicles.filter((v) => (v.stock || 1) > 0 && (v.stock || 1) <= 3).length;
  const totalStock = vehicles.reduce((s, v) => s + (v.stock !== undefined ? v.stock : 1), 0);

  const sellers = users.filter((u) =>
    vehicles.some((v) =>
      v.sellerId === u._id || v.user === u._id ||
      v.sellerId?._id === u._id || v.user?._id === u._id
    )
  );

  // ─── CHART DATA ───────────────────────────────────────────────────────────
  const categoryDistribution = [
    { name: "Cars", value: totalCars, color: "#00f2ff" },
    { name: "Bikes", value: totalBikes, color: "#a855f7" },
    { name: "Jets", value: totalJets, color: "#facc15" },
    { name: "Ships", value: totalShips, color: "#10b981" },
  ];
  const listingGrowthData = [
    { name: "Jan", Listings: 5 }, { name: "Feb", Listings: 14 },
    { name: "Mar", Listings: 28 }, { name: "Apr", Listings: 45 },
    { name: "May", Listings: 64 }, { name: "Jun", Listings: vehicles.length },
  ];
  const userGrowthData = [
    { name: "Jan", Users: 2 }, { name: "Feb", Users: 6 },
    { name: "Mar", Users: 12 }, { name: "Apr", Users: 22 },
    { name: "May", Users: 35 }, { name: "Jun", Users: users.length },
  ];
  const approvalStatusData = [
    { name: "Approved", count: vehicles.filter((v) => ["Approved", "Featured"].includes(v.status)).length },
    { name: "Pending", count: pendingCount },
    { name: "Rejected", count: vehicles.filter((v) => v.status === "Rejected").length },
    { name: "Sold", count: soldCount },
  ];

  // ─── SIDEBAR MENU ─────────────────────────────────────────────────────────
  const sidebarMenu = [
    {
      group: "Dashboard",
      items: [{ id: "dashboard", label: "Overview", icon: LayoutDashboard }],
    },
    {
      group: "Vehicles",
      items: [
        { id: "cars", label: `Cars (${totalCars})`, icon: Car },
        { id: "bikes", label: `Bikes (${totalBikes})`, icon: Bike },
        { id: "jets", label: `Jets (${totalJets})`, icon: Plane },
        { id: "ships", label: `Ships (${totalShips})`, icon: Anchor },
      ],
    },
    {
      group: "Management",
      items: [
        { id: "users", label: "Users", icon: Users },
        { id: "sellers", label: "Sellers", icon: UserCheck },
        { id: "approvals", label: `Reviews (${pendingCount})`, icon: Shield },
        { id: "inquiries", label: "Inquiries", icon: MessageSquare },
      ],
    },
    {
      group: "Content",
      items: [
        { id: "brands", label: "Brands", icon: Star },
        { id: "categories", label: "Categories", icon: FileText },
      ],
    },
    {
      group: "Analytics",
      items: [
        { id: "reports", label: "Reports", icon: FileText },
        { id: "statistics", label: "Visual Stats", icon: PieChartIcon },
      ],
    },
    {
      group: "Settings",
      items: [{ id: "settings", label: "Settings", icon: SettingsIcon }],
    },
  ];

  // ─── SIDEBAR RENDER ───────────────────────────────────────────────────────
  const SidebarContent = ({ mobile = false }) => (
    <div className="space-y-6 overflow-y-auto pr-1 flex-1">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        {(!sidebarCollapsed || mobile) && (
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-glow">
            Admin System
          </span>
        )}
        {!mobile && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-[10px] uppercase font-bold text-white/40 hover:text-white cursor-pointer ml-auto"
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        )}
        {mobile && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 text-white/40 hover:text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {sidebarMenu.map((group) => (
        <div key={group.group} className="space-y-1">
          {(!sidebarCollapsed || mobile) && (
            <h4 className="text-[9px] font-bold uppercase tracking-wider text-white/30 px-3 mb-1.5">
              {group.group}
            </h4>
          )}
          {group.items.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); if (mobile) setMobileSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === item.id
                  ? "bg-cyan-glow/15 text-cyan-glow border-l-2 border-cyan-glow shadow-[0_0_15px_rgba(0,242,255,0.08)]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={14} className={activeTab === item.id ? "text-cyan-glow shrink-0" : "shrink-0"} />
              {(!sidebarCollapsed || mobile) && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  // ─── VEHICLE FORM (shared for Add & Edit) ─────────────────────────────────
  const VehicleForm = ({ onSubmit, isEdit = false }) => (
    <form onSubmit={onSubmit} className="space-y-5 text-xs">
      {formError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{formError}</span>
        </div>
      )}

      {/* Row 1: Category + Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Category</Label>
          <PremiumDropdown
            value={form.category}
            onChange={(v) => setField("category", v)}
            options={[
              { label: "Car", value: "car" },
              { label: "Bike", value: "bike" },
              { label: "Jet", value: "jet" },
              { label: "Ship / Yacht", value: "ship" },
            ]}
            placeholder="Select Category"
            triggerClassName="!py-2.5"
          />
        </div>
        <div>
          <Label>Brand *</Label>
          <input className="input" placeholder="e.g. Bugatti" value={form.brand} onChange={(e) => setField("brand", e.target.value)} required />
        </div>
      </div>

      {/* Row 2: Model + Year */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Model *</Label>
          <input className="input" placeholder="e.g. Chiron Pur Sport" value={form.model} onChange={(e) => setField("model", e.target.value)} required />
        </div>
        <div>
          <Label>Year *</Label>
          <input className="input" type="number" placeholder="2025" value={form.year} onChange={(e) => setField("year", e.target.value)} required />
        </div>
      </div>

      {/* Row 3: Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price (USD) *</Label>
          <input className="input" type="number" placeholder="4500000" value={form.price} onChange={(e) => setField("price", e.target.value)} required />
        </div>
        <div>
          <Label>Stock Quantity</Label>
          <input className="input" type="number" min="0" placeholder="1" value={form.stock} onChange={(e) => setField("stock", e.target.value)} />
        </div>
      </div>

      {/* Row 4: Mileage + Fuel */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Mileage / Hours</Label>
          <input className="input" placeholder="e.g. 1,200 mi" value={form.mileage} onChange={(e) => setField("mileage", e.target.value)} />
        </div>
        <div>
          <Label>Fuel / Power Type</Label>
          <PremiumDropdown
            value={form.fuel}
            onChange={(v) => setField("fuel", v)}
            options={FUEL_OPTIONS}
            placeholder="Select Fuel"
            triggerClassName="!py-2.5"
          />
        </div>
      </div>

      {/* Row 5: HP + Top Speed */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Output Power</Label>
          <input className="input" placeholder="e.g. 1,600 HP" value={form.hp} onChange={(e) => setField("hp", e.target.value)} />
        </div>
        <div>
          <Label>Vmax Speed</Label>
          <input className="input" placeholder="e.g. 261 mph" value={form.topSpeed} onChange={(e) => setField("topSpeed", e.target.value)} />
        </div>
      </div>

      {/* Row 6: Subcategory + Tag */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Subcategory</Label>
          <input className="input" placeholder="e.g. Megacar, Luxury Yacht" value={form.subcategory} onChange={(e) => setField("subcategory", e.target.value)} />
        </div>
        <div>
          <Label>Tag Label</Label>
          <input className="input" placeholder="e.g. Featured, Rare, New Arrival" value={form.tag} onChange={(e) => setField("tag", e.target.value)} />
        </div>
      </div>

      {/* Status & Discount Percentage Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Listing Status</Label>
          <PremiumDropdown
            value={form.status}
            onChange={(v) => {
              setField("status", v);
              if (v === "Discounted") {
                if (Number(form.discountPercentage) === 0) {
                  setField("discountPercentage", 10);
                }
              } else {
                setField("discountPercentage", 0);
              }
            }}
            options={STATUS_OPTIONS}
            placeholder="Select Status"
            triggerClassName="!py-2.5"
          />
        </div>
        <div>
          <Label>Discount Percentage</Label>
          <PremiumDropdown
            value={Number(form.discountPercentage)}
            onChange={(v) => {
              const pct = Number(v);
              setField("discountPercentage", pct);
              if (pct > 0) {
                setField("status", "Discounted");
              } else if (form.status === "Discounted") {
                setField("status", "Available");
              }
            }}
            options={DISCOUNT_OPTIONS}
            placeholder="Select Discount"
            triggerClassName="!py-2.5"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea
          className="input min-h-20"
          placeholder="Provenance, modifications, service history, condition notes..."
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </div>

      {/* ── IMAGE MANAGER ── */}
      <div className="space-y-3 border-t border-white/5 pt-4">
        <span className="block text-[10px] font-bold uppercase tracking-widest text-white/60">
          Product Images
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste image URL..."
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="input flex-1 text-xs"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="bg-white/5 border border-white/10 px-3 rounded-xl font-bold hover:border-cyan-glow transition-colors cursor-pointer text-[10px] uppercase tracking-wider whitespace-nowrap"
          >
            Add URL
          </button>
          <label className="flex items-center gap-1 bg-cyan-glow text-black px-3 py-2 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer text-[10px] whitespace-nowrap">
            <Upload size={11} />
            Upload
            <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="hidden" />
          </label>
        </div>

        {form.images.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group bg-neutral-950">
                <img src={img} className="size-full object-cover" alt="" onError={(e) => { e.target.src = DEFAULT_IMAGES.car; }} />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-bold uppercase tracking-wider text-cyan-glow">
                      {idx === 0 ? "PRIMARY" : `#${idx + 1}`}
                    </span>
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-400 hover:text-red-300 cursor-pointer">
                      <X size={10} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      <button type="button" disabled={idx === 0} onClick={() => handleReorderImage(idx, "left")}
                        className="px-1.5 py-0.5 rounded bg-white/10 text-white disabled:opacity-30 cursor-pointer text-[9px]">←</button>
                      <button type="button" disabled={idx === form.images.length - 1} onClick={() => handleReorderImage(idx, "right")}
                        className="px-1.5 py-0.5 rounded bg-white/10 text-white disabled:opacity-30 cursor-pointer text-[9px]">→</button>
                    </div>
                    {idx !== 0 && (
                      <button type="button" onClick={() => handleSetPrimaryImage(idx)}
                        className="text-[7px] font-bold uppercase tracking-wider bg-cyan-glow text-black px-1.5 py-0.5 rounded cursor-pointer">
                        Set Primary
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-white/10 rounded-xl p-6 text-center text-white/30 text-[10px] uppercase tracking-wider">
            No images added — a default image will be used
          </div>
        )}
      </div>

      {/* ── FEATURES BULLETPOINTS ── */}
      <div className="border-t border-white/5 pt-4">
        <Label>Features & Specifications (one per line)</Label>
        <textarea
          className="input min-h-24"
          placeholder={"Flawless carbon fiber body&#10;Verified track telemetry&#10;Titanium exhaust system"}
          value={form.featuresText}
          onChange={(e) => setField("featuresText", e.target.value)}
        />
        <p className="text-[9px] text-white/30 mt-1">Each line becomes a bullet point on the vehicle detail page.</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={formLoading}
        className="w-full rounded-xl bg-cyan-glow py-3.5 text-xs font-bold uppercase tracking-widest text-black cursor-pointer hover:bg-white transition-colors disabled:opacity-60"
      >
        {formLoading
          ? (isEdit ? "Saving Changes..." : "Creating Listing...")
          : (isEdit ? "Save Changes" : `Add ${CATEGORY_LABELS[form.category] || "Vehicle"}`)}
      </button>
    </form>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <>
      <PageHeader
        eyebrow="Console"
        title={<>ADMIN <span className="text-cyan-glow">DASHBOARD</span></>}
        description="Full inventory control — add, edit, and manage all vehicle listings."
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col xl:flex-row gap-8 relative items-start">

        {/* Mobile toggle header */}
        <div className="xl:hidden w-full flex items-center justify-between p-4 glass-morph border border-white/5 rounded-2xl mb-2">
          <span className="font-display text-sm font-bold uppercase tracking-wider text-white">
            {sidebarMenu.flatMap(g => g.items).find(i => i.id === activeTab)?.label || activeTab.toUpperCase()}
          </span>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 bg-white/5 border border-white/10 rounded-lg text-white cursor-pointer hover:border-cyan-glow/30"
          >
            <Menu size={18} />
          </button>
        </div>

        {/* Desktop sticky sidebar */}
        <aside className={`glass-morph border border-white/5 sticky top-28 h-[calc(100vh-10rem)] shrink-0 flex-col p-4 z-40 transition-all duration-300 rounded-2xl hidden xl:flex ${sidebarCollapsed ? "w-16" : "w-64"}`}>
          <SidebarContent />
        </aside>

        {/* Mobile drawer sidebar */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black xl:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-y-0 left-0 w-64 bg-neutral-950 border-r border-white/5 p-6 z-50 flex flex-col xl:hidden"
              >
                <SidebarContent mobile />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="flex-1 min-w-0">

          {/* ── DASHBOARD OVERVIEW ── */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard icon={Car} color="cyan" label="Total Assets" value={vehicles.length} sub="All Listings" />
                <StatCard icon={Users} color="purple" label="User Nodes" value={users.length} sub="Registered Users" />
                <StatCard icon={Shield} color="amber" label="Pending Review" value={pendingCount} sub="Awaiting Approval" />
                <StatCard icon={CircleDollarSign} color="emerald" label="Revenue" value={formatPrice(totalRevenue)} sub="Sold Vehicles" mono />
              </div>

              {/* Inventory Control */}
              <div className="glass-morph rounded-2xl border border-white/5 p-6">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-4">
                  Inventory Control
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InventoryCard icon={Package} label="Total Stock Units" value={totalStock} color="cyan" />
                  <InventoryCard icon={AlertTriangle} label="Low Stock (≤3)" value={lowStock} color="amber" />
                  <InventoryCard icon={X} label="Out of Stock" value={outOfStock} color="red" />
                  <InventoryCard icon={TrendingUp} label="Featured Listings" value={featuredCount} color="purple" />
                </div>
              </div>

              {/* Category quick-access cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { tab: "cars", label: "Cars", count: totalCars, icon: Car, color: "#00f2ff" },
                  { tab: "bikes", label: "Bikes", count: totalBikes, icon: Bike, color: "#a855f7" },
                  { tab: "jets", label: "Jets", count: totalJets, icon: Plane, color: "#facc15" },
                  { tab: "ships", label: "Ships", count: totalShips, icon: Anchor, color: "#10b981" },
                ].map(({ tab, label, count, icon: Icon, color }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="glass-morph rounded-2xl p-5 border border-white/5 text-left hover:border-cyan-glow/20 transition-all cursor-pointer group"
                  >
                    <Icon size={22} style={{ color }} className="mb-3" />
                    <div className="font-display text-2xl font-bold text-white">{count}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">{label} Listings</div>
                    <div className="text-[9px] text-cyan-glow mt-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                      Manage →
                    </div>
                  </button>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Vehicle Categories">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                        {categoryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle"
                        formatter={(v, e) => <span className="text-[10px] text-white/60 font-bold uppercase">{v}: {e.payload.value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Listing Growth Trend">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={listingGrowthData}>
                      <defs>
                        <linearGradient id="colorL" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="Listings" stroke="#00f2ff" fillOpacity={1} fill="url(#colorL)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          )}

          {/* ── VEHICLE CATEGORY TABS (Cars / Bikes / Jets / Ships) ── */}
          {["cars", "bikes", "jets", "ships"].map((catTab) => {
            const catKey = catTab === "cars" ? "car" : catTab === "bikes" ? "bike" : catTab === "jets" ? "jet" : "ship";
            const catLabel = CATEGORY_LABELS[catKey];
            const catList = vehicles.filter((v) => v.category === catKey);
            const btnLabels = { car: "Add Car", bike: "Add Bike", jet: "Add Jet", ship: "Add Ship" };
            return activeTab === catTab ? (
              <div key={catTab} className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                      {catLabel} Inventory
                    </h3>
                    <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider">
                      {catList.length} listings · {catList.filter(v => v.status === "Approved" || v.status === "Featured").length} live
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => refetchVehicles()}
                      className="p-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 cursor-pointer transition-all"
                      title="Refresh"
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      onClick={() => openAddModal(catKey)}
                      className="flex items-center gap-2 rounded-full bg-cyan-glow px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-white active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,242,255,0.25)]"
                    >
                      <Plus size={13} />
                      {btnLabels[catKey]}
                    </button>
                  </div>
                </div>

                {/* Inventory stats for this category */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total", value: catList.length, color: "text-white" },
                    { label: "Live", value: catList.filter(v => ["Approved","Featured"].includes(v.status)).length, color: "text-cyan-glow" },
                    { label: "Pending", value: catList.filter(v => v.status === "Pending").length, color: "text-amber-400" },
                    { label: "Sold", value: catList.filter(v => v.status === "Sold").length, color: "text-emerald-400" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="glass-morph rounded-xl p-3 border border-white/5 text-center">
                      <div className={`font-display text-xl font-bold ${color}`}>{value}</div>
                      <div className="text-[8px] font-bold uppercase tracking-widest text-white/40 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Vehicle table */}
                {catList.length === 0 ? (
                  <div className="glass-morph rounded-2xl border border-dashed border-white/10 p-12 text-center">
                    <div className="text-white/20 text-4xl mb-3">∅</div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">No {catLabel} yet</p>
                    <button
                      onClick={() => openAddModal(catKey)}
                      className="mt-4 flex items-center gap-2 mx-auto rounded-full bg-cyan-glow px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-black cursor-pointer hover:bg-white transition-colors"
                    >
                      <Plus size={12} /> {btnLabels[catKey]}
                    </button>
                  </div>
                ) : (
                  <VehicleTable
                    list={catList}
                    onEdit={openEditModal}
                    onDelete={confirmDeleteVehicle}
                    onInspect={setInspectVehicle}
                  />
                )}
              </div>
            ) : null;
          })}

          {/* ── USERS ── */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Registered Users ({users.length})
              </h3>
              <div className="glass-morph rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5 text-[9px] uppercase tracking-wider text-white/40">
                        <th className="p-4">Avatar</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <img src={u.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} className="size-9 rounded-full object-cover" alt="" />
                          </td>
                          <td className="p-4 font-bold">{u.name}</td>
                          <td className="p-4 text-white/60">{u.email}</td>
                          <td className="p-4">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${u.role === "admin" ? "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20" : "bg-white/5 text-white/40 border border-white/5"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => toggleUserRole(u)} className="text-[8px] font-bold uppercase tracking-widest rounded border border-white/10 hover:border-cyan-glow px-3 py-1.5 hover:text-cyan-glow cursor-pointer transition-all">
                                Toggle Role
                              </button>
                              <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 rounded border border-white/10 hover:border-red-500/30 hover:text-red-400 cursor-pointer transition-all">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── SELLERS ── */}
          {activeTab === "sellers" && (
            <div className="space-y-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Active Sellers ({sellers.length})
              </h3>
              <div className="glass-morph rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/5 text-[9px] uppercase tracking-wider text-white/40">
                        <th className="p-4">Avatar</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Listings</th>
                        <th className="p-4 text-right">Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {sellers.map((s) => {
                        const cnt = vehicles.filter((v) => v.sellerId === s._id || v.user === s._id || v.sellerId?._id === s._id || v.user?._id === s._id).length;
                        return (
                          <tr key={s._id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4"><img src={s.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} className="size-9 rounded-full object-cover" alt="" /></td>
                            <td className="p-4 font-bold">{s.name}</td>
                            <td className="p-4 text-white/60">{s.email}</td>
                            <td className="p-4 font-bold text-cyan-glow">{cnt} Active</td>
                            <td className="p-4 text-right"><span className="inline-block rounded-full bg-cyan-glow/5 border border-cyan-glow/10 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cyan-glow">Seller</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── APPROVALS ── */}
          {activeTab === "approvals" && (
            <div className="space-y-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Pending Approval ({pendingCount})
              </h3>
              {vehicles.filter((v) => v.status === "Pending").length === 0 ? (
                <div className="glass-morph rounded-2xl border border-white/5 p-12 text-center">
                  <CheckCircle2 className="mx-auto mb-3 text-emerald-400" size={36} />
                  <p className="text-white/40 text-xs uppercase tracking-wider">No pending listings — all clear!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vehicles.filter((v) => v.status === "Pending").map((v) => (
                    <div key={v._id || v.id} className="glass-morph rounded-2xl p-5 border border-amber-500/10 flex flex-col justify-between">
                      <div className="flex gap-4">
                        <img src={v.image} className="size-20 rounded-xl object-cover border border-white/5" alt={v.model} />
                        <div>
                          <h4 className="font-display text-base font-bold text-white">{v.brand} {v.model}</h4>
                          <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1">{v.year} • {v.category.toUpperCase()}</p>
                          <div className="mt-2 text-xs font-bold text-cyan-glow">{formatPrice(v.price)}</div>
                        </div>
                      </div>
                      <div className="mt-4 border-t border-white/5 pt-3 flex justify-between items-center">
                        <span className="text-[9px] uppercase tracking-wider text-white/30">
                          {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "Unknown"}
                        </span>
                        <button
                          onClick={() => { setSelectedApprovalVehicle(v); setShowApprovalModal(true); }}
                          className="rounded-full bg-cyan-glow px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-black cursor-pointer hover:bg-white transition-colors"
                        >
                          Inspect & Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── INQUIRIES ── */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Inquiry Logs ({inquiries.length})
              </h3>
              {inquiries.length === 0 ? (
                <p className="text-center text-xs text-white/40 py-12 glass-morph rounded-2xl">No inquiries yet.</p>
              ) : (
                inquiries.map((inq) => {
                  const v = inq.vehicle;
                  if (!v) return null;
                  return (
                    <div key={inq._id} className="glass-morph rounded-2xl p-6 border border-white/5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-3">
                        <div>
                          <h4 className="text-xs font-bold text-white">Inquiry on {v.brand} {v.model}</h4>
                          <p className="text-[9px] uppercase tracking-widest text-cyan-glow mt-0.5">{formatPrice(v.price)}</p>
                        </div>
                        <span className="text-[9px] text-white/40 uppercase tracking-widest">{new Date(inq.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-white/60">
                        <div><span className="text-[8px] uppercase tracking-wider text-white/40 block">Client</span><span className="font-bold text-white">{inq.name}</span></div>
                        <div><span className="text-[8px] uppercase tracking-wider text-white/40 block">Email</span><span>{inq.email}</span></div>
                        <div><span className="text-[8px] uppercase tracking-wider text-white/40 block">Phone</span><span>{inq.phone || "Not provided"}</span></div>
                      </div>
                      <div className="text-xs text-white/80 bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="text-[8px] uppercase tracking-wider text-white/40 block mb-1">Message</span>
                        "{inq.message}"
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── BRANDS ── */}
          {activeTab === "brands" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <form onSubmit={handleCreateBrand} className="glass-morph p-6 rounded-2xl border border-white/5 h-fit space-y-4">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Add Brand Partner</h4>
                <label className="block">
                  <span className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-white/50">Brand Name</span>
                  <input className="input" type="text" placeholder="Bugatti" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} required />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[9px] font-bold uppercase tracking-widest text-white/50">Category</span>
                  <PremiumDropdown value={newBrandCategory} onChange={setNewBrandCategory}
                    options={[{ label: "Car", value: "car" }, { label: "Bike", value: "bike" }, { label: "Jet", value: "jet" }, { label: "Ship", value: "ship" }]}
                    placeholder="Select Category" triggerClassName="!py-2.5" />
                </label>
                <button type="submit" className="w-full rounded-xl bg-cyan-glow py-3 text-xs font-bold uppercase tracking-widest text-black cursor-pointer hover:bg-white transition-colors">
                  Add Partner
                </button>
              </form>
              <div className="col-span-2 glass-morph rounded-2xl border border-white/5 p-6 space-y-4">
                <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Registered Brands ({brands.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {brands.map((b) => (
                    <div key={b._id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-white">
                      <div>
                        <p className="font-bold">{b.name}</p>
                        <p className="text-[8px] uppercase tracking-wider text-cyan-glow">{b.category}</p>
                      </div>
                      <button onClick={() => handleDeleteBrand(b._id)} className="p-1 rounded text-white/40 hover:text-red-400 cursor-pointer"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CATEGORIES ── */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Active Category Models</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((c) => (
                  <div key={c._id} className="glass-morph rounded-2xl p-5 border border-white/5 relative overflow-hidden">
                    <img src={c.img} className="absolute inset-0 size-full object-cover opacity-15" alt="" />
                    <div className="relative z-10">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-cyan-glow">Category</span>
                      <h4 className="font-display text-lg font-bold text-white mt-1 uppercase">{c.label}</h4>
                      <p className="text-[10px] text-white/50 mt-2">{c.count || "0 listings"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {activeTab === "reports" && (
            <div className="glass-morph p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Reports Summary</h3>
              <div className="text-xs text-white/60 leading-relaxed space-y-3">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="font-bold text-white mb-1">Database System Health</p>
                  <p>MongoDB connection active. All 4 vehicle collections (cars, bikes, jets, ships) are operational.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="font-bold text-white mb-1">Inventory Summary</p>
                  <p>Total: <strong className="text-cyan-glow">{vehicles.length}</strong> listings | Live: <strong className="text-cyan-glow">{vehicles.filter(v => ["Approved","Featured"].includes(v.status)).length}</strong> | Pending: <strong className="text-amber-400">{pendingCount}</strong> | Sold: <strong className="text-emerald-400">{soldCount}</strong></p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="font-bold text-white mb-1">Revenue Realized</p>
                  <p>{formatPrice(totalRevenue)} from {soldCount} verified sales.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="font-bold text-white mb-1">Client Operations</p>
                  <p>{inquiries.length} customer inquiries logged | {reviews.length} active reviews.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── STATISTICS ── */}
          {activeTab === "statistics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="User Registrations">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="Users" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
              <ChartCard title="Approval Status Distribution">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={approvalStatusData}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={9} />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === "settings" && (
            <div className="glass-morph p-6 rounded-2xl border border-white/5 space-y-4 max-w-xl">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white border-b border-white/5 pb-2">Node Configuration</h3>
              <div className="space-y-3 text-xs">
                {[
                  { label: "Auto-Approval System", desc: "Toggle auto-accept on user consignments.", status: "Disabled", color: "text-white/40" },
                  { label: "Websocket Event Listener", desc: "Push dynamic updates to clients.", status: "NOMINAL", color: "text-emerald-400" },
                  { label: "Admin Verification", desc: `Logged in as ${user.email}`, status: "ACTIVE", color: "text-cyan-glow" },
                ].map(({ label, desc, status, color }) => (
                  <div key={label} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                    <div>
                      <span className="font-bold text-white block">{label}</span>
                      <span className="text-[10px] text-white/40 block mt-0.5">{desc}</span>
                    </div>
                    <span className={`text-[9px] font-bold uppercase ${color}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>{/* end main content */}
      </div>

      {/* ══════════════════════════════════════════════════════════
          ADD VEHICLE MODAL
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showAddModal && (
          <Modal title={`Add New ${CATEGORY_LABELS[form.category] || "Vehicle"}`} onClose={() => { setShowAddModal(false); clearForm(); }}>
            <VehicleForm onSubmit={handleAddVehicle} isEdit={false} />
          </Modal>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          EDIT VEHICLE MODAL
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showEditModal && editingVehicle && (
          <Modal title={`Edit — ${editingVehicle.brand} ${editingVehicle.model}`} onClose={() => { setShowEditModal(false); setEditingVehicle(null); clearForm(); }}>
            <VehicleForm onSubmit={handleEditVehicle} isEdit={true} />
          </Modal>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          INSPECT / VIEW VEHICLE MODAL
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {inspectVehicle && (
          <Modal title={`${inspectVehicle.brand} ${inspectVehicle.model}`} onClose={() => setInspectVehicle(null)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div className="aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-white/5">
                  <img src={inspectVehicle.image} className="size-full object-cover" alt="" />
                </div>
                {inspectVehicle.images && inspectVehicle.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {inspectVehicle.images.slice(1).map((img, idx) => (
                      <div key={idx} className="aspect-video bg-neutral-950 rounded-lg overflow-hidden border border-white/10">
                        <img src={img} className="size-full object-cover" alt="" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <p className="text-[9px] uppercase tracking-widest text-white/40">{inspectVehicle.year} · {inspectVehicle.subcategory || inspectVehicle.category}</p>
                <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <SpecItem icon={Zap} label="Output" value={inspectVehicle.hp || "—"} />
                  <SpecItem icon={Gauge} label="Vmax" value={inspectVehicle.topSpeed || "—"} />
                  <SpecItem icon={Shield} label="Usage" value={inspectVehicle.mileage || "—"} />
                  <SpecItem icon={CircleDollarSign} label="Price" value={formatPrice(inspectVehicle.price)} highlight />
                </div>
                {inspectVehicle.description && (
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-white/40 mb-1">Description</p>
                    <p className="text-white/70 leading-relaxed text-xs">{inspectVehicle.description}</p>
                  </div>
                )}
                {inspectVehicle.features && inspectVehicle.features.length > 0 && (
                  <div>
                    <p className="text-[8px] uppercase tracking-wider text-white/40 mb-2">Features</p>
                    <ul className="list-disc list-inside text-white/70 space-y-1 pl-1">
                      {inspectVehicle.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setInspectVehicle(null); openEditModal(inspectVehicle); }}
                    className="flex-1 rounded-xl border border-cyan-glow/30 text-cyan-glow py-2.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-cyan-glow/10 transition-colors">
                    Edit Listing
                  </button>
                  <button onClick={() => { setInspectVehicle(null); confirmDeleteVehicle(inspectVehicle); }}
                    className="rounded-xl border border-red-500/20 text-red-400 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-red-500/10 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          APPROVAL INSPECT MODAL
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showApprovalModal && selectedApprovalVehicle && (
          <Modal title="Inspect Submitted Asset" onClose={() => { setShowApprovalModal(false); setSelectedApprovalVehicle(null); }}>
            <div className="space-y-5">
              <div className="flex gap-4">
                <img src={selectedApprovalVehicle.image} className="w-32 h-24 object-cover rounded-xl border border-white/5" alt="" />
                <div>
                  <h4 className="font-display text-lg font-bold text-white">{selectedApprovalVehicle.brand} {selectedApprovalVehicle.model}</h4>
                  <p className="text-xs text-white/50 uppercase mt-0.5">{selectedApprovalVehicle.year} · {selectedApprovalVehicle.category.toUpperCase()}</p>
                  <div className="text-cyan-glow font-bold mt-2 text-sm">{formatPrice(selectedApprovalVehicle.price)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-white/5 p-4 rounded-xl text-xs">
                <SpecItem icon={Zap} label="Output" value={selectedApprovalVehicle.hp || "—"} />
                <SpecItem icon={Gauge} label="Vmax" value={selectedApprovalVehicle.topSpeed || "—"} />
                <SpecItem icon={Shield} label="Mileage" value={selectedApprovalVehicle.mileage || "—"} />
                <SpecItem icon={CircleDollarSign} label="Fuel" value={selectedApprovalVehicle.fuel || "—"} />
              </div>
              <div className="flex gap-3 border-t border-white/5 pt-4">
                <button onClick={() => setShowRejectReasonModal(true)}
                  className="flex-1 rounded-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer">
                  Reject Asset
                </button>
                <button onClick={() => handleApproveListing(selectedApprovalVehicle._id || selectedApprovalVehicle.id)}
                  className="flex-1 rounded-full bg-cyan-glow hover:bg-white text-black py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer">
                  Approve Listing
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          REJECTION REASON MODAL
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showRejectReasonModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6">
              <button onClick={() => { setShowRejectReasonModal(false); setRejectReason(""); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer">
                <X size={14} className="text-white" />
              </button>
              <h4 className="font-display text-lg font-bold uppercase text-white mb-4">Rejection Reason</h4>
              <form onSubmit={handleRejectListingSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-white/50">Why is this listing rejected?</span>
                  <textarea className="input min-h-24" placeholder="e.g. Poor image quality, invalid specifications..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} required />
                </label>
                <button type="submit" className="w-full rounded-xl bg-red-500 py-3 text-xs font-bold uppercase tracking-widest text-white cursor-pointer hover:bg-red-600 transition-colors">
                  Confirm Rejection
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {vehicleToDelete && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-neutral-900 border border-red-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.1)]"
            >
              {/* Alert Triangle Icon */}
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
                <AlertTriangle size={24} />
              </div>

              <h4 className="font-display text-base font-bold uppercase text-white text-center mb-2">
                Remove Listing permanently?
              </h4>
              <p className="text-xs text-white/60 text-center leading-relaxed mb-6">
                Are you sure you want to permanently delete the <strong className="text-white">{vehicleToDelete.brand} {vehicleToDelete.model}</strong> listing? This will also remove any associated images and cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setVehicleToDelete(null)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteVehicle}
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                >
                  Confirm Delete
                </button>
              </div>
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
          font-size: 0.8125rem;
          color: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: var(--cyan-glow, #00f2ff); }
        .input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </>
  );
}

// ─── SMALL HELPER COMPONENTS ──────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: "rgba(10,10,15,0.95)",
  borderColor: "rgba(255,255,255,0.08)",
  borderRadius: "8px",
  fontSize: "11px",
  color: "white",
};

function Label({ children }) {
  return <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-widest text-white/50">{children}</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl p-6 sm:p-8 mb-8"
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer z-10">
          <X size={14} className="text-white" />
        </button>
        <h3 className="font-display text-lg font-bold uppercase text-white mb-6 border-b border-white/5 pb-3 pr-8">
          {title}
        </h3>
        {children}
      </motion.div>
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value, sub, mono }) {
  const colors = {
    cyan: "text-cyan-glow",
    purple: "text-purple-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
  };
  return (
    <div className="glass-morph rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <Icon className={colors[color]} size={20} />
        <span className={`text-[8px] font-bold uppercase tracking-wider ${colors[color]}`}>{label}</span>
      </div>
      <div className="mt-4">
        <div className={`font-display text-2xl font-bold ${mono ? "font-mono" : ""} ${colors[color]}`}>{value}</div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">{sub}</div>
      </div>
    </div>
  );
}

function InventoryCard({ icon: Icon, label, value, color }) {
  const colors = { cyan: "text-cyan-glow", amber: "text-amber-400", red: "text-red-400", purple: "text-purple-400" };
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-3">
      <Icon className={colors[color]} size={20} />
      <div>
        <div className={`font-display text-xl font-bold ${colors[color]}`}>{value}</div>
        <div className="text-[8px] font-bold uppercase tracking-widest text-white/40">{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="glass-morph p-6 rounded-2xl border border-white/5 space-y-4">
      <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">{title}</h4>
      <div className="h-56">{children}</div>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="text-cyan-glow shrink-0" size={13} />
      <div>
        <p className="text-[8px] uppercase tracking-widest text-white/40">{label}</p>
        <p className={`font-bold text-xs ${highlight ? "text-cyan-glow" : "text-white"}`}>{value}</p>
      </div>
    </div>
  );
}

function VehicleTable({ list, onEdit, onDelete, onInspect }) {
  return (
    <div className="glass-morph rounded-2xl overflow-hidden border border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/5 text-[9px] uppercase tracking-wider text-white/40">
              <th className="p-4">Asset</th>
              <th className="p-4">Model & Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Seller</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {list.map((v) => {
              const sellerName = v.sellerId?.name || v.user?.name || "Admin";
              const stockVal = v.stock !== undefined ? v.stock : 1;
              return (
                <tr key={v._id || v.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <img src={v.image} className="size-12 rounded-lg object-cover border border-white/5 shadow-md" alt=""
                      onError={(e) => { e.target.src = DEFAULT_IMAGES[v.category] || DEFAULT_IMAGES.car; }} />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{v.brand} {v.model}</div>
                    <div className="text-[9px] uppercase text-white/40 tracking-wider mt-0.5">{v.subcategory || v.category}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-cyan-glow text-xs whitespace-nowrap">{formatPrice(v.price)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold ${stockVal <= 0 ? "text-red-400" : stockVal <= 3 ? "text-amber-400" : "text-white/70"}`}>
                      {stockVal <= 0 ? "Out of Stock" : `${stockVal} unit${stockVal !== 1 ? "s" : ""}`}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      v.status === "Available" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      v.status === "Sold" ? "bg-neutral-800 text-white/40 border border-white/5" :
                      v.status === "Featured" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                      v.status === "Discounted" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      v.status === "Coming Soon" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      v.status === "Approved" ? "bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20" :
                      v.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      v.status === "Rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-white/5 text-white/40 border border-white/10"
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white text-xs">{sellerName}</div>
                  </td>
                  <td className="p-4 text-white/50 text-xs whitespace-nowrap">
                    {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "Seeded"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <ActionBtn onClick={() => onInspect(v)} title="View Details" color="cyan">
                        <Eye size={12} />
                      </ActionBtn>
                      <ActionBtn onClick={() => onEdit(v)} title="Edit Listing" color="cyan">
                        <Edit2 size={12} />
                      </ActionBtn>
                      <ActionBtn onClick={() => onDelete(v)} title="Delete" color="red">
                        <Trash2 size={12} />
                      </ActionBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBtn({ onClick, title, color, children }) {
  const styles = {
    cyan: "hover:border-cyan-glow/40 hover:text-cyan-glow",
    red: "hover:border-red-500/30 hover:text-red-400",
  };
  return (
    <button onClick={onClick} title={title}
      className={`p-2 rounded-lg bg-white/5 border border-white/5 cursor-pointer transition-all hover:scale-105 active:scale-95 ${styles[color] || styles.cyan}`}>
      {children}
    </button>
  );
}
