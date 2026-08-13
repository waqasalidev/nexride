import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const VIDEO_URLS = [
  "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4",
  "https://file-examples.com/storage/fe5b4b1a4566c3c54d193d5/2017/04/file_example_MP4_700KB_0.mp4",
  "https://vjs.zencdn.net/v/oceans.mp4",
];

const destDir = path.resolve("../client/public/videos");
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
const destPath = path.join(destDir, "nexride-hero.mp4");

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
        return reject(new Error(`Failed to download: Status ${response.statusCode}`));
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
  console.log("=== DOWNLOADING VERIFIED LOCAL HERO MP4 VIDEO ===");
  for (const url of VIDEO_URLS) {
    try {
      console.log(`Trying ${url}...`);
      await downloadFile(url, destPath);
      const stats = fs.statSync(destPath);
      console.log(`Successfully saved video to ${destPath} (Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      process.exit(0);
    } catch (err) {
      console.error(`Failed ${url}: ${err.message}`);
    }
  }
  process.exit(1);
}

run();
