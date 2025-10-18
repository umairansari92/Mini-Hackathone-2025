// src/services/GemiServices.js
import { GoogleAI } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY, // use Vite env variable
});

// Response schema
const responseSchema = {
  type: "object",
  properties: {
    startupName: { type: "string", description: "Creative and catchy name for the startup." },
    tagline: { type: "string", description: "Short, memorable tagline for the startup." },
    elevatorPitch: { type: "string", description: "2-3 sentence elevator pitch." },
    targetAudience: { type: "string", description: "Ideal target audience persona." },
    heroCopy: { type: "string", description: "Compelling copy for the hero section of the landing page." },
    colorPalette: {
      type: "array",
      description: "Five color suggestions for branding.",
      items: {
        type: "object",
        properties: {
          hex: { type: "string", description: "Hex code (e.g., '#FFFFFF')." },
          name: { type: "string", description: "Creative name for the color." },
          description: { type: "string", description: "How this color supports brand mood." },
        },
        required: ["hex", "name", "description"],
      },
    },
    logoConcepts: {
      type: "array",
      description: "Three unique logo concept ideas.",
      items: {
        type: "object",
        properties: {
          idea: { type: "string", description: "Core concept or style (e.g., 'Minimalist Icon')." },
          visualDescription: { type: "string", description: "Detailed description of the logo visuals." },
        },
        required: ["idea", "visualDescription"],
      },
    },
  },
  required: [
    "startupName",
    "tagline",
    "elevatorPitch",
    "targetAudience",
    "heroCopy",
    "colorPalette",
    "logoConcepts",
  ],
};

// Generate pitch function
export const generatePitch = async (idea) => {
  const prompt = `
You are an expert startup consultant and brand strategist named "PitchCraft AI".
Based on the following startup idea, generate a complete startup pitch and brand identity.

Startup Idea: "${idea}"

Return only a valid JSON object following this schema:
${JSON.stringify(responseSchema)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-pro-exp", // ✅ use current model name
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
        topP: 0.9,
      },
    });

    const jsonText = response.output_text?.trim();
    const parsedData = JSON.parse(jsonText);
    return parsedData;

  } catch (error) {
    console.error("❌ Error generating pitch:", error);
    throw new Error("Failed to generate pitch. Please try again later.");
  }
};
