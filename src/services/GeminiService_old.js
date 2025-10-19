
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export const generatePitch = async (idea) => {
  const prompt = `
You are an expert startup consultant named PitchCraft AI.
Based on the following startup idea, generate a full startup identity.

Startup Idea: "${idea}"

Output in pure JSON only, following this structure:
{
  "startupName": "string",
  "tagline": "string",
  "elevatorPitch": "string",
  "targetAudience": "string",
  "heroCopy": "string",
  "colorPalette": [
    { "hex": "#HEXCODE", "name": "string", "description": "string" }
  ],
  "logoConcepts": [
    { "idea": "string", "visualDescription": "string" }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // ✅ FIXED: use correct property
    const text =
      response.output_text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    return data;
  } catch (error) {
    console.error("Error generating pitch:", error);
    throw new Error("Failed to generate startup pitch");
  }
};
