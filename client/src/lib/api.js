import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch paginated, filtered, sorted products from /api/products
export function useProducts(params = {}, token) {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== "")
  ).toString();

  return useQuery({
    queryKey: ["products", queryString, token],
    queryFn: async () => {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const url = `/api/products${queryString ? `?${queryString}` : ""}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
}

// Fetch provider configuration and health statuses
export function useProviderStatuses(token) {
  return useQuery({
    queryKey: ["providerStatuses", token],
    queryFn: async () => {
      const res = await fetch("/api/products/external/providers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch provider statuses");
      return res.json();
    },
    enabled: !!token,
  });
}

// Test specific provider connection
export function useTestProvider(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (providerId) => {
      const res = await fetch(`/api/products/external/test/${providerId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to test provider connection");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerStatuses"] });
    },
  });
}

// Fetch candidate products from specific provider or category endpoint
export function useProviderInventory(provider = "all", token) {
  return useQuery({
    queryKey: ["providerInventory", provider, token],
    queryFn: async () => {
      const res = await fetch(`/api/products/external/${provider}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch provider inventory candidates");
      return res.json();
    },
    enabled: !!token,
  });
}

// Bulk sync provider inventory into MongoDB
export function useSyncProducts(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (provider = "all") => {
      const res = await fetch("/api/products/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ provider }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to sync inventory");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["jets"] });
      queryClient.invalidateQueries({ queryKey: ["ships"] });
      queryClient.invalidateQueries({ queryKey: ["providerInventory"] });
      queryClient.invalidateQueries({ queryKey: ["providerStatuses"] });
    },
  });
}

// Fetch candidate products from external API endpoint
export function useExternalCandidates(category = "all", token) {
  return useQuery({
    queryKey: ["externalCandidates", category, token],
    queryFn: async () => {
      const res = await fetch(`/api/products/external/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch external product candidates");
      return res.json();
    },
    enabled: !!token,
  });
}

// Batch import selected external products into MongoDB
export function useImportProducts(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items) => {
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to import products");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["jets"] });
      queryClient.invalidateQueries({ queryKey: ["ships"] });
      queryClient.invalidateQueries({ queryKey: ["externalCandidates"] });
    },
  });
}

// Create product mutation
export function useCreateProduct(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productData) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["jets"] });
      queryClient.invalidateQueries({ queryKey: ["ships"] });
    },
  });
}

// Update product mutation
export function useUpdateProduct(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["jets"] });
      queryClient.invalidateQueries({ queryKey: ["ships"] });
    },
  });
}

// Delete product mutation
export function useDeleteProduct(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["jets"] });
      queryClient.invalidateQueries({ queryKey: ["ships"] });
    },
  });
}

// Fetch all vehicles
export function useVehicles(token) {
  return useQuery({
    queryKey: ["vehicles", token],
    queryFn: async () => {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/vehicles", { headers });
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return res.json();
    },
  });
}

// Fetch cars
export function useCars(token) {
  return useQuery({
    queryKey: ["cars", token],
    queryFn: async () => {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/cars", { headers });
      if (!res.ok) throw new Error("Failed to fetch cars");
      return res.json();
    },
  });
}

// Fetch bikes
export function useBikes(token) {
  return useQuery({
    queryKey: ["bikes", token],
    queryFn: async () => {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/bikes", { headers });
      if (!res.ok) throw new Error("Failed to fetch bikes");
      return res.json();
    },
  });
}

// Fetch jets
export function useJets(token) {
  return useQuery({
    queryKey: ["jets", token],
    queryFn: async () => {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/jets", { headers });
      if (!res.ok) throw new Error("Failed to fetch jets");
      return res.json();
    },
  });
}

// Fetch single vehicle by ID
export function useVehicle(id) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const res = await fetch(`/api/vehicles/${id}`);
      if (!res.ok) throw new Error("Failed to fetch vehicle details");
      return res.json();
    },
    enabled: !!id,
  });
}

// Fetch brands
export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const res = await fetch("/api/brands");
      if (!res.ok) throw new Error("Failed to fetch brands");
      return res.json();
    },
  });
}

// Fetch categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });
}

// Fetch user favorites
export function useFavorites(token) {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return res.json();
    },
    enabled: !!token,
  });
}

// Add to favorites
export function useAddFavorite(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vehicleId) => {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicleId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add favorite");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// Remove from favorites
export function useRemoveFavorite(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vehicleId) => {
      const res = await fetch(`/api/favorites/${vehicleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to remove favorite");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

// Fetch user/admin inquiries
export function useInquiries(token) {
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return res.json();
    },
    enabled: !!token,
  });
}

// Submit a new inquiry
export function useCreateInquiry(token) {
  return useMutation({
    mutationFn: async (inquiryData) => {
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers,
        body: JSON.stringify(inquiryData),
      });

      if (!res.ok) throw new Error("Failed to submit inquiry");
      return res.json();
    },
  });
}

// Fetch all reviews
export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });
}

// Fetch ships
export function useShips(token) {
  return useQuery({
    queryKey: ["ships", token],
    queryFn: async () => {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch("/api/ships", { headers });
      if (!res.ok) throw new Error("Failed to fetch ships");
      return res.json();
    },
  });
}

// Admin update vehicle status (Approve / Reject)
export function useUpdateVehicleStatus(token) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, rejectionReason }) => {
      const res = await fetch(`/api/vehicles/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, rejectionReason }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update vehicle status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["jets"] });
      queryClient.invalidateQueries({ queryKey: ["ships"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle"] });
    },
  });
}
