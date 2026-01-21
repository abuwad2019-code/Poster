export enum AdType {
  SOCIAL_MEDIA = 'Social Media Post',
  VIDEO_COMMERCIAL = 'Video Commercial',
  STORYBOARD = 'Storyboard',
  PRODUCT_LAUNCH = 'Product Launch'
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  HUMOROUS = 'Humorous',
  EMOTIONAL = 'Emotional',
  LUXURY = 'Luxury',
  URGENT = 'Urgent'
}

export interface UserInput {
  idea: string;
  adType: AdType;
  tone: Tone;
  targetAudience: string;
  referenceImage?: string | null; // Base64
  referenceMimeType?: string | null;
}

export interface Scene {
  sceneNumber: number;
  visual: string;
  audio: string;
  duration: string;
}

export interface Scenario {
  title: string;
  hook: string;
  scenes: Scene[];
  cta: string;
  summary: string;
}

export interface ImagePrompt {
  id: string;
  title: string;
  description: string;
  promptAr: string;
  promptEn: string;
  aspectRatio: string;
  modelSuggestion: string;
}

export interface VideoPrompt {
  id: string;
  style: string;
  promptAr: string;
  promptEn: string;
  cameraMovement: string;
  duration: string;
  modelSuggestion: string; // e.g., Veo, Sora
}

export interface GeneratedOutput {
  scenario: Scenario | null;
  imagePrompts: ImagePrompt[];
  videoPrompts: VideoPrompt[];
}