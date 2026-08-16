import fs from "fs";
import path from "path";
import https from "https";

const posterUrl = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&auto=format&fit=crop&q=80";
const targetPath = path.resolve("../client/public/images/nexride-hero-poster.jpg");

const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const file = fs.createWriteStream(targetPath);
https.get(posterUrl, (res) => {
  res.pipe(file);
  file.on("finish", () => {
    file.close(() => {
      console.log("Poster image saved successfully to", targetPath);
      process.exit(0);
    });
  });
}).on("error", (err) => {
  console.error(err);
  process.exit(1);
});
