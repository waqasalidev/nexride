import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const CATEGORY_VIDEOS = {
  car: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4",
  bike: "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/person-bicycle-car-detection.mp4",
  jet: "https://vjs.zencdn.net/v/oceans.mp4", // high res sea/sky ocean video
  ship: "https://file-examples.com/storage/fe5b4b1a4566c3c54d193d5/2017/04/file_example_MP4_700KB_0.mp4",
};

const destDir = path.resolve("../client/public/videos");
const imgDestDir = path.resolve("../client/public/images");

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
if (!fs.existsSync(imgDestDir)) fs.mkdirSync(imgDestDir, { recursive: true });

async function downloadFile(url, target) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(target);
    const client = url.startsWith("https") ? https : http;
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };
    client.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, target).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on("finish", () => {
        file.close(() => resolve(target));
      });
    }).on("error", (err) => {
      fs.unlink(target, () => reject(err));
    });
  });
}

async function run() {
  console.log("=== CHECKING & ASSEMBLING CATEGORY VIDEO ASSETS ===");
  for (const [cat, url] of Object.entries(CATEGORY_VIDEOS)) {
    const targetFile = path.join(destDir, `nexride-${cat}.mp4`);
    try {
      console.log(`Downloading ${cat} video from ${url}...`);
      await downloadFile(url, targetFile);
      const stats = fs.statSync(targetFile);
      console.log(`[SUCCESS] ${cat} video saved to ${targetFile} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (err) {
      console.error(`[ERROR] ${cat}: ${err.message}`);
    }
  }

  // Combine/Copy main hero file
  const mainHeroPath = path.join(destDir, "nexride-hero.mp4");
  const carPath = path.join(destDir, "nexride-car.mp4");
  if (fs.existsSync(carPath)) {
    fs.copyFileSync(carPath, mainHeroPath);
    console.log("Copied primary video asset to", mainHeroPath);
  }

  process.exit(0);
}

run();
