import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, Scenario, ImagePrompt, VideoPrompt } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-3-pro-preview';

// Helper to clean JSON string if Markdown code blocks are present
const cleanJsonString = (str: string): string => {
  let cleaned = str.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  return cleaned;
};

export const generateScenario = async (input: UserInput): Promise<Scenario> => {
  const parts: any[] = [];
  
  if (input.referenceImage && input.referenceMimeType) {
    parts.push({
      inlineData: {
        data: input.referenceImage,
        mimeType: input.referenceMimeType
      }
    });
  }

  const promptText = `
    You are a world-class Creative Director for a top advertising agency.
    
    Task: Create a detailed advertising scenario based on the following user input:
    - Idea: ${input.idea}
    - Ad Type: ${input.adType}
    - Tone: ${input.tone}
    - Target Audience: ${input.targetAudience}

    Requirements:
    1. The output must be in JSON format.
    2. Language: Arabic (Cultural nuances included).
    3. Structure: A catchy title, a strong hook, breakdown of scenes (visual/audio), and a Call to Action (CTA).
  `;

  parts.push({ text: promptText });

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      hook: { type: Type.STRING },
      summary: { type: Type.STRING },
      cta: { type: Type.STRING },
      scenes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sceneNumber: { type: Type.INTEGER },
            visual: { type: Type.STRING },
            audio: { type: Type.STRING },
            duration: { type: Type.STRING },
          }
        }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      systemInstruction: "You are an expert Arabic copywriter and creative strategist."
    }
  });

  try {
    const text = response.text || "{}";
    return JSON.parse(cleanJsonString(text)) as Scenario;
  } catch (e) {
    console.error("Error parsing scenario JSON", e);
    throw new Error("Failed to generate valid scenario.");
  }
};

export const generateVisualPrompts = async (scenario: Scenario, input: UserInput): Promise<{ imagePrompts: ImagePrompt[], videoPrompts: VideoPrompt[] }> => {
  
  const promptText = `
    Based on the following advertising scenario, generate detailed AI prompts for Image Generation (Storyboards/Posters) and Video Generation.
    
    Scenario Summary: ${scenario.summary}
    Target Audience: ${input.targetAudience}
    Tone: ${input.tone}

    Output Requirements:
    1. Image Prompts: 3 distinct variations (e.g., Main Poster, Storyboard Scene 1, Storyboard Scene 2).
       - Include both Arabic and English prompts.
       - English prompts must be highly detailed for models like Midjourney/Flux.
    2. Video Prompts: 3 distinct variations for different video generation models (e.g., Realistic, Cinematic, 3D Animation).
       - Optimized for models like Veo, Sora, Runway.
       - Include camera movements and lighting details.

    Return JSON.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      imagePrompts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            promptAr: { type: Type.STRING },
            promptEn: { type: Type.STRING },
            aspectRatio: { type: Type.STRING },
            modelSuggestion: { type: Type.STRING }
          }
        }
      },
      videoPrompts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            style: { type: Type.STRING },
            promptAr: { type: Type.STRING },
            promptEn: { type: Type.STRING },
            cameraMovement: { type: Type.STRING },
            duration: { type: Type.STRING },
            modelSuggestion: { type: Type.STRING }
          }
        }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: promptText,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      systemInstruction: "You are an expert AI Prompt Engineer specialized in Generative Media."
    }
  });

  try {
    const text = response.text || "{}";
    return JSON.parse(cleanJsonString(text));
  } catch (e) {
    console.error("Error parsing prompts JSON", e);
    throw new Error("Failed to generate visual prompts.");
  }
};
