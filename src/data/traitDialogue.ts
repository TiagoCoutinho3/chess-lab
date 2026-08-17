import { PersonalityTrait } from '../types';

export type TraitDialogueEvent =
  | 'capture'
  | 'check'
  | 'opening'
  | 'playerGoodMove'
  | 'playerBadMove';

export const TRAIT_DIALOGUE: Record<PersonalityTrait, Record<TraitDialogueEvent, string[]>> = {
  ansioso: {
    capture: ['Peguei! Espero que seja a jogada certa...', 'Toma essa peça! Será que devia ter pensado mais?'],
    check: ['Xeque! Vai, vai, vai!', 'Xeque! Não parei pra calcular muito, mas...'],
    opening: ['Já escolhi minha abertura! Espero que funcione.', 'Vamos logo, não quero perder tempo pensando.'],
    playerGoodMove: ['Eita, boa jogada... isso me deixou nervoso.', 'Hmm, você jogou bem. Preciso me apressar!'],
    playerBadMove: ['Acho que você vacilou! Vou aproveitar!', 'Opa, deixou uma brecha!'],
  },
  'cabeca-quente': {
    capture: ['FORA! Essa peça é minha!', 'Captura agressiva! Sem piedade!'],
    check: ['XEQUE! Sinta a pressão!', 'Xeque! Não vou deixar você respirar!'],
    opening: ['Vou partir pra cima desde o início!', 'Abertura agressiva. Sem enrolação!'],
    playerGoodMove: ['Tsc... jogada forte. Mas eu não desisto!', 'Boa, mas eu vou virar esse jogo!'],
    playerBadMove: ['HA! Erro fatal! Agora é minha vez!', 'Você vacilou! Hora de atacar!'],
  },
  experiente: {
    capture: ['Troca calculada. A posição melhora.', 'Material capturado com precisão técnica.'],
    check: ['Xeque preciso. Suas opções diminuem.', 'Xeque metódico. A posição está sob controle.'],
    opening: ['Conheço bem essa abertura. Vamos ver sua preparação.', 'Abertura clássica. Jogo posicional desde cedo.'],
    playerGoodMove: ['Lance sólido. Preciso jogar com mais precisão.', 'Boa jogada. Respeito sua técnica.'],
    playerBadMove: ['Imprecisão detectada. Vou capitalizar.', 'Esse lance enfraquece sua posição.'],
  },
  medroso: {
    capture: ['Troca segura. Melhor simplificar.', 'Captura tranquila, sem riscos desnecessários.'],
    check: ['Xeque... mas sem me expor demais.', 'Um xeque cauteloso.'],
    opening: ['Vou jogar uma abertura segura.', 'Prefiro posições tranquilas no início.'],
    playerGoodMove: ['Você está jogando bem... preciso ter cuidado.', 'Boa jogada. Vou me proteger.'],
    playerBadMove: ['Acho que posso simplificar agora.', 'Hmm, talvez eu consiga trocar peças.'],
  },
  artista: {
    capture: ['Que captura elegante!', 'Material é secundário quando se joga bonito!'],
    check: ['Xeque com estilo!', 'Xeque! O tabuleiro é meu palco!'],
    opening: ['Vamos criar algo único nesta abertura!', 'Abertura criativa. Surpresa é meu estilo!'],
    playerGoodMove: ['Belo lance! Mas eu tenho algo melhor guardado.', 'Jogada criativa sua. Admiro, mas não vou perder.'],
    playerBadMove: ['Que oportunidade para um lance espetacular!', 'Seu erro me dá espaço para brilhar!'],
  },
  calmo: {
    capture: ['Captura feita. Seguimos em frente.', 'Peça capturada com tranquilidade.'],
    check: ['Xeque. Mantendo a calma.', 'Xeque aplicado. Sem pressa.'],
    opening: ['Abertura equilibrada. Vamos desenvolver com calma.', 'Início sólido. Sem pressa.'],
    playerGoodMove: ['Boa jogada. Vou manter a compostura.', 'Lance correto. Continuo focado.'],
    playerBadMove: ['Pequena imprecisão. Vou aproveitar com calma.', 'Erro detectado. Sem emoção, só xadrez.'],
  },
  estrategico: {
    capture: ['Captura que melhora minha estrutura.', 'Troca favorável no longo prazo.'],
    check: ['Xeque que restringe seu desenvolvimento.', 'Xeque posicional. Suas peças perdem mobilidade.'],
    opening: ['Abertura com plano claro. Controle do centro.', 'Início estratégico. Cada lance tem um propósito.'],
    playerGoodMove: ['Lance posicional forte. Preciso replanejar.', 'Boa estrutura. Vou ajustar meu plano.'],
    playerBadMove: ['Fraqueza estrutural. Vou explorar.', 'Esse lance compromete sua posição.'],
  },
  tatico: {
    capture: ['Captura tática! Vi a combinação.', 'Material ganho com cálculo preciso!'],
    check: ['XEQUE! A combinação continua!', 'Xeque! Calculei até o final!'],
    opening: ['Abertura que abre linhas para tática!', 'Início agressivo. Buscando combinações!'],
    playerGoodMove: ['Boa defesa, mas ainda vejo táticas.', 'Lance forte, mas não acabou a partida.'],
    playerBadMove: ['Erro tático! A combinação funciona!', 'Vacilo detectado! Hora da tática!'],
  },
};

export function pickTraitDialogue(
  traits: PersonalityTrait[],
  event: TraitDialogueEvent,
  priorityTrait?: PersonalityTrait
): string | null {
  if (traits.length === 0) return null;

  const orderedTraits = priorityTrait && traits.includes(priorityTrait)
    ? [priorityTrait, ...traits.filter((t) => t !== priorityTrait)]
    : traits;

  const pool = orderedTraits.flatMap((trait) => TRAIT_DIALOGUE[trait][event]);
  if (pool.length === 0) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}
