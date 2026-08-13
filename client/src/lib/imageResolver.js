// Centralized NexRide Product Image Resolver

export const DEFAULT_CATEGORY_IMAGES = {
  car: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80",
  bike: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80",
  jet: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?w=800&auto=format&fit=crop&q=80",
  ship: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80",
};

/**
 * Resolves the best available image URL for a given product or vehicle item.
 * Tries:
 * 1. product.image (if valid non-empty string)
 * 2. product.images[0] (if array with valid items)
 * 3. product.thumbnail
 * 4. NexRide category-specific placeholder image
 */
export function resolveProductImage(product) {
  if (!product) return DEFAULT_CATEGORY_IMAGES.default;

  const category = (product.category || "car").toLowerCase();
  const fallback = DEFAULT_CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGES.default;

  // 1. Primary image field
  if (typeof product.image === "string" && product.image.trim().length > 5) {
    return product.image.trim();
  }

  // 2. Images array
  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images.find((img) => typeof img === "string" && img.trim().length > 5);
    if (firstImg) return firstImg.trim();
  }

  // 3. Thumbnail field
  if (typeof product.thumbnail === "string" && product.thumbnail.trim().length > 5) {
    return product.thumbnail.trim();
  }

  // 4. Category fallback
  return fallback;
}

/**
 * Event handler for <img> onError to gracefully swap broken/404 image URLs
 * to a verified category placeholder without hiding the card component.
 */
export function handleImageError(event, category = "car") {
  const fallback = DEFAULT_CATEGORY_IMAGES[category.toLowerCase()] || DEFAULT_CATEGORY_IMAGES.default;
  if (event?.target && event.target.src !== fallback) {
    event.target.src = fallback;
  }
}
