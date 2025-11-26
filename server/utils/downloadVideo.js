import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export async function downloadVideo(url) {
  return new Promise((resolve, reject) => {
    const outputDir = "/Users/martinlee/Desktop/LaunchPad/SavoryApp/server/utils/downloads";

    // 1. Create downloads folder if not exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 2. Define exact output path format
    const outputTemplate = "%(id)s.%(ext)s";
    const command = `yt-dlp -P "${outputDir}" -o "${outputTemplate}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`yt-dlp error: ${stderr}`);
      }

      // 3. Extract actual video filepath from yt-dlp output
      const match = stdout.match(/Destination:\s*(.*)/);

      if (!match || !match[1]) {
        return reject("Failed to determine downloaded file path");
      }

      const filePath = match[1].trim();
      resolve(filePath);
    });
  });
}