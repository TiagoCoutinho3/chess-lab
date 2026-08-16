import { Bot, BotPersonality } from '../types';

export const personalityColors: Record<
  BotPersonality,
  { bg: string; text: string; border: string; badgeBg: string }
> = {
  Agressivo: {
    bg: '#FFD6E0',
    text: '#9F1239',
    border: '#F43F5E',
    badgeBg: '#FFF1F2',
  },
  Estratégico: {
    bg: '#EDE7FF',
    text: '#5B21B6',
    border: '#8B5CF6',
    badgeBg: '#F5F3FF',
  },
  Calmo: {
    bg: '#BDE7C9',
    text: '#166534',
    border: '#22C55E',
    badgeBg: '#F0FDF4',
  },
  Criativo: {
    bg: '#CDB4DB',
    text: '#6B21A8',
    border: '#A855F7',
    badgeBg: '#FAF5FF',
  },
  Defensivo: {
    bg: '#FFF1C7',
    text: '#854D0E',
    border: '#EAB308',
    badgeBg: '#FEFCE8',
  },
  Tático: {
    bg: '#A6C8FF',
    text: '#1E40AF',
    border: '#3B82F6',
    badgeBg: '#EFF6FF',
  },
};

export const personalityBoardColors: Record<
  BotPersonality,
  { light: string; dark: string }
> = {
  Agressivo: {
    light: '#FFF1F2',
    dark: '#ff4372',
  },
  Estratégico: {
    light: '#F5F3FF',
    dark: '#a384ff',
  },
  Calmo: {
    light: '#F0FDF4',
    dark: '#BDE7C9',
  },
  Criativo: {
    light: '#FAF5FF',
    dark: '#c96efd',
  },
  Defensivo: {
    light: '#FEFCE8',
    dark: '#f7b900',
  },
  Tático: {
    light: '#EFF6FF',
    dark: '#85b4ff',
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
    id: 'rooki',
    name: 'Rooki',
    avatarSeed: 'RookiBot',
    level: 2,
    rating: 600,
    personality: 'Calmo',
    personalityTagColor: personalityColors.Calmo,
    description: 'Um robô simpático dando os primeiros passos. Joga de forma tranquila e comete alguns deslizes.',
    quote: 'Vamos jogar uma partida amigável! O importante é se divertir.',
    openings: ['e4', 'd4'],
    blunderRate: 0.45,
    searchDepth: 2,
  },
  {
    id: 'pixel',
    name: 'Pixel',
    avatarSeed: 'PixelBot3D',
    level: 4,
    rating: 850,
    personality: 'Criativo',
    personalityTagColor: personalityColors.Criativo,
    description: 'Adora lances inesperados e jogadas curiosas. Não se importa de arriscar.',
    quote: 'Quem disse que xadrez tem que ser sempre certinho? Olha esse lance!',
    openings: ['e4', 'Nf3', 'c4'],
    blunderRate: 0.35,
    searchDepth: 3,
  },
  {
    id: 'spark',
    name: 'Spark',
    avatarSeed: 'SparkBot',
    level: 6,
    rating: 1050,
    personality: 'Tático',
    personalityTagColor: personalityColors.Tático,
    description: 'Focado em garfos rápidos e ataques diretos nas peças indefesas.',
    quote: 'Cuidado com seus cavalos... adoro um bom garfo real!',
    openings: ['e4', 'd4'],
    blunderRate: 0.25,
    searchDepth: 4,
  },
  {
    id: 'glitch',
    name: 'Glitch',
    avatarSeed: 'GlitchCraft',
    level: 8,
    rating: 1200,
    personality: 'Criativo',
    personalityTagColor: personalityColors.Criativo,
    description: 'Joga aberturas fora do padrão e tenta desequilibrar o ritmo da partida.',
    quote: 'Um pouco de caos no tabuleiro sempre deixa as coisas mais interessantes.',
    openings: ['b3', 'f4', 'e4'],
    blunderRate: 0.18,
    searchDepth: 5,
  },
  {
    id: 'nova',
    name: 'Nova',
    avatarSeed: 'NovaVoxel',
    level: 9,
    rating: 1300,
    personality: 'Agressivo',
    personalityTagColor: personalityColors.Agressivo,
    description: 'Ataca sem piedade na ala do rei. Se você deixar uma brecha, ela vai avançar com tudo.',
    quote: 'A melhor defesa é o ataque contínuo. Não pisque!',
    openings: ['e4', 'c4'],
    blunderRate: 0.14,
    searchDepth: 6,
  },
  {
    id: 'zenith',
    name: 'Zenith',
    avatarSeed: 'vocaelse',
    level: 10,
    rating: 1380,
    personality: 'Calmo',
    personalityTagColor: personalityColors.Calmo,
    description: 'Pacífico e metódico. Desenvolve todas as peças antes de qualquer confronto.',
    quote: 'Respire fundo. A harmonia entre suas peças é a chave da vitória.',
    openings: ['d4', 'Nf3'],
    blunderRate: 0.12,
    searchDepth: 7,
  },
  {
    id: 'voxel',
    name: 'Voxel',
    avatarSeed: 'VoxelRed',
    level: 11,
    rating: 1450,
    personality: 'Agressivo',
    personalityTagColor: personalityColors.Agressivo,
    description: 'Especialista em sacrifícios de peão por iniciativa e ataques de flanco.',
    quote: 'Vou abrir a coluna do seu rei antes do lance 15.',
    openings: ['e4', 'd4'],
    blunderRate: 0.10,
    searchDepth: 8,
  },
  {
    id: 'bytemaster',
    name: 'ByteMaster',
    avatarSeed: 'ByteMasterAI',
    level: 12,
    rating: 1550,
    personality: 'Estratégico',
    personalityTagColor: personalityColors.Estratégico,
    description: 'O bot mascote do ChessLab! Jogo sólido, excelente controle de centro e planos a médio prazo.',
    quote: 'Calculando a estrutura ideal de peões... vamos ver como você reage a isso.',
    openings: ['e4', 'd4', 'c4'],
    blunderRate: 0.08,
    searchDepth: 9,
  },
  {
    id: 'titan',
    name: 'Titan',
    avatarSeed: 'TitanShield',
    level: 14,
    rating: 1750,
    personality: 'Defensivo',
    personalityTagColor: personalityColors.Defensivo,
    description: 'Uma muralha impenetrável. Espera pacientemente o adversário se expor para contra-atacar.',
    quote: 'Pode tentar atacar minha fortaleza. Tudo já foi previsto.',
    openings: ['d4', 'c4', 'Nf3'],
    blunderRate: 0.05,
    searchDepth: 10,
  },
  {
    id: 'quantum',
    name: 'Quantum',
    avatarSeed: 'QuantumBot',
    level: 16,
    rating: 1950,
    personality: 'Tático',
    personalityTagColor: personalityColors.Tático,
    description: 'Visão tática aguçada. Encontra combinações profundas e mates em múltiplos lances.',
    quote: 'Enquanto você pensa no próximo lance, eu já analisei cinco variantes.',
    openings: ['e4', 'd4'],
    blunderRate: 0.02,
    searchDepth: 12,
  },
  {
    id: 'sage',
    name: 'Sage',
    avatarSeed: 'SageMaster',
    level: 18,
    rating: 2200,
    personality: 'Estratégico',
    personalityTagColor: personalityColors.Estratégico,
    description: 'Mestre da técnica posicional e finais de jogo. Quase não comete imprecisões.',
    quote: 'No xadrez, a verdadeira sabedoria reside na paciência e precisão geométrica.',
    openings: ['d4', 'Nf3', 'c4'],
    blunderRate: 0.01,
    searchDepth: 14,
  },
  {
    id: 'magnusbot',
    name: 'MagnusBot',
    avatarSeed: 'MagnusGrandMaster',
    level: 20,
    rating: 2500,
    personality: 'Estratégico',
    personalityTagColor: personalityColors.Estratégico,
    description: 'O desafio supremo do ChessLab. Força máxima, jogo implacável em qualquer fase da partida.',
    quote: 'Mostre-me sua melhor preparação. Não haverá espaço para erros.',
    openings: ['e4', 'd4', 'c4', 'Nf3'],
    blunderRate: 0.0,
    searchDepth: 18,
  },
];

export function getBotAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/10.x/voxel-art/svg?seed=${encodeURIComponent(seed)}&backgroundColor=8aa7e1,a6c8ff,cdb4db,ffd6e0,bde7c9,fff1c7,ede7ff&radius=16`;
}

export function getUserAvatarUrl(): string {
  return `https://api.dicebear.com/10.x/voxel-art/svg?seed=ChessLabHero&backgroundColor=8aa7e1&radius=16`;
}
