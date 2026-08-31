import { Style, Avatar } from "@dicebear/core";
import voxelArtDefinition from "@dicebear/styles/voxel-art.json";
import voxelBotDefinition from "@dicebear/styles/voxel-bot.json";
import { VoxelAvatarOptions } from "../types/avatar";
import { getUserAvatarOptions, saveUserAvatarOptions } from "./storage";

export type AvatarStyleName = "voxel-art" | "voxel-bot";

const voxelArtStyle = new Style(voxelArtDefinition);
const voxelBotStyle = new Style(voxelBotDefinition);

const BACKGROUND_COLORS = [
  "8aa7e1",
  "a6c8ff",
  "cdb4db",
  "ffd6e0",
  "bde7c9",
  "fff1c7",
  "ede7ff",
];

const avatarCache = new Map<string, string>();

function getStyleInstance(style: AvatarStyleName): Style {
  return style === "voxel-art" ? voxelArtStyle : voxelBotStyle;
}

function cleanHex(color?: string): string | undefined {
  if (!color) return undefined;
  return color.replace(/^#/, "");
}

export interface AvatarGenerateOptions {
  size?: number;
  borderRadius?: number;
  backgroundColor?: string[];
  animationVariant?:
    | "fast"
    | "fastest"
    | "medium"
    | "none"
    | "slow"
    | "slowest";
  mouthVariant?: string;
  eyesVariant?: string;
  eyebrowsVariant?: string;
  chestVariant?: string;
  topVariant?: string;
  [key: string]: any;
}

export function generateAvatarDataUri(
  seed: string,
  style: AvatarStyleName,
  options: AvatarGenerateOptions = {},
): string {
  const cacheKey = JSON.stringify({ seed, style, options });
  const cached = avatarCache.get(cacheKey);
  if (cached) return cached;

  const {
    size = 192,
    borderRadius = 8,
    backgroundColor = BACKGROUND_COLORS,
    animationVariant = "fastest",
    ...componentOptions
  } = options;

  const avatar = new Avatar(getStyleInstance(style), {
    seed,
    size,
    borderRadius,
    backgroundColor,
    animationVariant,
    ...componentOptions,
  });

  const dataUri = avatar.toDataUri();
  avatarCache.set(cacheKey, dataUri);
  return dataUri;
}

/**
 * Builds a deterministic, explicit voxel-art SVG data URI from user choices.
 */
export function generateVoxelAvatarDataUri(
  options: VoxelAvatarOptions,
  size: number = 192,
  borderRadius: number = 12,
): string {
  const cacheKey = JSON.stringify({ style: "voxel-art", size, borderRadius, options });
  const cached = avatarCache.get(cacheKey);
  if (cached) return cached;

  const dicebearOptions: Record<string, any> = {
    size,
    borderRadius,
    animationVariant: options.animationVariant ?? "none",
  };

  // Top / Hair / Hat
  if (options.topVariant === "none") {
    dicebearOptions.topProbability = 0;
  } else if (options.topVariant) {
    dicebearOptions.topVariant = options.topVariant;
    dicebearOptions.topProbability = 100;
  }

  // Outfit
  if (options.outfitVariant) {
    dicebearOptions.outfitVariant = options.outfitVariant;
  }

  // Eyes
  if (options.eyesVariant) {
    dicebearOptions.eyesVariant = options.eyesVariant;
  }

  // Mouth
  if (options.mouthVariant) {
    dicebearOptions.mouthVariant = options.mouthVariant;
  }

  // Eyebrows
  if (options.eyebrowsVariant === "none") {
    dicebearOptions.eyebrowsProbability = 0;
  } else if (options.eyebrowsVariant) {
    dicebearOptions.eyebrowsVariant = options.eyebrowsVariant;
    dicebearOptions.eyebrowsProbability = 100;
  }

  // Nose
  if (options.noseVariant) {
    dicebearOptions.noseVariant = options.noseVariant;
  }

  // Beard
  if (options.beardVariant === "none" || !options.beardVariant) {
    dicebearOptions.beardProbability = 0;
  } else {
    dicebearOptions.beardVariant = options.beardVariant;
    dicebearOptions.beardProbability = 100;
  }

  // Glasses
  if (options.glassesVariant === "none" || !options.glassesVariant) {
    dicebearOptions.glassesProbability = 0;
  } else {
    dicebearOptions.glassesVariant = options.glassesVariant;
    dicebearOptions.glassesProbability = 100;
  }

  // Cheeks
  if (options.cheeksVariant === "none" || !options.cheeksVariant) {
    dicebearOptions.cheeksProbability = 0;
  } else {
    dicebearOptions.cheeksVariant = options.cheeksVariant;
    dicebearOptions.cheeksProbability = 100;
  }

  // Color options
  if (options.skinColor) dicebearOptions.skinColor = cleanHex(options.skinColor);
  if (options.hairColor) dicebearOptions.hairColor = cleanHex(options.hairColor);
  if (options.shirtColor) dicebearOptions.shirtColor = cleanHex(options.shirtColor);
  if (options.jacketColor) dicebearOptions.jacketColor = cleanHex(options.jacketColor);
  if (options.hatColor) dicebearOptions.hatColor = cleanHex(options.hatColor);
  if (options.pantsColor) dicebearOptions.pantsColor = cleanHex(options.pantsColor);
  if (options.shoesColor) dicebearOptions.shoesColor = cleanHex(options.shoesColor);

  if (options.backgroundColor && options.backgroundColor.length > 0) {
    dicebearOptions.backgroundColor = options.backgroundColor.map((c) => cleanHex(c) || "8aa7e1");
  } else {
    dicebearOptions.backgroundColor = ["8aa7e1"];
  }

  const avatar = new Avatar(voxelArtStyle, dicebearOptions);
  const dataUri = avatar.toDataUri();
  avatarCache.set(cacheKey, dataUri);
  return dataUri;
}

export function generateUserAvatarDataUri(size: number = 192): string {
  const currentOptions = getUserAvatarOptions();
  return generateVoxelAvatarDataUri(currentOptions, size);
}

export function getDefaultAvatarStyle(botId: string): AvatarStyleName {
  const voxelBotIds = new Set([
    "pixel",
    "spark",
    "glitch",
    "gambit",
    "lumen",
    "blitz",
    "mirage",
    "bytemaster",
    "quantum",
  ]);
  return voxelBotIds.has(botId) ? "voxel-bot" : "voxel-art";
}

export { getUserAvatarOptions, saveUserAvatarOptions };
