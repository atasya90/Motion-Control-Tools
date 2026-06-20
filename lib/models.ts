export type ModelKey =
  | "fal-kling-26-standard"
  | "fal-kling-26-pro"
  | "fal-kling-30-standard"
  | "fal-kling-30-pro"
  | "replicate-kling-26"
  | "replicate-kling-30";

export type ModelConfig = {
  provider: "fal" | "replicate";
  label: string;
  model: string;
};

export const MODELS: Record<ModelKey, ModelConfig> = {
  "fal-kling-26-standard": {
    provider: "fal",
    label: "Kling 2.6 Standard - fal.ai",
    model: "fal-ai/kling-video/v2.6/standard/motion-control"
  },
  "fal-kling-26-pro": {
    provider: "fal",
    label: "Kling 2.6 Pro - fal.ai",
    model: "fal-ai/kling-video/v2.6/pro/motion-control"
  },
  "fal-kling-30-standard": {
    provider: "fal",
    label: "Kling 3.0 Standard - fal.ai",
    model: "fal-ai/kling-video/v3/standard/motion-control"
  },
  "fal-kling-30-pro": {
    provider: "fal",
    label: "Kling 3.0 Pro - fal.ai",
    model: "fal-ai/kling-video/v3/pro/motion-control"
  },
  "replicate-kling-26": {
    provider: "replicate",
    label: "Kling 2.6 Motion Control - Replicate",
    model: "kwaivgi/kling-v2.6-motion-control"
  },
  "replicate-kling-30": {
    provider: "replicate",
    label: "Kling 3.0 Motion Control - Replicate",
    model: "kwaivgi/kling-v3-motion-control"
  }
};

export const MODEL_OPTIONS = Object.entries(MODELS).map(([key, value]) => ({
  key: key as ModelKey,
  ...value
}));
