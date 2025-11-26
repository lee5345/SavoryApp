import { downloadVideo } from "../utils/downloadVideo.js";
import { ingestVideo, generateRecipeJSON } from "../utils/twelveLabs.js";

export const parseRecipe = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing video URL" });

    console.log("Downloading video...");
    const filePath = await downloadVideo(url);
    console.log("Video downloaded:", filePath);

    console.log("Ingesting into TwelveLabs...");
    const videoId = await ingestVideo(filePath);
    console.log("Ingested videoId:", videoId);

    console.log("Generating recipe...");
    const result = await generateRecipeJSON(videoId);

    res.json({ recipe: JSON.parse(result) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
};
