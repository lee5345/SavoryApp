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

      // Find downloaded file
      const match = stdout.match(/Writing video to: (.*)/);

      const files = fs.readdirSync(downloadsDir);
      const fullPath = path.join(downloadsDir, files[0]);

      resolve(fullPath);
    });
  });
}
