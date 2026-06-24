import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, "../uploads");

// Ensure directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Saves a base64 image to the disk.
 * @param {string} base64Str
 * @returns {string} The URL path of the saved image.
 */
export const saveBase64Image = async (base64Str) => {
  if (!base64Str || typeof base64Str !== "string" || !base64Str.startsWith("data:image/")) {
    // If it's already a URL or empty, return as is
    return base64Str;
  }

  try {
    const matches = base64Str.match(/^data:image\/([A-Za-z0-9\-+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Str;
    }

    const extension = matches[1] === "jpeg" ? "jpg" : matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `image_${Date.now()}_${Math.floor(Math.random() * 100000)}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    await fs.promises.writeFile(filePath, buffer);
    return `/api/uploads/${fileName}`;
  } catch (error) {
    console.error("Error saving base64 image:", error);
    return base64Str;
  }
};

/**
 * Deletes an image from disk if it was uploaded locally.
 * @param {string} imageUrl
 */
export const deleteLocalImage = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("/api/uploads/")) {
    return;
  }

  try {
    const fileName = imageUrl.replace("/api/uploads/", "");
    const filePath = path.join(UPLOADS_DIR, fileName);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Deleted local image file: ${filePath}`);
    }
  } catch (error) {
    console.error("Error deleting local image:", error);
  }
};
