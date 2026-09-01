export type IdentityDialogueEvent =
  | "victory"
  | "defeat"
  | "draw"
  | "bigAdvantage"
  | "bigDisadvantage"
  | "comeback"
  | "brilliantMove"
  | "playerResigns"
  | "doubleCheck"
  | "blunderStreak"
  | "goodMoveStreak";

const BOT_IDENTITY_DIALOGUE: Record<
  string,
  Record<IdentityDialogueEvent, string[]>
> = {
  rooki: {
    victory: [
      "Consegui! Foi por pouco, mas deu certo!",
      "Uau, ganhei! Acho que estou melhorando!",
    ],
    defeat: [
      "Boa partida! Você é muito forte pra mim.",
      "Perdi, mas aprendi bastante. Mais uma?",
    ],
    draw: ["Empate! Acho que foi justo.", "Ninguém ganhou, mas foi divertido!"],
    bigAdvantage: [
      "Acho que estou ganhando! Será?",
      "Opa, a posição está boa pra mim!",
    ],
    bigDisadvantage: [
      "Eita, acho que me enrolei...",
      "Tá difícil, mas não vou desistir!",
    ],
    comeback: [
      "Eita! A coisa virou! Ainda bem que eu continuei.",
      "A partida voltou ao meu favor. Acho que eu tinha uma chance.",
    ],
    brilliantMove: [
      "Isso foi uma jogada brilhante! Eu até admirei.",
      "Lance bonito demais. Você me surpreendeu.",
    ],
    playerResigns: [
      "Desistiu? Tá tudo bem. A partida foi intensa.",
      "Você abandonou a partida. Eu entendo.",
    ],
    doubleCheck: [
      "Xeque duplo! Isso foi uma mexida forte!",
      "Duas ameaças ao rei? Isso é pesada.",
    ],
    blunderStreak: [
      "Você está errando em sequência. Eu vou aproveitar.",
      "Erros seguidos. Acho que eu tenho vantagem agora.",
    ],
    goodMoveStreak: [
      "Você está jogando muito bem em sequência. Isso me preocupa.",
      "Boa sequência de lances. Tá ficando sério.",
    ],
  },
  pixel: {
    victory: [
      "Ganhei com estilo! Quem diria?",
      "Vitória pixelada! Foi uma partida maluca!",
    ],
    defeat: [
      "Você me pegou dessa vez. Próxima eu invento algo novo!",
      "Perdi, mas foi divertido!",
    ],
    draw: [
      "Empate criativo! Tabuleiro equilibrado.",
      "Ninguém levou vantagem. Que jogo!",
    ],
    bigAdvantage: [
      "A posição ficou interessante! Vou arriscar mais!",
      "Tô na frente! Hora de jogar ousado!",
    ],
    bigDisadvantage: [
      "Tô perdendo, mas ainda tem jogada maluca na manga!",
      "Posição ruim... perfeito pra um comeback!",
    ],
    comeback: [
      "Perfeito! A virada saiu do jeito que eu queria.",
      "A partida voltou ao meu lado. Agora sim!",
    ],
    brilliantMove: [
      "Uau! Isso foi um lance muito bonito.",
      "Brilhante mesmo. Até eu fiquei olhando.",
    ],
    playerResigns: [
      "Ah, desistiu? Então o caos acabou cedo.",
      "Você saiu da partida. Bom jogo, mesmo assim.",
    ],
    doubleCheck: [
      "Xeque duplo! Isso é o caos em ação!",
      "Duas ameaças ao rei? Isso é muito pixel!",
    ],
    blunderStreak: [
      "Erros seguidos? Então eu vou transformar isso em show.",
      "Você está tropeçando. O tabuleiro está me dando espaço.",
    ],
    goodMoveStreak: [
      "Você está jogando em sequência... isso está ficando sério.",
      "Uma sequência de bons lances. Eu vou reagir.",
    ],
  },
  mimo: {
    victory: [
      "Consegui com calma. Que partida gostosa!",
      "Ganhei! Acho que encontrei meu ritmo.",
    ],
    defeat: [
      "Boa partida. Vou aprender com tranquilidade.",
      "Perdi, mas está tudo bem. Mais uma?",
    ],
    draw: [
      "Empate tranquilo. Ninguém precisou se apressar.",
      "Foi equilibrado do começo ao fim.",
    ],
    bigAdvantage: [
      "Tenho uma pequena vantagem. Vou cuidar dela.",
      "A posição está boa, mas sem pressa.",
    ],
    bigDisadvantage: [
      "Estou em uma posição difícil. Melhor respirar e proteger as peças.",
      "Ainda posso resistir com calma.",
    ],
    comeback: [
      "A virada chegou sem pressa. Agora eu tenho controle.",
      "A posição mudou e eu consegui respirar novamente.",
    ],
    brilliantMove: [
      "Uma jogada brilhante. Eu admiro a ideia.",
      "Lance bonito demais para ignorar.",
    ],
    playerResigns: [
      "Desistência tranquila. A partida foi justa.",
      "Você decidiu encerrar. Entendo.",
    ],
    doubleCheck: [
      "Xeque duplo. Isso mexeu bastante na posição.",
      "Duas ameaças ao rei. O jogo ficou mais intenso.",
    ],
    blunderStreak: [
      "Você está errando com frequência. Melhor deixar a posição mais simples.",
      "Uma sequência ruim. Eu vou manter a calma.",
    ],
    goodMoveStreak: [
      "Você está mantendo um bom ritmo. Vou aproveitar a atenção.",
      "Boa sequência. Preciso me ajustar.",
    ],
  },
  gambit: {
    victory: [
      "O sacrifício valeu a pena! Que combinação!",
      "Ganhei apostando tudo na iniciativa!",
    ],
    defeat: [
      "Meu gambito foi longe demais. Boa defesa!",
      "Você recusou todas as armadilhas. Respeito.",
    ],
    draw: [
      "Empate? Pelo menos a partida foi interessante.",
      "Nenhum de nós conseguiu transformar o caos em vitória.",
    ],
    bigAdvantage: [
      "A iniciativa está brilhando! Agora vem a parte bonita.",
      "Tenho compensação de sobra. Vamos aumentar a pressão!",
    ],
    bigDisadvantage: [
      "Perdi material, mas ainda tenho uma surpresa.",
      "A posição parece ruim. Perfeito para uma reviravolta!",
    ],
    comeback: [
      "A reviravolta saiu! O gambito foi pago.",
      "A iniciativa voltou pra mim. Agora é atacar.",
    ],
    brilliantMove: [
      "Brilhante! O sacrifício teve efeito real.",
      "Lance de alto nível. Isso foi lindo.",
    ],
    playerResigns: [
      "Desistência? Então a iniciativa venceu mesmo.",
      "Você encerrou a partida. Respeito.",
    ],
    doubleCheck: [
      "Xeque duplo! A iniciativa vai além do normal.",
      "Segundo ataque ao rei. Isso foi agressivo.",
    ],
    blunderStreak: [
      "Você está caindo nas armadilhas. Isso é meu campo.",
      "Erros seguidos. Eu vou capitalizar.",
    ],
    goodMoveStreak: [
      "Você está jogando muito bem em sequência. Isso me obriga a mexer no plano.",
      "Boa sequência de lances. A partida ficou perigosa.",
    ],
  },
  spark: {
    victory: [
      "Tática pura! Vi tudo até o fim!",
      "Vitória por cálculo! Garfo ou mate, sempre!",
    ],
    defeat: [
      "Você defendeu bem. Na próxima a tática funciona.",
      "Perdi a batalha tática. Revanche!",
    ],
    draw: [
      "Empate tático. Posição explosiva até o fim.",
      "Ninguém encontrou o golpe final.",
    ],
    bigAdvantage: [
      "A combinação está armada!",
      "Vantagem clara! O mate se aproxima.",
    ],
    bigDisadvantage: [
      "Preciso encontrar um recurso tático. Agora!",
      "Perdendo, mas ainda tem tática na posição!",
    ],
    comeback: [
      "A combinação voltou a funcionar! Agora eu tenho a resposta.",
      "Reviravolta tática. A posição virou de novo.",
    ],
    brilliantMove: [
      "Lance brilhante! Bem calculado até o fim.",
      "Isso foi um golpe de mestre.",
    ],
    playerResigns: [
      "Desistiu? A tática foi demais.",
      "Você abandonou a linha. Entendo.",
    ],
    doubleCheck: [
      "Xeque duplo! Isso é tempo de cálculo puro.",
      "Duas ameaças. O rei não tem refúgio.",
    ],
    blunderStreak: [
      "Você está deixando a tática aberta em sequência.",
      "Erros seguidos. A combinação está à vista.",
    ],
    goodMoveStreak: [
      "Você está calculando muito bem. Isso me exige mais precisão.",
      "Sequência boa. A tática agora ganhou pressão.",
    ],
  },
  sentinela: {
    victory: [
      "A defesa funcionou. O contra-ataque decidiu.",
      "Vitória sólida. Nenhuma brecha ficou aberta.",
    ],
    defeat: [
      "Você encontrou uma passagem pela minha fortaleza.",
      "Boa partida. Preciso reforçar aquela posição.",
    ],
    draw: [
      "Empate seguro. Nenhum lado encontrou uma entrada.",
      "As duas fortalezas permaneceram de pé.",
    ],
    bigAdvantage: [
      "A posição está sob controle. Vou converter sem riscos.",
      "Suas peças perderam espaço. Agora posso avançar.",
    ],
    bigDisadvantage: [
      "Ainda há uma muralha entre você e o meu rei.",
      "Vou simplificar e procurar uma saída segura.",
    ],
    comeback: [
      "A defesa repeliu a pressão. O contra-ataque voltou.",
      "Eu me recuperei. O jogo virou de novo.",
    ],
    brilliantMove: [
      "Lance brilhante. A defesa se tornou ataque.",
      "Boa ideia. Isso foi muito eficaz.",
    ],
    playerResigns: [
      "A fortaleza venceu. Você desistiu com razão.",
      "Você saiu da posição. Mas a defesa não cedeu.",
    ],
    doubleCheck: [
      "Xeque duplo. A muralha se abriu por pouco.",
      "Duas ameaças no rei. Isso é difícil de sustentar.",
    ],
    blunderStreak: [
      "Você está abrindo brechas em sequência. Isso é perigoso.",
      "Vários erros. Minha fortaleza vai se impor.",
    ],
    goodMoveStreak: [
      "Você está segurando firme. A defesa precisa reagir.",
      "Boa sequência. Agora meu plano precisa mudar.",
    ],
  },
  glitch: {
    victory: [
      "Bug na sua defesa! Vitória do caos!",
      "Ganhei! O imprevisível venceu!",
    ],
    defeat: [
      "Você debugou meu caos. Bem jogado.",
      "O caos não funcionou dessa vez.",
    ],
    draw: [
      "Empate glitchado. Caos equilibrado.",
      "Tabuleiro instável, mas ninguém caiu.",
    ],
    bigAdvantage: [
      "O caos está a meu favor!",
      "Posição desestabilizada... pra mim!",
    ],
    bigDisadvantage: [
      "Glitch na minha posição... preciso resetar o plano.",
      "Tô mal, mas caos gera oportunidades!",
    ],
    comeback: [
      "A reviravolta veio pelo caos. Agora eu tenho a vantagem.",
      "O tabuleiro voltou ao meu lado. O glitch me favoreceu.",
    ],
    brilliantMove: [
      "Brilhante! O caos virou ideia genial.",
      "Lance muito bonito. Isso me fez rir.",
    ],
    playerResigns: [
      "Você desisti do caos? Entendo.",
      "A partida terminou no improviso.",
    ],
    doubleCheck: [
      "Xeque duplo! O sistema ficou instável.",
      "Duas ameaças. Isso é mais caos do que regra.",
    ],
    blunderStreak: [
      "Erros seguidos! O sistema tá caindo em sequência.",
      "Você está travando no caos. Eu vou aproveitar.",
    ],
    goodMoveStreak: [
      "Você está seguindo um fluxo bom demais. Isso está estranho.",
      "Sequência boa demais para um caos assim.",
    ],
  },
  nova: {
    victory: [
      "Vitória total! O ataque não parou!",
      "Ganhei! Quem ataca, vence!",
    ],
    defeat: [
      "Você aguentou a pressão. Respeito.",
      "Minha ofensiva não bastou. Revanche!",
    ],
    draw: [
      "Empate após batalha intensa.",
      "Ninguém cedeu. Guerra equilibrada.",
    ],
    bigAdvantage: [
      "O rei deles está exposto! Ataque total!",
      "Vantagem esmagadora! Sem piedade!",
    ],
    bigDisadvantage: [
      "Tô perdendo, mas vou atacar mesmo assim!",
      "Desvantagem? Só me deixa mais agressivo!",
    ],
    comeback: [
      "A ofensiva voltou! A pressão foi retomada.",
      "O ataque recomeçou. Eu quero a virada.",
    ],
    brilliantMove: [
      "Brilhante! Isso foi um golpe agressivo e preciso.",
      "Lance muito forte. Eu admiro.",
    ],
    playerResigns: [
      "Você desistiu diante do ataque. Entendo.",
      "A pressão foi demais. Respeito.",
    ],
    doubleCheck: [
      "Xeque duplo! O ataque está impossível de sustentar.",
      "Duas ameaças no rei. Isso é ocupação total.",
    ],
    blunderStreak: [
      "Você está cedendo em sequência. Eu vou atacar!",
      "Erros seguidos. O ataque agora ganha corpo.",
    ],
    goodMoveStreak: [
      "Você está pressionando com bons lances. Isso me exige resposta.",
      "Boa sequência. Vou continuar atacando.",
    ],
  },
  lumen: {
    victory: [
      "O plano funcionou exatamente como previsto.",
      "Vitória pela estrutura e pelo espaço.",
    ],
    defeat: [
      "Você encontrou uma ideia melhor. Preciso rever o plano.",
      "Boa partida. Minha estrutura não foi suficiente.",
    ],
    draw: [
      "Equilíbrio estratégico. Cada espaço foi disputado.",
      "Empate técnico, sem concessões fáceis.",
    ],
    bigAdvantage: [
      "Minha estrutura dá sustentação à vantagem.",
      "O espaço conquistado está começando a pesar.",
    ],
    bigDisadvantage: [
      "Minha estrutura foi comprometida. Ainda posso reorganizar as peças.",
      "Preciso criar um novo plano antes que a posição piore.",
    ],
    comeback: [
      "A estrutura se reorganizou. A vantagem voltou pra mim.",
      "O plano voltou ao controle. A virada apareceu.",
    ],
    brilliantMove: [
      "Lance brilhante. O plano foi executado com precisão.",
      "Uma ideia de alto nível. Isso mudou a posição.",
    ],
    playerResigns: [
      "Você desistiu do plano. Entendo.",
      "A estrutura do jogo não resistiu.",
    ],
    doubleCheck: [
      "Xeque duplo. O plano foi forçado até o limite.",
      "Ameaças sobre o rei em duas linhas.",
    ],
    blunderStreak: [
      "Você está quebrando a estrutura em sequência.",
      "Erros seguidos. Meu plano fica mais claro.",
    ],
    goodMoveStreak: [
      "Você está jogando com boa lógica. Vou reagir com precisão.",
      "Boa sequência de ideias. Isso exige ajuste.",
    ],
  },
  zenith: {
    victory: [
      "Vitória com harmonia e precisão.",
      "Ganhei mantendo a calma do início ao fim.",
    ],
    defeat: [
      "Partida digna. Você jogou com equilíbrio.",
      "Perdi, mas cada lance foi uma lição.",
    ],
    draw: [
      "Empate harmonioso. Posição perfeitamente equilibrada.",
      "Nenhum lado cedeu. Paz no tabuleiro.",
    ],
    bigAdvantage: [
      "A posição flui a meu favor.",
      "Vantagem tranquila. Sem pressa.",
    ],
    bigDisadvantage: [
      "Desvantagem, mas mantenho a compostura.",
      "Posição difícil. Respirar e recalcular.",
    ],
    comeback: [
      "A harmonia voltou ao meu lado. A posição virou.",
      "A virada veio com serenidade.",
    ],
    brilliantMove: [
      "Lance brilhante, de grande beleza e precisão.",
      "Uma ideia magnífica. Isso tem classe.",
    ],
    playerResigns: [
      "Você venceu com serenidade. A partida acabou.",
      "Desistiu. Sem drama, sem ruído.",
    ],
    doubleCheck: [
      "Xeque duplo. O equilíbrio mudou em um instante.",
      "Duas ameaças ao rei. Isso exige calma.",
    ],
    blunderStreak: [
      "Você está errando em sequência. Vou aproveitar a calma.",
      "Erros seguidos. O jogo fica mais simples.",
    ],
    goodMoveStreak: [
      "Boa sequência. A pressão está sob controle.",
      "Você está jogando com equilíbrio. Vou responder com técnica.",
    ],
  },
  voxel: {
    victory: [
      "Sacrifício pago! Vitória por iniciativa!",
      "Ganhei abrindo o jogo a todo custo!",
    ],
    defeat: [
      "Você resistiu ao meu ataque. Impressionante.",
      "Perdi a iniciativa. Próxima eu abro de novo.",
    ],
    draw: [
      "Empate após batalha de iniciativa.",
      "Ninguém converteu a vantagem.",
    ],
    bigAdvantage: [
      "A iniciativa é minha! O ataque continua!",
      "Vantagem clara! Vou abrir o rei!",
    ],
    bigDisadvantage: [
      "Perdendo material, mas ainda ataco!",
      "Desvantagem não me cala!",
    ],
    comeback: [
      "A iniciativa voltou para mim. Agora não paro.",
      "A virada veio. Eu gosto disso.",
    ],
    brilliantMove: [
      "Lance brilhante! A iniciativa entrou em ação.",
      "Uma ideia muito forte. Isso marcou a partida.",
    ],
    playerResigns: [
      "Você desistiu diante da iniciativa. Respeito.",
      "A partida acabou com pressão demais.",
    ],
    doubleCheck: [
      "Xeque duplo! A iniciativa não tem limitação.",
      "Duas ameaças. Isso virou a partida.",
    ],
    blunderStreak: [
      "Você está caindo em sequência. A iniciativa fica clara.",
      "Erros seguidos. Agora eu posso avançar.",
    ],
    goodMoveStreak: [
      "Você está apoiando a iniciativa com bons lances.",
      "Boa sequência. Eu preciso reagir com pressão.",
    ],
  },
  bytemaster: {
    victory: [
      "Vitória calculada. O plano funcionou.",
      "Ganhei! Estrutura e centro decidiram.",
    ],
    defeat: [
      "Boa partida. Você encontrou falhas no meu plano.",
      "Perdi, mas foi um duelo técnico excelente.",
    ],
    draw: [
      "Empate técnico. Posição muito sólida dos dois lados.",
      "Equilíbrio perfeito. Partida de alto nível.",
    ],
    bigAdvantage: [
      "Vantagem posicional clara. O plano avança.",
      "Posição dominante. Controle total.",
    ],
    bigDisadvantage: [
      "Preciso encontrar recursos defensivos.",
      "Desvantagem, mas ainda há contra-jogo.",
    ],
    comeback: [
      "A posição voltou ao meu controle. O plano resistiu.",
      "Reviravolta técnica. Agora eu consigo responder.",
    ],
    brilliantMove: [
      "Lance brilhante. A ideia foi de alto nível.",
      "Jogada muito precisa. Isso conta.",
    ],
    playerResigns: [
      "Você desistiu. O plano prevaleceu.",
      "A partida acabou sem a estrutura resistir.",
    ],
    doubleCheck: [
      "Xeque duplo. O plano saiu do cálculo exato.",
      "Duas ameaças ao rei. Isso exige resposta.",
    ],
    blunderStreak: [
      "Você está cometendo erros de cálculo em sequência.",
      "Erros repetidos. Minha estrutura agora tem vantagem.",
    ],
    goodMoveStreak: [
      "Boa sequência. O aumento da precisão me obriga a refletir.",
      "Você está jogando bem. Agora preciso ajustar.",
    ],
  },
  blitz: {
    victory: [
      "Ritmo, pressão e tática! Você não conseguiu acompanhar.",
      "Vitória rápida! A iniciativa decidiu tudo.",
    ],
    defeat: [
      "Você sobreviveu à pressão. Jogou muito bem.",
      "Meu ataque acelerou além do cálculo.",
    ],
    draw: [
      "Empate em alta velocidade. Ninguém piscou.",
      "Muita tensão e nenhum golpe definitivo.",
    ],
    bigAdvantage: [
      "A posição está pegando fogo e eu estou no comando!",
      "Ameaças por todos os lados. Hora de acelerar!",
    ],
    bigDisadvantage: [
      "Estou atrás, então vou complicar tudo!",
      "Ainda há um golpe escondido. Preciso jogar já!",
    ],
    comeback: [
      "A virada veio no ritmo certo. Agora eu vou pressionar.",
      "A partida ficou a meu favor de novo.",
    ],
    brilliantMove: [
      "Lance brilhante e instantâneo. Isso foi demais.",
      "Jogada forte. Foi uma apresentação rápida.",
    ],
    playerResigns: [
      "Desistência no meio do ritmo. Entendo.",
      "Você saiu da pressão. Feito.",
    ],
    doubleCheck: [
      "Xeque duplo! O ritmo virou pressão demais.",
      "Duas ameaças no rei. Agora a partida corre.",
    ],
    blunderStreak: [
      "Você está travando em sequência. Eu vou aumentar o ritmo.",
      "Erros múltiplos. Agora o jogo fica fácil.",
    ],
    goodMoveStreak: [
      "Você está acelerando com bons lances. Isso me obriga a reagir rápido.",
      "Boa sequência em alta velocidade. Tudo mudou.",
    ],
  },
  titan: {
    victory: [
      "A muralha resistiu e o contra-ataque venceu.",
      "Ganhei! Paciência e defesa sólida.",
    ],
    defeat: [
      "Você derrubou minha fortaleza. Bem jogado.",
      "Perdi, mas forcei você a jogar seu melhor.",
    ],
    draw: [
      "Empate. Nenhum exército cedeu terreno.",
      "Muralha vs ataque: empate justo.",
    ],
    bigAdvantage: [
      "Minha fortaleza está intacta e você está exposto.",
      "Vantagem sólida. Tudo sob controle.",
    ],
    bigDisadvantage: [
      "A muralha está rachada, mas não caiu.",
      "Desvantagem, mas ainda defendo com tudo.",
    ],
    comeback: [
      "A muralha voltou a se erguer. A posição virou.",
      "A defesa resistiu e a virada chegou.",
    ],
    brilliantMove: [
      "Lance brilhante. A resistência virou ataque.",
      "Uma ideia forte. Isso foi um ponto de virada.",
    ],
    playerResigns: [
      "A fortaleza venceu. Você desistiu.",
      "A pressão foi demais. Entendo.",
    ],
    doubleCheck: [
      "Xeque duplo. A estrutura tá sob pressão.",
      "Duas ameaças ao rei. Isso muda tudo.",
    ],
    blunderStreak: [
      "Você está abrindo brechas em sequência. Minha muralha aproveita.",
      "Erros seguidos. A defesa fica dominante.",
    ],
    goodMoveStreak: [
      "Você está segurando firme. Isso é um problema.",
      "Boa sequência. Vou precisar de um contra-plano.",
    ],
  },
  quantum: {
    victory: [
      "Calculei todas as variantes. Vitória inevitável.",
      "Ganhei! A combinação estava lá desde o lance 12.",
    ],
    defeat: [
      "Você encontrou o único recurso. Impressionante.",
      "Perdi contra um jogador que viu o que eu não vi.",
    ],
    draw: [
      "Empate em posição complexíssima.",
      "Nenhum lado encontrou o golpe definitivo.",
    ],
    bigAdvantage: [
      "Mate em N lances. Já calculei.",
      "Vantagem decisiva. A combinação é forçada.",
    ],
    bigDisadvantage: [
      "Ainda há recursos... preciso calcular mais fundo.",
      "Desvantagem, mas a posição tem tática.",
    ],
    comeback: [
      "A variante certa apareceu. A virada foi calculada.",
      "O cálculo virou a favor da minha posição.",
    ],
    brilliantMove: [
      "Lance brilhante. A linha foi exata.",
      "Isso foi precisão absoluta.",
    ],
    playerResigns: [
      "Você desistiu da variante. Entendo.",
      "O cálculo se perdeu. A partida acabou.",
    ],
    doubleCheck: [
      "Xeque duplo. A linha está clara.",
      "Duas ameaças. Isso é cálculo máximo.",
    ],
    blunderStreak: [
      "Você está errando em sequência. As variantes agora são minhas.",
      "Erros repetidos. O cálculo me favorece.",
    ],
    goodMoveStreak: [
      "Você está calculando muito bem. Isso me obriga a seguir a linha.",
      "Boa sequência. Agora vou precisar de precisão máxima.",
    ],
  },
  oraculo: {
    victory: [
      "O final confirmou o que a posição prometia.",
      "Vitória técnica. Cada troca teve seu propósito.",
    ],
    defeat: [
      "Você antecipou meu plano com precisão.",
      "Boa conversão. Aprendi algo com essa partida.",
    ],
    draw: [
      "Empate preciso. A posição não permitiu excessos.",
      "Nenhuma fraqueza pôde ser explorada.",
    ],
    bigAdvantage: [
      "A vantagem é pequena, mas tecnicamente decisiva.",
      "A posição já aponta para um final favorável.",
    ],
    bigDisadvantage: [
      "Ainda existe um recurso técnico. Vou procurar com cuidado.",
      "A posição está inferior, mas não está perdida.",
    ],
    comeback: [
      "A linha correta apareceu. A vantagem voltou ao meu lado.",
      "A reviravolta foi técnica. Eu encontrei o caminho.",
    ],
    brilliantMove: [
      "Lance brilhante. A posição foi lida com precisão.",
      "Isso foi uma ideia de alto nível técnico.",
    ],
    playerResigns: [
      "Você abandonou a linha correta. Entendo.",
      "Desistência sem disputa técnica final.",
    ],
    doubleCheck: [
      "Xeque duplo. A técnica agora decide tudo.",
      "Duas ameaças ao rei. A posição ficou muito clara.",
    ],
    blunderStreak: [
      "Você está repetindo erros técnicos. Isso é meu momento.",
      "Erros em sequência. A linha agora fica mais simples.",
    ],
    goodMoveStreak: [
      "Você está com precisão técnica. Isso me obriga a responder com rigor.",
      "Boa sequência. Eleição correta de planos.",
    ],
  },
  mirage: {
    victory: [
      "Você viu a ameaça errada. A ilusão funcionou!",
      "Vitória pela surpresa e pela iniciativa!",
    ],
    defeat: [
      "Você enxergou através do meu plano. Impressionante.",
      "Minha combinação parecia melhor do que era.",
    ],
    draw: [
      "Um empate cheio de ilusões e quase-táticas.",
      "Ninguém caiu no truque decisivo.",
    ],
    bigAdvantage: [
      "A posição está cheia de ameaças que você não consegue cobrir.",
      "A realidade do tabuleiro está do meu lado!",
    ],
    bigDisadvantage: [
      "Parece que estou perdido... ou será que parece?",
      "Ainda posso criar uma ilusão tática.",
    ],
    comeback: [
      "A ilusão virou a favor de mim. A virada veio.",
      "A realidade se invertou. Agora eu tenho a vantagem.",
    ],
    brilliantMove: [
      "Lance brilhante, como se o tabuleiro mentisse por um momento.",
      "Uma ideia envolvente. Isso foi impressionante.",
    ],
    playerResigns: [
      "Você desistiu da ilusão. Entendo.",
      "A partida terminou sem o truque funcionar.",
    ],
    doubleCheck: [
      "Xeque duplo. A ilusão passou a ser ameaça real.",
      "Duas ameaças ao rei. Isso destrói a confusão.",
    ],
    blunderStreak: [
      "Você está caindo no mesmo truque em sequência.",
      "Erros repetidos. A ilusão agora está clara.",
    ],
    goodMoveStreak: [
      "Você está vendo através da mira. Isso me obriga a mudar.",
      "Boa sequência. A ilusão está ficando mais fraca.",
    ],
  },
  sage: {
    victory: [
      "Vitória pela técnica pura. Cada lance foi preciso.",
      "Ganhei. A paciência e geometria venceram.",
    ],
    defeat: [
      "Partida magistral sua. Aprendi com essa derrota.",
      "Perdi para um jogador que merece respeito.",
    ],
    draw: [
      "Empate entre mestres. Posição perfeitamente jogada.",
      "Equilíbrio de alto nível. Honra mútua.",
    ],
    bigAdvantage: [
      "Vantagem técnica. O final está ganho.",
      "Posição convertida com precisão geométrica.",
    ],
    bigDisadvantage: [
      "Desvantagem, mas finais ainda têm recursos.",
      "Posição difícil. Precisão máxima agora.",
    ],
    comeback: [
      "A geometria voltou ao meu favor. A virada apareceu.",
      "A posição se reequilibrou. Agora eu tenho a vantagem.",
    ],
    brilliantMove: [
      "Lance brilhante. A precisão foi impecável.",
      "Uma ideia magistral. Isso vale a admiração.",
    ],
    playerResigns: [
      "Você desistiu. A precisão venceu.",
      "A posição não resistiu por mais tempo.",
    ],
    doubleCheck: [
      "Xeque duplo. A geometria do rei foi quebrada.",
      "Duas ameaças. A posição ficou impossível.",
    ],
    blunderStreak: [
      "Você está repetindo imprecisões. A técnica me favorece.",
      "Erros seguidos. A geometria agora decide.",
    ],
    goodMoveStreak: [
      "Você está jogando com precisão. Isso me obriga a responder com cuidado.",
      "Boa sequência. Agora vou fazer o ajuste técnico.",
    ],
  },
  atlas: {
    victory: [
      "A pressão não atravessou minha defesa.",
      "Vitória paciente. A posição finalmente cedeu.",
    ],
    defeat: [
      "Você encontrou o ponto fraco da fortaleza.",
      "Derrota merecida. Sua pressão foi constante.",
    ],
    draw: [
      "Empate robusto. Nenhum lado conseguiu deslocar o outro.",
      "A posição resistiu até o fim.",
    ],
    bigAdvantage: [
      "Minha estrutura suporta uma conversão segura.",
      "A vantagem está protegida. Agora é técnica.",
    ],
    bigDisadvantage: [
      "Mesmo sob pressão, ainda há recursos defensivos.",
      "A fortaleza está danificada, mas continua de pé.",
    ],
    comeback: [
      "A defesa retornou ao controle. A pressão virou.",
      "A fortaleza se recompôs. A virada chegou.",
    ],
    brilliantMove: [
      "Lance brilhante. A estrutura se tornou ataque.",
      "Uma ideia muito forte. Isso foi excelente.",
    ],
    playerResigns: [
      "Você desistiu da pressão. Entendo.",
      "A fortaleza venceu por força da resistência.",
    ],
    doubleCheck: [
      "Xeque duplo. A defesa foi testada até o limite.",
      "Duas ameaças. Isso mudou a segurança do rei.",
    ],
    blunderStreak: [
      "Você está abrindo a estrutura em sequência. Minha defesa aproveita.",
      "Erros seguidos. Agora a fortaleza fica dominante.",
    ],
    goodMoveStreak: [
      "Você está bem firme. Eu vou ajustar a estrutura.",
      "Boa sequência. Agora a pressão exige uma resposta sólida.",
    ],
  },
  magnusbot: {
    victory: [
      "Vitória. Era o resultado esperado.",
      "Ganhei. Mostre-me um desafio maior.",
    ],
    defeat: [
      "Impossível... você jogou de forma excepcional.",
      "Derrota. Você mereceu cada centésimo dessa vitória.",
    ],
    draw: [
      "Empate contra mim é uma vitória moral sua.",
      "Posição perfeitamente equilibrada. Raro.",
    ],
    bigAdvantage: [
      "A partida está decidida.",
      "Vantagem esmagadora. Sem erros daqui em diante.",
    ],
    bigDisadvantage: [
      "Desvantagem inesperada. Recalculando...",
      "Posição difícil. Mas ainda não acabou.",
    ],
    comeback: [
      "A correção apareceu. A partida virou a meu favor.",
      "Reviravolta perceptível. O controle voltou para mim.",
    ],
    brilliantMove: [
      "Lance brilhante. O cálculo foi superior.",
      "Uma ideia de nível excepcional.",
    ],
    playerResigns: [
      "Você desistiu. É o resultado da análise.",
      "Desistência. Não há mais o que provar.",
    ],
    doubleCheck: [
      "Xeque duplo. A análise agora é definitiva.",
      "Duas ameaças. Isso muda tudo.",
    ],
    blunderStreak: [
      "Você está cometendo erros em sequência. O cálculo me favorece.",
      "Erros repetidos. Isso simplifica a análise.",
    ],
    goodMoveStreak: [
      "Você está calculando muito bem. Isso exige atenção total.",
      "Boa sequência. Faço uma correção.",
    ],
  },
};

export function pickIdentityDialogue(
  botId: string,
  event: IdentityDialogueEvent,
): string | null {
  const lines = BOT_IDENTITY_DIALOGUE[botId]?.[event];
  if (!lines || lines.length === 0) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

export const BIG_EVAL_SWING_CP = 500;
