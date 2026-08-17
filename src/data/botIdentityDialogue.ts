export type IdentityDialogueEvent = 'victory' | 'defeat' | 'draw' | 'bigAdvantage' | 'bigDisadvantage';

const BOT_IDENTITY_DIALOGUE: Record<string, Record<IdentityDialogueEvent, string[]>> = {
  rooki: {
    victory: ['Consegui! Foi por pouco, mas deu certo!', 'Uau, ganhei! Acho que estou melhorando!'],
    defeat: ['Boa partida! Você é muito forte pra mim.', 'Perdi, mas aprendi bastante. Mais uma?'],
    draw: ['Empate! Acho que foi justo.', 'Ninguém ganhou, mas foi divertido!'],
    bigAdvantage: ['Acho que estou ganhando! Será?', 'Opa, a posição está boa pra mim!'],
    bigDisadvantage: ['Eita, acho que me enrolei...', 'Tá difícil, mas não vou desistir!'],
  },
  pixel: {
    victory: ['Ganhei com estilo! Quem diria?', 'Vitória pixelada! Foi uma partida maluca!'],
    defeat: ['Você me pegou dessa vez. Próxima eu invento algo novo!', 'Perdi, mas foi divertido!'],
    draw: ['Empate criativo! Tabuleiro equilibrado.', 'Ninguém levou vantagem. Que jogo!'],
    bigAdvantage: ['A posição ficou interessante! Vou arriscar mais!', 'Tô na frente! Hora de jogar ousado!'],
    bigDisadvantage: ['Tô perdendo, mas ainda tem jogada maluca na manga!', 'Posição ruim... perfeito pra um comeback!'],
  },
  spark: {
    victory: ['Tática pura! Vi tudo até o fim!', 'Vitória por cálculo! Garfo ou mate, sempre!'],
    defeat: ['Você defendeu bem. Na próxima a tática funciona.', 'Perdi a batalha tática. Revanche!'],
    draw: ['Empate tático. Posição explosiva até o fim.', 'Ninguém encontrou o golpe final.'],
    bigAdvantage: ['A combinação está armada!', 'Vantagem clara! O mate se aproxima.'],
    bigDisadvantage: ['Preciso encontrar um recurso tático. Agora!', 'Perdendo, mas ainda tem tática na posição!'],
  },
  glitch: {
    victory: ['Bug na sua defesa! Vitória do caos!', 'Ganhei! O imprevisível venceu!'],
    defeat: ['Você debugou meu caos. Bem jogado.', 'O caos não funcionou dessa vez.'],
    draw: ['Empate glitchado. Caos equilibrado.', 'Tabuleiro instável, mas ninguém caiu.'],
    bigAdvantage: ['O caos está a meu favor!', 'Posição desestabilizada... pra mim!'],
    bigDisadvantage: ['Glitch na minha posição... preciso resetar o plano.', 'Tô mal, mas caos gera oportunidades!'],
  },
  nova: {
    victory: ['Vitória total! O ataque não parou!', 'Ganhei! Quem ataca, vence!'],
    defeat: ['Você aguentou a pressão. Respeito.', 'Minha ofensiva não bastou. Revanche!'],
    draw: ['Empate após batalha intensa.', 'Ninguém cedeu. Guerra equilibrada.'],
    bigAdvantage: ['O rei deles está exposto! Ataque total!', 'Vantagem esmagadora! Sem piedade!'],
    bigDisadvantage: ['Tô perdendo, mas vou atacar mesmo assim!', 'Desvantagem? Só me deixa mais agressivo!'],
  },
  zenith: {
    victory: ['Vitória com harmonia e precisão.', 'Ganhei mantendo a calma do início ao fim.'],
    defeat: ['Partida digna. Você jogou com equilíbrio.', 'Perdi, mas cada lance foi uma lição.'],
    draw: ['Empate harmonioso. Posição perfeitamente equilibrada.', 'Nenhum lado cedeu. Paz no tabuleiro.'],
    bigAdvantage: ['A posição flui a meu favor.', 'Vantagem tranquila. Sem pressa.'],
    bigDisadvantage: ['Desvantagem, mas mantenho a compostura.', 'Posição difícil. Respirar e recalcular.'],
  },
  voxel: {
    victory: ['Sacrifício pago! Vitória por iniciativa!', 'Ganhei abrindo o jogo a todo custo!'],
    defeat: ['Você resistiu ao meu ataque. Impressionante.', 'Perdi a iniciativa. Próxima eu abro de novo.'],
    draw: ['Empate após batalha de iniciativa.', 'Ninguém converteu a vantagem.'],
    bigAdvantage: ['A iniciativa é minha! O ataque continua!', 'Vantagem clara! Vou abrir o rei!'],
    bigDisadvantage: ['Perdendo material, mas ainda ataco!', 'Desvantagem não me cala!'],
  },
  bytemaster: {
    victory: ['Vitória calculada. O plano funcionou.', 'Ganhei! Estrutura e centro decidiram.'],
    defeat: ['Boa partida. Você encontrou falhas no meu plano.', 'Perdi, mas foi um duelo técnico excelente.'],
    draw: ['Empate técnico. Posição muito sólida dos dois lados.', 'Equilíbrio perfeito. Partida de alto nível.'],
    bigAdvantage: ['Vantagem posicional clara. O plano avança.', 'Posição dominante. Controle total.'],
    bigDisadvantage: ['Preciso encontrar recursos defensivos.', 'Desvantagem, mas ainda há contra-jogo.'],
  },
  titan: {
    victory: ['A muralha resistiu e o contra-ataque venceu.', 'Ganhei! Paciência e defesa sólida.'],
    defeat: ['Você derrubou minha fortaleza. Bem jogado.', 'Perdi, mas forcei você a jogar seu melhor.'],
    draw: ['Empate. Nenhum exército cedeu terreno.', 'Muralha vs ataque: empate justo.'],
    bigAdvantage: ['Minha fortaleza está intacta e você está exposto.', 'Vantagem sólida. Tudo sob controle.'],
    bigDisadvantage: ['A muralha está rachada, mas não caiu.', 'Desvantagem, mas ainda defendo com tudo.'],
  },
  quantum: {
    victory: ['Calculei todas as variantes. Vitória inevitável.', 'Ganhei! A combinação estava lá desde o lance 12.'],
    defeat: ['Você encontrou o único recurso. Impressionante.', 'Perdi contra um jogador que viu o que eu não vi.'],
    draw: ['Empate em posição complexíssima.', 'Nenhum lado encontrou o golpe definitivo.'],
    bigAdvantage: ['Mate em N lances. Já calculei.', 'Vantagem decisiva. A combinação é forçada.'],
    bigDisadvantage: ['Ainda há recursos... preciso calcular mais fundo.', 'Desvantagem, mas a posição tem tática.'],
  },
  sage: {
    victory: ['Vitória pela técnica pura. Cada lance foi preciso.', 'Ganhei. A paciência e geometria venceram.'],
    defeat: ['Partida magistral sua. Aprendi com essa derrota.', 'Perdi para um jogador que merece respeito.'],
    draw: ['Empate entre mestres. Posição perfeitamente jogada.', 'Equilíbrio de alto nível. Honra mútua.'],
    bigAdvantage: ['Vantagem técnica. O final está ganho.', 'Posição convertida com precisão geométrica.'],
    bigDisadvantage: ['Desvantagem, mas finais ainda têm recursos.', 'Posição difícil. Precisão máxima agora.'],
  },
  magnusbot: {
    victory: ['Vitória. Era o resultado esperado.', 'Ganhei. Mostre-me um desafio maior.'],
    defeat: ['Impossível... você jogou de forma excepcional.', 'Derrota. Você mereceu cada centésimo dessa vitória.'],
    draw: ['Empate contra mim é uma vitória moral sua.', 'Posição perfeitamente equilibrada. Raro.'],
    bigAdvantage: ['A partida está decidida.', 'Vantagem esmagadora. Sem erros daqui em diante.'],
    bigDisadvantage: ['Desvantagem inesperada. Recalculando...', 'Posição difícil. Mas ainda não acabou.'],
  },
};

export function pickIdentityDialogue(botId: string, event: IdentityDialogueEvent): string | null {
  const lines = BOT_IDENTITY_DIALOGUE[botId]?.[event];
  if (!lines || lines.length === 0) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

export const BIG_EVAL_SWING_CP = 500;
