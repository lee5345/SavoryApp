import { exec } from "child_process";
import path from "path";
import fs from "fs";

export function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const downloadsDir = path.join(process.cwd(), "utils", "downloads");

    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const command = `yt-dlp -o "${downloadsDir}/%(id)s.%(ext)s" ${url}`;

    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);

      // Match the output log to find the exact downloaded file
      const match = stdout.match(/(?<=Writing video to: ).*/);

      if (match && match[0]) {
        const downloadedPath = match[0].trim();
        return resolve(downloadedPath);
      }

      // Fallback (should rarely be needed)
      const files = fs.readdirSync(downloadsDir)
        .map(f => ({
          name: f,
          time: fs.statSync(path.join(downloadsDir, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time); // newest first

      const newestFile = path.join(downloadsDir, files[0].name);
      resolve(newestFile);
    });
  });
}