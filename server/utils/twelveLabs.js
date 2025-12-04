import { TwelveLabs } from "twelvelabs-js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const client = new TwelveLabs({
  apiKey: process.env.TWELVE_LABS_API_KEY,
});

const INDEX_ID = process.env.TWELVE_LABS_INDEX_ID;

export async function ingestVideo(filePath) {
  console.log("Uploading video to TwelveLabs...");

  const task = await client.tasks.create({
    indexId: INDEX_ID,
    videoFile: fs.createReadStream(filePath)
  });

  const completed = await client.tasks.waitForDone(task.id);

  if (completed.status !== "ready") {
    throw new Error(`Video processing failed: ${completed.status}`);
  }

  console.log("Video uploaded. videoId:", completed.videoId);
  return completed.videoId;
}

function cleanAndExtractJSON(raw) {
  if (!raw) throw new Error("Empty response from TwelveLabs");

  // Remove backticks and code fences
  let cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Extract JSON object by locating the first "{" and last "}"
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first === -1 || last === -1) {
    throw new Error("No valid JSON object found in model response:\n" + raw);
  }

  const jsonText = cleaned.substring(first, last + 1);

  return JSON.parse(jsonText);
}

export async function analyzeVideo(videoId) {
  const prompt = `
    Extract the cooking recipe from this video and return ONLY VALID JSON:

    {
      "video_url": "",
      "title": "",
      "ingredients": [],
      "steps": [],
      "tools": [],
      "time_estimate": "",
      "extra_notes": ""
    }

    - Include all steps in order.
    - Infer ingredient quantities if missing.
    - Omit details not related to the recipe.
    - If some information is missing, make the best guess possible.
    - Response will be parsed as JSON, so ensure valid formatting.
    - Remove any characters that would break JSON parsing.
  `;

  const response = await client.analyze({
    videoId: videoId,
    prompt: prompt,
  });
  const rawText = response.data;

  return cleanAndExtractJSON(rawText);
}