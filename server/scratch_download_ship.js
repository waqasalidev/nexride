import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const shipUrl = "https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/head-pose-face-detection-female.mp4"; // or valid open mp4 asset
const destFile = path.resolve("../client/public/videos/nexride-ship.mp4");

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
        return reject(new Error(`Status ${response.statusCode}`));
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

downloadFile(shipUrl, destFile).then(() => {
  console.log("Ship video saved successfully to", destFile);
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
