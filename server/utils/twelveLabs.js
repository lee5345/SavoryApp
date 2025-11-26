import { TwelveLabs } from "twelvelabs-js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const client = new TwelveLabs({
  apiKey: process.env.TWELVE_LABS_API_KEY,
});

const ENGINE_ID = process.env.TWELVELABS_ENGINE_ID;

export async function ingestVideo(filePath) {
  const fileStream = fs.createReadStream(filePath);

  const response = await client.videos.ingest({
    engineId: ENGINE_ID,
    file: fileStream,
  });

  return response.videoId;
}

export async function generateRecipeJSON(videoId) {
  const prompt = `
  Extract a cooking recipe from this video.
  Note down the quantities of ingredients as well when appripriate.
  Remember that some videos may not contain quantities, for which you should give it your best guess.

  Return ONLY VALID JSON:
  {
    "video_url": "",
    "title": "",
    "ingredients": [],
    "steps": [],
    "tools": [],
    "time_estimate": "",
    "extra_notes": ""
  }
  `;

  const response = await client.generations.create({
    videoId,
    engineId: ENGINE_ID,
    prompt,
    maxTokens: 600,
  });

  return response.result;
}