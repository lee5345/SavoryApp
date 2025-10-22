import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const parseRecipe = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing YouTube URL" });

    // Extract video ID
    const videoIdMatch = url.match(/v=([^&]+)/);
    if (!videoIdMatch) return res.status(400).json({ error: "Invalid YouTube URL" });
    const videoId = videoIdMatch[1];

    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(t => t.text).join(" ");
    
    // Send transcript to OpenAI
    const prompt = `
    Extract a recipe from the following video transcript.
    Return ONLY valid JSON in this exact format:
    {
      "title": "string",
      "ingredients": ["string"],
      "steps": ["string"]
    }

    Transcript:
    ${transcriptText.slice(0, 7000)}  // limit tokens
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an assistant that extracts recipes from text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const jsonString = completion.choices[0].message.content;
    const recipe = JSON.parse(jsonString);

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Failed to parse recipe` });
  }
};