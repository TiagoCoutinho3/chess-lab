import { Bot, BotPersonality } from "../types";
import {
  generateAvatarDataUri,
  generateUserAvatarDataUri,
  getDefaultAvatarStyle,
} from "../utils/avatarGenerator";

export const personalityColors: Record<
  BotPersonality,
  { bg: string; text: string; border: string; badgeBg: string }
> = {
  Agressivo: {
    bg: "#FFD6E0",
    text: "#9F1239",
    border: "#F43F5E",
    badgeBg: "#FFF1F2",
  },
  Estratégico: {
    bg: "#6ad4db",
    text: "#008ba3",
    border: "#00f7ff",
    badgeBg: "#f9ffff",
  },
  Calmo: {
    bg: "#BDE7C9",
    text: "#166534",
    border: "#22C55E",
    badgeBg: "#F0FDF4",
  },
  Criativo: {
    bg: "#CDB4DB",
    text: "#6B21A8",
    border: "#A855F7",
    badgeBg: "#FAF5FF",
  },
  Defensivo: {
    bg: "#FFF1C7",
    text: "#854D0E",
    border: "#EAB308",
    badgeBg: "#FEFCE8",
  },
  Tático: {
    bg: "#A6C8FF",
    text: "#1E40AF",
    border: "#3B82F6",
    badgeBg: "#EFF6FF",
  },
};

export const personalityBoardColors: Record<
  BotPersonality,
  { light: string; dark: string }
> = {
  Agressivo: {
    light: "#FFF1F2",
    dark: "#ff4372",
  },
  Estratégico: {
    light: "#F5F3FF",
    dark: "#38c0c5",
  },
  Calmo: {
    light: "#F0FDF4",
    dark: "#BDE7C9",
  },
  Criativo: {
    light: "#FAF5FF",
    dark: "#c176ec",
  },
  Defensivo: {
    light: "#FEFCE8",
    dark: "#f7b900",
  },
  Tático: {
    light: "#EFF6FF",
    dark: "#85b4ff",
  },
};

export function getBoardColors(bot: Bot): { light: string; dark: string } {
  if (bot.boardColors) {
    return bot.boardColors;
  }
  return personalityBoardColors[bot.personality];
}

export const BOTS_LIST: Bot[] = [
  {
    id: "rooki",
    name: "Rooki",
    avatarSeed: "RookiBot",
    avatarStyle: "voxel-art",
    mouthVariant: "flat",
    level: 2,
    rating: 600,
    personality: "Calmo",
    traits: ["calmo", "ansioso"],
    personalityTagColor: personalityColors.Calmo,
    description:
      "Um robô simpático dando os primeiros passos. Joga de forma tranquila e comete alguns deslizes.",
    quote: "Vamos jogar uma partida amigável! O importante é se divertir.",
    openings: ["e4", "d4"],
    blunderRate: 0.45,
    searchDepth: 2,
  },
  {
    id: "pixel",
    name: "Pixel",
    avatarSeed: "r17vced4",
    avatarStyle: "voxel-bot",
    mouthVariant: "smile",
    level: 4,
    rating: 850,
    personality: "Criativo",
    traits: ["artista", "ansioso"],
    personalityTagColor: personalityColors.Criativo,
    description:
      "Adora lances inesperados e jogadas curiosas. Não se importa de arriscar.",
    quote:
      "Quem disse que xadrez tem que ser sempre certinho? Olha esse lance!",
    openings: ["e4", "Nf3", "c4"],
    blunderRate: 0.35,
    searchDepth: 3,
  },
  {
    id: "mimo",
    name: "Mimo",
    avatarSeed: "MimoQuietBot",
    avatarStyle: "voxel-art",
    mouthVariant: "flat",
    level: 3,
    rating: 720,
    personality: "Calmo",
    traits: ["calmo", "medroso"],
    personalityTagColor: personalityColors.Calmo,
    description:
      "Joga sem pressa, protege as peças e prefere aprender com posições simples.",
    quote: "Um lance de cada vez. O tabuleiro não vai fugir.",
    openings: ["d4", "Nf3", "c4"],
    blunderRate: 0.4,
    searchDepth: 2,
  },
  {
    id: "gambit",
    name: "Gambit",
    avatarSeed: "Gambit1",
    avatarStyle: "voxel-bot",
    mouthVariant: "smile",
    level: 5,
    rating: 950,
    personality: "Criativo",
    traits: ["artista", "cabeca-quente"],
    personalityTagColor: personalityColors.Criativo,
    description:
      "Entrega material por iniciativa e transforma cada abertura em uma aposta ousada.",
    quote: "Um peão é um preço pequeno por uma posição interessante.",
    openings: ["e4", "f4", "c4"],
    blunderRate: 0.3,
    searchDepth: 3,
  },
  {
    id: "spark",
    name: "Spark",
    avatarSeed: "Sparks1981",
    avatarStyle: "voxel-bot",
    mouthVariant: "line",
    level: 6,
    rating: 1050,
    personality: "Tático",
    traits: ["tatico", "cabeca-quente"],
    personalityTagColor: personalityColors.Tático,
    description:
      "Focado em garfos rápidos e ataques diretos nas peças indefesas.",
    quote: "Cuidado com seus cavalos... adoro um bom garfo real!",
    openings: ["e4", "d4"],
    blunderRate: 0.25,
    searchDepth: 4,
  },
  {
    id: "glitch",
    name: "Glitch",
    avatarSeed: "Glitcheroso",
    avatarStyle: "voxel-bot",
    mouthVariant: "line",
    level: 8,
    rating: 1200,
    personality: "Criativo",
    traits: ["artista", "ansioso"],
    personalityTagColor: personalityColors.Criativo,
    description:
      "Joga aberturas fora do padrão e tenta desequilibrar o ritmo da partida.",
    quote:
      "Um pouco de caos no tabuleiro sempre deixa as coisas mais interessantes.",
    openings: ["b3", "f4", "e4"],
    blunderRate: 0.18,
    searchDepth: 5,
  },
  {
    id: "sentinela",
    name: "Sentinela",
    avatarSeed: "e2eb440h",
    avatarStyle: "voxel-art",
    mouthVariant: "bigSmile",
    level: 7,
    rating: 1120,
    personality: "Defensivo",
    traits: ["medroso", "estrategico", "calmo"],
    personalityTagColor: personalityColors.Defensivo,
    description:
      "Protege cada peça e simplifica a posição até encontrar o momento certo para contra-atacar.",
    quote: "Não preciso atacar primeiro. Só preciso continuar de pé.",
    openings: ["d4", "Nf3", "c4"],
    blunderRate: 0.21,
    searchDepth: 5,
  },
  {
    id: "nova",
    name: "Nova",
    avatarSeed: "xki106vl",
    avatarStyle: "voxel-art",
    mouthVariant: "frown",
    level: 9,
    rating: 1300,
    personality: "Agressivo",
    traits: ["cabeca-quente", "tatico"],
    personalityTagColor: personalityColors.Agressivo,
    description:
      "Ataca sem piedade na ala do rei. Se você deixar uma brecha, ela vai avançar com tudo.",
    quote: "A melhor defesa é o ataque contínuo. Não pisque!",
    openings: ["e4", "c4"],
    blunderRate: 0.14,
    searchDepth: 6,
  },
  {
    id: "lumen",
    name: "Lumen",
    avatarSeed: "LumenStructure",
    avatarStyle: "voxel-bot",
    mouthVariant: "grill",
    level: 9,
    rating: 1280,
    personality: "Estratégico",
    traits: ["estrategico", "calmo"],
    personalityTagColor: personalityColors.Estratégico,
    description:
      "Enxerga o tabuleiro como um mapa: melhora a estrutura e conquista espaço antes de atacar.",
    quote: "A melhor jogada é a que deixa o próximo plano mais claro.",
    openings: ["d4", "c4", "Nf3"],
    blunderRate: 0.15,
    searchDepth: 6,
  },
  {
    id: "zenith",
    name: "Zenith",
    avatarSeed: "zenithts",
    avatarStyle: "voxel-art",
    mouthVariant: "smirk",
    level: 10,
    rating: 1380,
    personality: "Calmo",
    traits: ["calmo", "experiente"],
    personalityTagColor: personalityColors.Calmo,
    description:
      "Pacífico e metódico. Desenvolve todas as peças antes de qualquer confronto.",
    quote: "Respire fundo. A harmonia entre suas peças é a chave da vitória.",
    openings: ["d4", "Nf3"],
    blunderRate: 0.12,
    searchDepth: 7,
  },
  {
    id: "voxel",
    name: "Voxel",
    avatarSeed: "VoxelR",
    avatarStyle: "voxel-art",
    mouthVariant: "smirk",
    level: 11,
    rating: 1450,
    personality: "Agressivo",
    traits: ["cabeca-quente", "artista"],
    personalityTagColor: personalityColors.Agressivo,
    description:
      "Especialista em sacrifícios de peão por iniciativa e ataques de flanco.",
    quote: "Vou abrir a coluna do seu rei antes do lance 15.",
    openings: ["e4", "d4"],
    blunderRate: 0.1,
    searchDepth: 8,
  },
  {
    id: "bytemaster",
    name: "ByteMaster",
    avatarSeed: "hrq7s73d",
    avatarStyle: "voxel-bot",
    mouthVariant: "line",
    level: 12,
    rating: 1550,
    personality: "Estratégico",
    traits: ["estrategico", "calmo"],
    personalityTagColor: personalityColors.Estratégico,
    description:
      "O bot mascote do ChessLab! Jogo sólido, excelente controle de centro e planos a médio prazo.",
    quote:
      "Calculando a estrutura ideal de peões... vamos ver como você reage a isso.",
    openings: ["e4", "d4", "c4"],
    blunderRate: 0.08,
    searchDepth: 9,
  },
  {
    id: "blitz",
    name: "Blitz",
    avatarSeed: "BlitzVoltage",
    avatarStyle: "voxel-bot",
    mouthVariant: "line",
    level: 11,
    rating: 1480,
    personality: "Tático",
    traits: ["tatico", "ansioso", "cabeca-quente"],
    personalityTagColor: personalityColors.Tático,
    description:
      "Joga em ritmo acelerado, cria ameaças imediatas e adora posições cheias de tensão.",
    quote: "Você pode pensar. Eu prefiro que o tabuleiro pense por mim.",
    openings: ["e4", "Nf3", "f4"],
    blunderRate: 0.1,
    searchDepth: 8,
  },
  {
    id: "titan",
    name: "Titan",
    avatarSeed: "Sageestra",
    avatarStyle: "voxel-art",
    mouthVariant: "flat",
    level: 14,
    rating: 1750,
    personality: "Defensivo",
    traits: ["medroso", "estrategico"],
    personalityTagColor: personalityColors.Defensivo,
    description:
      "Uma muralha impenetrável. Espera pacientemente o adversário se expor para contra-atacar.",
    quote: "Pode tentar atacar minha fortaleza. Tudo já foi previsto.",
    openings: ["d4", "c4", "Nf3"],
    blunderRate: 0.05,
    searchDepth: 10,
  },
  {
    id: "quantum",
    name: "Quantum",
    avatarSeed: "Qua",
    avatarStyle: "voxel-bot",
    mouthVariant: "line",
    level: 16,
    rating: 1950,
    personality: "Tático",
    traits: ["tatico", "experiente"],
    personalityTagColor: personalityColors.Tático,
    description:
      "Visão tática aguçada. Encontra combinações profundas e mates em múltiplos lances.",
    quote:
      "Enquanto você pensa no próximo lance, eu já analisei cinco variantes.",
    openings: ["e4", "d4"],
    blunderRate: 0.02,
    searchDepth: 12,
  },
  {
    id: "oraculo",
    name: "Oráculo",
    avatarSeed: "OraculoEsffsrndgame",
    avatarStyle: "voxel-art",
    mouthVariant: "flat",
    level: 13,
    rating: 1680,
    personality: "Estratégico",
    traits: ["experiente", "estrategico"],
    personalityTagColor: personalityColors.Estratégico,
    description:
      "Troca peças com precisão e conduz finais longos como se já conhecesse o resultado.",
    quote: "O final começa muito antes de você perceber.",
    openings: ["d4", "Nf3", "c4"],
    blunderRate: 0.06,
    searchDepth: 10,
  },
  {
    id: "mirage",
    name: "Mirage",
    avatarSeed: "MirageIllusion",
    avatarStyle: "voxel-bot",
    mouthVariant: "line",
    level: 15,
    rating: 1850,
    personality: "Criativo",
    traits: ["artista", "tatico", "ansioso"],
    personalityTagColor: personalityColors.Criativo,
    description:
      "Cria ameaças que parecem impossíveis e muda de plano antes que você consiga reagir.",
    quote: "Você está defendendo o que eu queria que você visse.",
    openings: ["e4", "c4", "b3"],
    blunderRate: 0.04,
    searchDepth: 12,
  },
  {
    id: "sage",
    name: "Sage",
    avatarSeed: "ans",
    avatarStyle: "voxel-art",
    mouthVariant: "smirk",
    level: 18,
    rating: 2200,
    personality: "Estratégico",
    traits: ["experiente", "estrategico", "calmo"],
    personalityTagColor: personalityColors.Estratégico,
    description:
      "Mestre da técnica posicional e finais de jogo. Quase não comete imprecisões.",
    quote:
      "No xadrez, a verdadeira sabedoria reside na paciência e precisão geométrica.",
    openings: ["d4", "Nf3", "c4"],
    blunderRate: 0.01,
    searchDepth: 14,
  },
  {
    id: "atlas",
    name: "Atlas",
    avatarSeed: "AtlasGranite",
    avatarStyle: "voxel-art",
    mouthVariant: "smirk",
    level: 17,
    rating: 2100,
    personality: "Defensivo",
    traits: ["medroso", "experiente", "estrategico"],
    personalityTagColor: personalityColors.Defensivo,
    description:
      "Uma presença constante no tabuleiro: absorve a pressão, espera o erro e converte com técnica.",
    quote: "A posição pode pesar. Eu não.",
    openings: ["d4", "c4", "Nf3"],
    blunderRate: 0.015,
    searchDepth: 14,
  },
  {
    id: "magnusbot",
    name: "MagnusBot",
    avatarSeed: "MagnusGrandMaster",
    avatarStyle: "voxel-art",
    mouthVariant: "flat",
    level: 20,
    rating: 2500,
    personality: "Estratégico",
    traits: ["experiente", "estrategico", "calmo"],
    personalityTagColor: personalityColors.Estratégico,
    description:
      "O desafio supremo do ChessLab. Força máxima, jogo implacável em qualquer fase da partida.",
    quote: "Mostre-me sua melhor preparação. Não haverá espaço para erros.",
    openings: ["e4", "d4", "c4", "Nf3"],
    blunderRate: 0.0,
    searchDepth: 18,
  },
];

export function getBotAvatarUrl(seed: string, botId?: string): string {
  const style = botId ? getDefaultAvatarStyle(botId) : "voxel-art";
  const bot = botId ? BOTS_LIST.find((b) => b.id === botId) : undefined;
  const avatarStyle = bot?.avatarStyle ?? style;
  const personalityBgColor = bot
    ? [personalityColors[bot.personality].bg.replace("#", "")]
    : undefined;
  return generateAvatarDataUri(seed, avatarStyle, {
    animationVariant: "fastest",
    backgroundColor: personalityBgColor,
    ...(bot ? { mouthVariant: bot.mouthVariant } : {}),
  });
}

export function getUserAvatarUrl(): string {
  return generateUserAvatarDataUri();
}
