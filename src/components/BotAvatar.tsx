import React, { useEffect, useMemo, useState } from "react";
import {
  AvatarStyleName,
  generateAvatarDataUri,
  generateVoxelAvatarDataUri,
  getDefaultAvatarStyle,
  getUserAvatarOptions,
} from "../utils/avatarGenerator";
import { USER_AVATAR_UPDATED_EVENT } from "../utils/storage";
import { getBotExpressions } from "../data/botAvatarExpressions";
import { BOTS_LIST, personalityColors } from "../data/botsData";
import { VoxelAvatarOptions } from "../types/avatar";

export type BotAvatarMood = "idle" | "speaking" | "angry" | "happy";

interface BotAvatarProps {
  seed: string;
  botId: string;
  style?: AvatarStyleName;
  mood?: BotAvatarMood;
  className?: string;
  alt?: string;
}

export const BotAvatar: React.FC<BotAvatarProps> = ({
  seed,
  botId,
  style = "voxel-art",
  mood = "idle",
  className = "",
  alt = "Bot avatar",
}) => {
  const expressions = getBotExpressions(botId);
  const bot = BOTS_LIST.find((item) => item.id === botId);
  const [speakingFrame, setSpeakingFrame] = useState(false);
  const resolvedStyle: AvatarStyleName =
    style ??
    BOTS_LIST.find((bot) => bot.id === botId)?.avatarStyle ??
    getDefaultAvatarStyle(botId);

  const personalityBgColor = bot
    ? [personalityColors[bot.personality].bg.replace("#", "")]
    : undefined;

  useEffect(() => {
    if (mood !== "speaking") {
      setSpeakingFrame(false);
      return;
    }

    setSpeakingFrame(false);
    const interval = setInterval(() => {
      setSpeakingFrame((prev) => !prev);
    }, 200);

    return () => clearInterval(interval);
  }, [mood]);

  const src = useMemo(() => {
    if (mood === "idle") {
      return generateAvatarDataUri(seed, resolvedStyle, {
        animationVariant: "fastest",
        backgroundColor: personalityBgColor,
        ...expressions.normal,
        mouthVariant: bot?.mouthVariant ?? "flat",
      });
    }

    if (mood === "speaking") {
      const frameOptions = speakingFrame
        ? expressions.speakingOpen
        : expressions.speakingClosed;
      return generateAvatarDataUri(seed, resolvedStyle, {
        animationVariant: "none",
        backgroundColor: personalityBgColor,
        ...frameOptions,
      });
    }

    if (mood === "angry") {
      return generateAvatarDataUri(seed, resolvedStyle, {
        animationVariant: "none",
        backgroundColor: personalityBgColor,
        ...expressions.angry,
      });
    }

    if (mood === "happy") {
      return generateAvatarDataUri(seed, resolvedStyle, {
        animationVariant: "none",
        backgroundColor: personalityBgColor,
        ...expressions.happy,
      });
    }

    return generateAvatarDataUri(seed, resolvedStyle, {
      animationVariant: "none",
      backgroundColor: personalityBgColor,
    });
  }, [seed, resolvedStyle, mood, speakingFrame, expressions, personalityBgColor]);

  return <img src={src} alt={alt} className={className} draggable={false} />;
};

interface PlayerAvatarProps {
  className?: string;
  alt?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  className = "",
  alt = "Você",
}) => {
  const [options, setOptions] = useState<VoxelAvatarOptions>(() =>
    getUserAvatarOptions()
  );

  useEffect(() => {
    const handleAvatarUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<VoxelAvatarOptions>;
      if (customEvent.detail) {
        setOptions(customEvent.detail);
      } else {
        setOptions(getUserAvatarOptions());
      }
    };

    window.addEventListener(USER_AVATAR_UPDATED_EVENT, handleAvatarUpdated);
    return () => {
      window.removeEventListener(USER_AVATAR_UPDATED_EVENT, handleAvatarUpdated);
    };
  }, []);

  const src = useMemo(
    () => generateVoxelAvatarDataUri(options, 192),
    [options]
  );

  return <img src={src} alt={alt} className={className} draggable={false} />;
};

