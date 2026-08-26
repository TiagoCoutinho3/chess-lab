import { AvatarGenerateOptions } from "../utils/avatarGenerator";

export interface BotAvatarExpressionSet {
  /** Base idle look (without library animation — used for manual expression swaps). */
  normal?: AvatarGenerateOptions;
  /** Mouth open while the bot is speaking. */
  speakingOpen?: AvatarGenerateOptions;
  /** Mouth closed while the bot is speaking. */
  speakingClosed?: AvatarGenerateOptions;
  angry?: AvatarGenerateOptions;
  happy?: AvatarGenerateOptions;
}

/**
 * Manual per-bot expression overrides.
 * Edit mouth/eyes/eyebrows here bot by bot.
 */
export const BOT_AVATAR_EXPRESSIONS: Record<string, BotAvatarExpressionSet> = {
  rooki: {
    speakingOpen: { mouthVariant: "laugh", animationVariant: "none" },
    speakingClosed: { mouthVariant: "ooh", animationVariant: "none" },
    angry: {
      eyebrowsVariant: "angry",
      mouthVariant: "frown",
      eyesVariant: "wide",
      animationVariant: "none",
    },
    happy: {
      mouthVariant: "bigSmile",
      eyesVariant: "happy",
      animationVariant: "none",
    },
  },
  pixel: {
    speakingOpen: { mouthVariant: "speaker", animationVariant: "none" },
    speakingClosed: { mouthVariant: "smile", animationVariant: "none" },
    angry: {
      eyesVariant: "square",
      mouthVariant: "zigzag",
      animationVariant: "none",
    },
    happy: {
      eyesVariant: "happy",
      mouthVariant: "smile",
      animationVariant: "none",
    },
  },
  spark: {
    speakingOpen: { mouthVariant: "zigzag", animationVariant: "none" },
    speakingClosed: { mouthVariant: "line", animationVariant: "none" },
    angry: {
      eyesVariant: "square",
      mouthVariant: "grill",
      animationVariant: "none",
    },
    happy: {
      eyesVariant: "plus",
      mouthVariant: "smile",
      animationVariant: "none",
    },
  },
  glitch: {
    speakingOpen: { mouthVariant: "speaker", animationVariant: "none" },
    speakingClosed: { mouthVariant: "line", animationVariant: "none" },
    angry: {
      eyesVariant: "visor",
      mouthVariant: "zigzag",
      animationVariant: "none",
    },
    happy: {
      eyesVariant: "happy",
      mouthVariant: "smile",
      animationVariant: "none",
    },
  },
  nova: {
    speakingOpen: { mouthVariant: "laugh", animationVariant: "none" },
    speakingClosed: { mouthVariant: "flat", animationVariant: "none" },
    angry: {
      eyebrowsVariant: "angry",
      mouthVariant: "frown",
      eyesVariant: "wide",
      animationVariant: "none",
    },
    happy: {
      mouthVariant: "bigSmile",
      eyesVariant: "star",
      animationVariant: "none",
    },
  },
  zenith: {
    speakingOpen: { mouthVariant: "laugh", animationVariant: "none" },
    speakingClosed: { mouthVariant: "flat", animationVariant: "none" },
    angry: {
      eyebrowsVariant: "angry",
      eyesVariant: "side",
      animationVariant: "none",
    },
    happy: {
      mouthVariant: "smile",
      eyesVariant: "soft",
      animationVariant: "none",
    },
  },
  voxel: {
    speakingOpen: { mouthVariant: "ooh", animationVariant: "none" },
    speakingClosed: { mouthVariant: "smirk", animationVariant: "none" },
    angry: {
      eyebrowsVariant: "angry",
      mouthVariant: "frown",
      eyesVariant: "wide",
      animationVariant: "none",
    },
    happy: {
      mouthVariant: "grin",
      eyesVariant: "happy",
      animationVariant: "none",
    },
  },
  bytemaster: {
    speakingOpen: { mouthVariant: "speaker", animationVariant: "none" },
    speakingClosed: { mouthVariant: "line", animationVariant: "none" },
    angry: {
      eyesVariant: "square",
      mouthVariant: "grill",
      animationVariant: "none",
    },
    happy: {
      eyesVariant: "round",
      mouthVariant: "smile",
      animationVariant: "none",
    },
  },
  titan: {
    speakingOpen: { mouthVariant: "wideSmile", animationVariant: "none" },
    speakingClosed: { mouthVariant: "flat", animationVariant: "none" },
    angry: {
      eyebrowsVariant: "angry",
      mouthVariant: "frown",
      eyesVariant: "wide",
      animationVariant: "none",
    },
    happy: {
      mouthVariant: "smile",
      eyesVariant: "open",
      animationVariant: "none",
    },
  },
  quantum: {
    speakingOpen: { mouthVariant: "speaker", animationVariant: "none" },
    speakingClosed: { mouthVariant: "line", animationVariant: "none" },
    angry: {
      eyesVariant: "visor",
      mouthVariant: "zigzag",
      animationVariant: "none",
    },
    happy: {
      eyesVariant: "plus",
      mouthVariant: "smile",
      animationVariant: "none",
    },
  },
  sage: {
    speakingOpen: { mouthVariant: "smile", animationVariant: "none" },
    speakingClosed: { mouthVariant: "flat", animationVariant: "none" },
    angry: {
      eyebrowsVariant: "raised",
      eyesVariant: "side",
      mouthVariant: "frown",
      animationVariant: "none",
    },
    happy: {
      mouthVariant: "smile",
      eyesVariant: "soft",
      animationVariant: "none",
    },
  },
  magnusbot: {
    speakingOpen: { mouthVariant: "smirk", animationVariant: "none" },
    speakingClosed: { mouthVariant: "flat", animationVariant: "none" },
    angry: {
      eyebrowsVariant: "angry",
      eyesVariant: "wide",
      mouthVariant: "frown",
      animationVariant: "none",
    },
    happy: {
      mouthVariant: "smile",
      eyesVariant: "open",
      animationVariant: "none",
    },
  },
};

export function getBotExpressions(botId: string): BotAvatarExpressionSet {
  return BOT_AVATAR_EXPRESSIONS[botId] ?? {};
}
