import { Opening } from '../types';

export const OPENINGS_DATABASE: Opening[] = [
  {
    id: 'sicilian-defense',
    name: 'Defesa Siciliana',
    eco: 'B20',
    moves: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5d4', 'f3d4', 'g8f6', 'b1c3', 'a7a6'],
    movesSan: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'],
    fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    mainIdea: 'As pretas buscam controle do centro com ...c5, criando jogo dinâmico e desequilibrado.',
    whitePlan: 'As brancas buscam iniciativa na ala do rei, aproveitando a vantagem de espaço inicial com d4 e desenvolvimento rápido das peças menores.',
    blackPlan: 'As pretas jogam na coluna semiaberta "c", contra-atacando na ala da dama e buscando desequilíbrios na estrutura central.',
    difficulty: 'Intermediário',
    category: 'Semi-Abertas',
    keyVariations: [
      { name: 'Variante Najdorf', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'] },
      { name: 'Variante Dragão', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'] },
      { name: 'Variante Clássica', moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'd6'] },
    ],
  },
  {
    id: 'italian-game',
    name: 'Abertura Italiana',
    eco: 'C50',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'f8c5', 'c2c3', 'g8f6', 'd2d3', 'd7d6'],
    movesSan: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6'],
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    mainIdea: 'Desenvolvimento rápido das peças menores mirando o ponto vulnerável f7 das pretas.',
    whitePlan: 'Colocar pressão sobre f7 com o bispo em c4, preparar d4 para conquistar o centro e rocar rapidamente.',
    blackPlan: 'Igualar o desenvolvimento central com ...Bc5 ou ...Nf6 e contra-atacar o centro com ...d5 no momento certo.',
    difficulty: 'Iniciante',
    category: 'Abertas',
    keyVariations: [
      { name: 'Giuoco Piano', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'] },
      { name: 'Defesa dos Dois Cavalos', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'] },
      { name: 'Gambito Evans', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'] },
    ],
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez (Abertura Espanhola)',
    eco: 'C60',
    moves: ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1b5', 'a7a6', 'b5a4', 'g8f6', 'e1g1', 'f8e7'],
    movesSan: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7'],
    fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    mainIdea: 'As brancas atacam o cavalo defensor de e5, criando tensão posicional de longo prazo.',
    whitePlan: 'Manter a pressão sobre o centro, construir uma fortaleza com c3 e d4, e manobrar peças para a ala do rei.',
    blackPlan: 'Expelir o bispo com ...a6 e ...b5, consolidar o peão e5 e buscar contra-jogo central.',
    difficulty: 'Intermediário',
    category: 'Abertas',
    keyVariations: [
      { name: 'Variante Morphy (a6)', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'] },
      { name: 'Defesa Berlinesa', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'] },
    ],
  },
  {
    id: 'queens-gambit',
    name: 'Gambito da Dama',
    eco: 'D06',
    moves: ['d2d4', 'd7d5', 'c2c4', 'e7e6', 'b1c3', 'g8f6', 'c1g5', 'f8e7', 'e2e3', 'e8g8'],
    movesSan: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O'],
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
    mainIdea: 'Oferecer temporariamente o peão de "c" para obter total controle do centro com peões d4 e e4.',
    whitePlan: 'Dominar o centro d4/e4, pressionar a coluna "c" aberta ou semiaberta e explorar a falta de espaço das pretas.',
    blackPlan: 'Manter a firmeza em d5 com ...e6 (Gambito Recusado) ou aceitar e contra-atacar com ...c5 mais tarde.',
    difficulty: 'Iniciante',
    category: 'Fechadas',
    keyVariations: [
      { name: 'Gambito Recusado', moves: ['d4', 'd5', 'c4', 'e6'] },
      { name: 'Defesa Eslava', moves: ['d4', 'd5', 'c4', 'c6'] },
      { name: 'Gambito Aceito', moves: ['d4', 'd5', 'c4', 'dxc4'] },
    ],
  },
  {
    id: 'french-defense',
    name: 'Defesa Francesa',
    eco: 'C00',
    moves: ['e2e4', 'e7e6', 'd2d4', 'd7d5', 'b1c3', 'g8f6', 'e4e5', 'f6d7', 'f2f4', 'c7c5'],
    movesSan: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'e5', 'Nfd7', 'f4', 'c5'],
    fen: 'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    mainIdea: 'Uma defesa sólida e hipermoderna. As pretas criam uma cadeia de peões e atacam a base em d4 com ...c5.',
    whitePlan: 'Aproveitar a vantagem de espaço na ala do rei e explorar o bispo de casas claras "preso" das pretas em c8.',
    blackPlan: 'Dinamitar o centro branco com ...c5 e ...f6, ativando as peças na ala da dama.',
    difficulty: 'Intermediário',
    category: 'Semi-Abertas',
  },
  {
    id: 'caro-kann',
    name: 'Defesa Caro-Kann',
    eco: 'B12',
    moves: ['e2e4', 'c7c6', 'd2d4', 'd7d5', 'e4e5', 'c8f5', 'g1f3', 'e7e6', 'f1e2', 'c6c5'],
    movesSan: ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5', 'Nf3', 'e6', 'Be2', 'c5'],
    fen: 'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    mainIdea: 'Sólida como a Francesa, porém permitindo que o bispo de casas claras saia antes de jogar ...e6.',
    whitePlan: 'Buscar vantagem de espaço com e5 (Variante do Avanço) ou abrir o centro na Variante Clássica.',
    blackPlan: 'Estrutura de peões praticamente invulnerável, transições favoráveis para finais de jogo.',
    difficulty: 'Iniciante',
    category: 'Semi-Abertas',
  },
  {
    id: 'kings-indian-defense',
    name: 'Defesa Índia do Rei',
    eco: 'E60',
    moves: ['d2d4', 'g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7', 'e2e4', 'd7d6', 'g1f3', 'e8g8'],
    movesSan: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O'],
    fen: 'rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 1 2',
    mainIdea: 'As pretas cedem o centro inicial às brancas para contra-atacar ferozmente com ...e5 e um ataque fulminante na ala do rei.',
    whitePlan: 'Expandir na ala da dama com c5 e dominar o espaço no centro.',
    blackPlan: 'Trancar o centro com ...e5 e lançar peões f5-f4 para dar xeque-mate no rei branco.',
    difficulty: 'Avançado',
    category: 'Fechadas',
  },
  {
    id: 'london-system',
    name: 'Sistema London',
    eco: 'D02',
    moves: ['d2d4', 'd7d5', 'c1f4', 'g8f6', 'e2e3', 'c7c5', 'c2c3', 'b8c6', 'b1d2', 'e7e6'],
    movesSan: ['d4', 'd5', 'Bf4', 'Nf6', 'e3', 'c5', 'c3', 'Nc6', 'Nd2', 'e6'],
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2',
    mainIdea: 'Uma abertura universal e ultra-sólida para as brancas, desenvolvendo o bispo antes de fechar a cadeia de peões.',
    whitePlan: 'Criar a "pirâmide" c3-d4-e3 com o bispo forte em f4 e cavalo central em e5.',
    blackPlan: 'Pressionar b2 com ...Qb6, disputar o bispo com ...Nh5 ou romper no centro com ...c5.',
    difficulty: 'Iniciante',
    category: 'Fechadas',
  },
  {
    id: 'kings-gambit',
    name: 'Gambito do Rei',
    eco: 'C30',
    moves: ['e2e4', 'e7e5', 'f2f4', 'e5f4', 'g1f3', 'g7g5', 'h2h4', 'g5g4', 'f3e5', 'g8f6'],
    movesSan: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ne5', 'Nf6'],
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3 0 2',
    mainIdea: 'Abertura romântica clássica: sacrificar o peão "f" no segundo lance para abrir a coluna e atacar f7.',
    whitePlan: 'Desenvolver rápido Bc4, d4, roque e usar a coluna "f" aberta para atacar o rei adversário.',
    blackPlan: 'Segurar o peão a mais ou devolvê-lo no momento certo para consolidar a segurança do rei.',
    difficulty: 'Avançado',
    category: 'Abertas',
  },
  {
    id: 'scandinavian-defense',
    name: 'Defesa Escandinava',
    eco: 'B01',
    moves: ['e2e4', 'd7d5', 'e4d5', 'd8d5', 'b1c3', 'd5a5', 'd2d4', 'g8f6', 'g1f3', 'c7c6'],
    movesSan: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6', 'Nf3', 'c6'],
    fen: 'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2',
    mainIdea: 'Desafiar imediatamente o peão de e4 no lance 1, abrindo o centro desde o início.',
    whitePlan: 'Ganhar tempos de desenvolvimento atacando a dama preta com Nc3 e ocupar o centro.',
    blackPlan: 'Recuar a dama com segurança para a5 ou d6, desenvolver as peças harmonicamente e pressionar o centro.',
    difficulty: 'Iniciante',
    category: 'Semi-Abertas',
  },
];

export function findMatchingOpening(movesSan: string[]): Opening | undefined {
  if (!movesSan || movesSan.length === 0) return undefined;
  
  // Find longest matching opening
  let bestMatch: Opening | undefined = undefined;
  let maxMatchedMoves = 0;

  for (const op of OPENINGS_DATABASE) {
    let matches = true;
    const len = Math.min(movesSan.length, op.movesSan.length);
    if (len === 0) continue;

    for (let i = 0; i < len; i++) {
      if (movesSan[i] !== op.movesSan[i]) {
        matches = false;
        break;
      }
    }

    if (matches && len >= 2 && len > maxMatchedMoves) {
      maxMatchedMoves = len;
      bestMatch = op;
    }
  }

  return bestMatch;
}
