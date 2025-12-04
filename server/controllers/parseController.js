import { downloadVideo } from "../utils/download.js";
import { ingestVideo, analyzeVideo } from "../utils/twelveLabs.js";

export async function parseVideoFromURL(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "Missing video URL" });
    }

    console.log("Ingesting video via URL:", url);

    // Download IG video
    const filePath = await downloadVideo(url);

    // Upload to TwelveLabs -> returns videoId
    const videoId = await ingestVideo(filePath);

    // Ask Pegasus to extract recipe JSON
    const recipe = await analyzeVideo(videoId);

    res.json({ recipe });
  } catch (err) {
    console.error("Parse error:", err);
    res.status(500).json({ error: err.message });
  }
}
