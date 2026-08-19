import { Style, Avatar } from '@dicebear/core';
import voxelArtDefinition from '@dicebear/styles/voxel-art.json';
import voxelBotDefinition from '@dicebear/styles/voxel-bot.json';

export type AvatarStyleName = 'voxel-art' | 'voxel-bot';

const voxelArtStyle = new Style(voxelArtDefinition);
const voxelBotStyle = new Style(voxelBotDefinition);

const BACKGROUND_COLORS = ['8aa7e1', 'a6c8ff', 'cdb4db', 'ffd6e0', 'bde7c9', 'fff1c7', 'ede7ff'];
const USER_BACKGROUND = ['8aa7e1'];

const avatarCache = new Map<string, string>();

function getStyleInstance(style: AvatarStyleName): Style {
  return style === 'voxel-art' ? voxelArtStyle : voxelBotStyle;
}

export interface AvatarGenerateOptions {
  size?: number;
  borderRadius?: number;
  backgroundColor?: string[];
  animationVariant?: 'fast' | 'fastest' | 'medium' | 'none' | 'slow' | 'slowest';
  mouthVariant?: string;
  eyesVariant?: string;
  eyebrowsVariant?: string;
  chestVariant?: string;
  topVariant?: string;
}

export function generateAvatarDataUri(
  seed: string,
  style: AvatarStyleName,
  options: AvatarGenerateOptions = {}
): string {
  const cacheKey = JSON.stringify({ seed, style, options });
  const cached = avatarCache.get(cacheKey);
  if (cached) return cached;

  const {
    size = 128,
    borderRadius = 16,
    backgroundColor = BACKGROUND_COLORS,
    animationVariant = 'fastest',
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

export function generateUserAvatarDataUri(): string {
  return generateAvatarDataUri('ChessLabHero', 'voxel-art', {
    backgroundColor: USER_BACKGROUND,
    animationVariant: 'none',
  });
}

export function getDefaultAvatarStyle(botId: string): AvatarStyleName {
  const voxelBotIds = new Set(['pixel', 'spark', 'glitch', 'bytemaster', 'quantum']);
  return voxelBotIds.has(botId) ? 'voxel-bot' : 'voxel-art';
}
