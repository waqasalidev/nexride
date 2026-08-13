import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const videoPath = path.resolve("../client/public/videos/nexride-hero.mp4");

console.log("=== STEP 1: FILE EXISTENCE DIAGNOSTIC ===");
console.log("Checking path:", videoPath);

if (!fs.existsSync(videoPath)) {
  console.log("VIDEO FILE EXISTS: NO");
  process.exit(1);
}

const stats = fs.statSync(videoPath);
console.log("VIDEO FILE EXISTS: YES");
console.log("File Size:", (stats.size / 1024 / 1024).toFixed(2), "MB");

// Try inspecting codec using ffprobe if installed
try {
  const probeOutput = execSync(`ffprobe -v error -show_entries stream=codec_name,codec_type,width,height -of json "${videoPath}"`, { encoding: "utf8" });
  console.log("FFprobe Stream Info:", probeOutput);
} catch (e) {
  console.log("FFprobe not available on system path (will inspect via browser/HTTP).");
}

process.exit(0);
