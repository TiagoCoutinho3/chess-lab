import React, { useEffect, useMemo, useState } from "react";
import {
  AvatarStyleName,
  generateAvatarDataUri,
  getDefaultAvatarStyle,
} from "../utils/avatarGenerator";
import { getBotExpressions } from "../data/botAvatarExpressions";
import { BOTS_LIST } from "../data/botsData";

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
  const [speakingFrame, setSpeakingFrame] = useState(false);
  const resolvedStyle: AvatarStyleName =
    style ??
    BOTS_LIST.find((bot) => bot.id === botId)?.avatarStyle ??
    getDefaultAvatarStyle(botId);

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
        ...expressions.normal,
      });
    }

    if (mood === "speaking") {
      const frameOptions = speakingFrame
        ? expressions.speakingOpen
        : expressions.speakingClosed;
      return generateAvatarDataUri(seed, resolvedStyle, {
        animationVariant: "none",
        ...frameOptions,
      });
    }

    if (mood === "angry") {
      return generateAvatarDataUri(seed, resolvedStyle, {
        animationVariant: "none",
        ...expressions.angry,
      });
    }

    if (mood === "happy") {
      return generateAvatarDataUri(seed, resolvedStyle, {
        animationVariant: "none",
        ...expressions.happy,
      });
    }

    return generateAvatarDataUri(seed, resolvedStyle, {
      animationVariant: "none",
    });
  }, [seed, resolvedStyle, mood, speakingFrame, expressions]);

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
  const src = useMemo(
    () =>
      generateAvatarDataUri("ChessLabHero", "voxel-art", {
        backgroundColor: ["8aa7e1"],
        animationVariant: "none",
      }),
    [],
  );

  return <img src={src} alt={alt} className={className} draggable={false} />;
};
