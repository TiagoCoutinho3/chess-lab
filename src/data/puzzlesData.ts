import { Puzzle } from '../types';

export const PUZZLES_LIST: Puzzle[] = [
  {
    id: 'puzzle-daily-1',
    title: 'Ataque Fulminante em f7',
    theme: 'Mate em 2',
    rating: 1250,
    // White to move, delivers classic Greek gift / smothered mate sequence
    initialFen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1n3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
    turn: 'w',
    moves: ['c4f7', 'e8f7', 'f3e5'],
    movesSan: ['Bxf7+', 'Kxf7', 'Nxe5+'],
    description: 'O rei preto ficou vulnerável no centro. Como as brancas podem quebrar a defesa imediatamente?',
    hint: 'Olhe para a fraqueza clássica na casa f7 e o sacrifício temático de bispo.',
    solutionExplanation: 'Bxf7+ atrai o rei para f7 e após Kxf7, o cavalo salta com Nxe5+ recuperando a peça com ataque devastador.',
  },
  {
    id: 'puzzle-daily-2',
    title: 'O Garfo Real do Cavalo',
    theme: 'Garfo',
    rating: 1100,
    // Black king on e8, Queen on d8, Rook on a8, White knight jumping to c7
    initialFen: 'r1bqk2r/pp1p1ppp/2n1pn2/8/1b1NP3/2N1B3/PPP2PPP/R2QKB1R w KQkq - 4 7',
    turn: 'w',
    moves: ['d4b5', 'd7d6', 'a2a3'],
    movesSan: ['Nb5', 'd6', 'a3'],
    description: 'As pretas atrasaram o desenvolvimento e as casas d6/c7 estão enfraquecidas.',
    hint: 'Aproveite a mobilidade do cavalo em direção a b5 para ameaçar um garfo fatal em c7.',
    solutionExplanation: 'Nb5 cria uma ameaça imediata de Nd6+ ou Nc7+ forçando as pretas a posições passivas.',
  },
  {
    id: 'puzzle-mate-1',
    title: 'Mate do Pastor',
    theme: 'Mate em 1',
    rating: 800,
    initialFen: 'r1bqkb1r/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
    turn: 'w',
    moves: ['f3f7'],
    movesSan: ['Qxf7#'],
    description: 'Vez das brancas. Encontre o golpe definitivo que encerra a partida em 1 lance.',
    hint: 'A dama e o bispo estão coordenados atacando a mesma casa desprotegida.',
    solutionExplanation: 'Qxf7# aplica xeque-mate! O rei preto não pode capturar a dama pois ela está protegida pelo bispo em c4.',
  },
  {
    id: 'puzzle-mate-backrank',
    title: 'Mate do Corredor',
    theme: 'Mate em 1',
    rating: 950,
    initialFen: '6k1/5ppp/8/8/8/8/4rPPP/2R3K1 w - - 0 1',
    turn: 'w',
    moves: ['c1c8', 'e2e8', 'c8e8'],
    movesSan: ['Rc8+', 'Re8', 'Rxe8#'],
    description: 'A primeira fileira do adversário não tem casa de fuga para o rei (peões bloqueando).',
    hint: 'Invada a oitava fileira com sua torre.',
    solutionExplanation: 'Rc8+ força Re8 e após Rxe8# é xeque-mate no corredor.',
  },
  {
    id: 'puzzle-fork-royal',
    title: 'Duplo na Dama e Rei',
    theme: 'Garfo',
    rating: 1350,
    initialFen: 'r1b1k2r/pp3ppp/2n1p3/3p4/3Pn3/2q1PN2/P2NBPPP/R2QK2R w KQkq - 2 11',
    turn: 'w',
    moves: ['d2e4', 'd5e4', 'f3d2'],
    movesSan: ['Nxe4', 'dxe4', 'Nd2'],
    description: 'As pretas avançaram a dama e o cavalo de forma descuidada.',
    hint: 'Elimine o cavalo central para enfraquecer a sustentação da dama.',
    solutionExplanation: 'Nxe4 desestabiliza a formação preta e ganha tempos cruciais sobre a dama.',
  },
  {
    id: 'puzzle-pin-tactic',
    title: 'A Cravada Fatal do Bispo',
    theme: 'Cravada',
    rating: 1400,
    initialFen: 'r1b1k2r/pp2qppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R2QK2R w KQkq - 2 9',
    turn: 'w',
    moves: ['c3b5', 'e7d8', 'f3e5'],
    movesSan: ['Nb5', 'Qd8', 'Ne5'],
    description: 'O cavalo e a dama estão na mesma diagonal e coluna exposta.',
    hint: 'Crie pressão nas peças cravadas para forçar perda de material.',
    solutionExplanation: 'Nb5 força o recuo da dama e Ne5 intensifica a pressão no ponto c6.',
  },
  {
    id: 'puzzle-discovered-attack',
    title: 'Ataque Descoberto Devastador',
    theme: 'Ataque Descoberto',
    rating: 1600,
    initialFen: 'r1b1k2r/ppp2ppp/2n1pn2/3q4/3P4/2B1PN2/PP3PPP/R2QKB1R w KQkq - 1 8',
    turn: 'w',
    moves: ['f1d3', 'e8g8', 'e1g1'],
    movesSan: ['Bd3', 'O-O', 'O-O'],
    description: 'O bispo em c3 mira na ala do rei enquanto o cavalo pode sair gerando ameaças duplas.',
    hint: 'Complete o desenvolvimento mantendo a bateria apontada.',
    solutionExplanation: 'A harmonia das peças brancas prepara e4 com ganho de tempo fatal sobre a dama em d5.',
  },
  {
    id: 'puzzle-endgame-pawn',
    title: 'Passagem Triangular no Fim de Jogo',
    theme: 'Fim de Jogo',
    rating: 1750,
    initialFen: '8/5k2/8/4K3/4P3/8/8/8 w - - 0 1',
    turn: 'w',
    moves: ['e5d6', 'f7e8', 'e4e5'],
    movesSan: ['Kd6', 'Ke8', 'e5'],
    description: 'Fim de jogo clássico de Rei e Peão. Como coroar garantindo a oposição?',
    hint: 'Avance o rei na frente do peão para dominar as casas-chave.',
    solutionExplanation: 'Kd6 assume o controle da casa de coroação e e5 empurra o peão sem que as pretas consigam a oposição.',
  },
  {
    id: 'puzzle-queen-sacrifice',
    title: 'Sacrifício da Dama para Mate',
    theme: 'Mate em 2',
    rating: 1900,
    initialFen: 'r1b2rk1/pp3ppp/2n5/1B1N4/8/5N2/PP3PPP/R2Q2K1 w - - 1 15',
    turn: 'w',
    moves: ['b5c6', 'b7c6', 'd5e7'],
    movesSan: ['Bxc6', 'bxc6', 'Ne7+'],
    description: 'A ala do rei adversário está sem defensores adequados.',
    hint: 'Remova o único defensor da casa e7.',
    solutionExplanation: 'Bxc6 remove o cavalo e Ne7+ ganha a iniciativa tática decisiva.',
  },
];

export function getDailyPuzzle(): Puzzle {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const puzzleIndex = dayOfYear % PUZZLES_LIST.length;
  return PUZZLES_LIST[puzzleIndex];
}

export function getFormattedTodayDate(): string {
  const today = new Date();
  return today.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
  });
}
