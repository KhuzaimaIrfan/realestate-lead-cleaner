/// <reference types="vite/client" />
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { LeadData } from "../types";

const leadSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    intent: { type: Type.STRING, enum: ["buy", "rent", "sell", "unknown"] },
    role: { type: Type.STRING, enum: ["buyer", "tenant", "owner", "agent", "unknown"] },
    property_type: { type: Type.STRING, enum: ["apartment", "villa", "townhouse", "room", "office", "land", "unknown"] },
    bedrooms: { type: Type.NUMBER, nullable: true },
    bathrooms: { type: Type.NUMBER, nullable: true },
    location: { type: Type.STRING, nullable: true },
    furnished: { type: Type.STRING, enum: ["furnished", "semi-furnished", "unfurnished", "unknown"], nullable: true },
    budget_min: { type: Type.NUMBER, nullable: true },
    budget_max: { type: Type.NUMBER, nullable: true },
    budget_currency: { type: Type.STRING, nullable: true },
    parking_required: { type: Type.BOOLEAN, nullable: true },
    family_or_bachelor: { type: Type.STRING, enum: ["family", "bachelor", "mixed", "unknown"], nullable: true },
    move_in_date: { type: Type.STRING, nullable: true },
    contact: { type: Type.STRING, nullable: true },
    notes: { type: Type.STRING, nullable: true },
    short_summary: { type: Type.STRING },
  },
  required: [
    "intent",
    "role",
    "property_type",
    "short_summary"
  ],
};

// Lazy initialization to prevent top-level crashes
export const parseLead = async (leadText: string, marketHint: string): Promise<LeadData> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;

  console.log("Has VITE_API_KEY?", !!apiKey);
  console.log("Has VITE_OPENAI_API_KEY?", !!openAiKey); // Log as requested locally

  if (!apiKey) {
    console.error("Missing API Key. Please ensure VITE_API_KEY is set in .env.local");
    throw new Error("Missing API Key");
  }

  // @ts-ignore
  const ai = new GoogleGenAI({ apiKey });
  try {
    // Construct the user content prompt
    const userPrompt = `
      Input Data:
      ---
      Market Hint: ${marketHint || "None provided"}
      Lead Text:
      ${leadText}
      ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: leadSchema,
        temperature: 0.1, // Low temperature for deterministic extraction
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response text from Gemini");
    }

    try {
      const parsed: LeadData = JSON.parse(jsonText);
      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Raw text:", jsonText);
      throw new Error("Failed to parse model response as JSON.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};