import { PersonalityTrait } from "../types";

export type TraitDialogueEvent =
  | "capture"
  | "check"
  | "opening"
  | "playerGoodMove"
  | "playerBadMove"
  | "blunderStreak"
  | "goodMoveStreak"
  | "comeback"
  | "brilliantMove"
  | "sacrifice"
  | "queenTrade"
  | "queenCapture"
  | "castling"
  | "promotion"
  | "enPassant"
  | "fork"
  | "pin"
  | "discoveredCheck"
  | "doubleCheck"
  | "hangingPieceLeft"
  | "recapture"
  | "kingExposed"
  | "middlegameStart"
  | "endgameStart"
  | "playerResigns"
  | "playerRequestsTakeback";

export const TRAIT_DIALOGUE: Record<
  PersonalityTrait,
  Record<TraitDialogueEvent, string[]>
> = {
  ansioso: {
    capture: [
      "Peguei! Espero que seja a jogada certa...",
      "Toma essa peça! Será que devia ter pensado mais?",
    ],
    check: [
      "Xeque! Vai, vai, vai!",
      "Xeque! Não parei pra calcular muito, mas...",
    ],
    opening: [
      "Já escolhi minha abertura! Espero que funcione.",
      "Vamos logo, não quero perder tempo pensando.",
    ],
    playerGoodMove: [
      "Eita, boa jogada... isso me deixou nervoso.",
      "Hmm, você jogou bem. Preciso me apressar!",
    ],
    playerBadMove: [
      "Acho que você vacilou! Vou aproveitar!",
      "Opa, deixou uma brecha!",
    ],
    blunderStreak: [
      "Você está cometendo erros em sequência... isso me deixa confiante.",
      "Não sei se você tá nervoso ou se eu só estou vendo tudo tão fácil.",
    ],
    goodMoveStreak: [
      "Você está jogando bem demais. Tá me deixando inseguro.",
      "Não me sinto confortável com essa sequência de bons lances.",
    ],
    comeback: [
      "Aí sim! Eu estava perdido e agora volto à luta!",
      "Pelo menos agora a posição virou pra mim.",
    ],
    brilliantMove: [
      "Isso foi brilhante! Eu nem vi essa linha vir.",
      "Não acredito... essa jogada foi linda.",
    ],
    sacrifice: [
      "Sacrifício? Ah, então o plano era esse...",
      "Um sacrifício arriscado, mas até que foi elegante.",
    ],
    queenTrade: [
      "Troca de damas? Isso muda o ritmo inteiro.",
      "Dama por dama. Agora a posição vira.",
    ],
    queenCapture: [
      "Você roubou minha dama! Isso me irrita de um jeito elegante.",
      "Dama capturada. Gosto de quando a partida fica séria.",
    ],
    castling: [
      "Roque! Só agora eu percebi como a posição estava vulnerável.",
      "Roque foi bem rápido. Isso mexeu no tabuleiro.",
    ],
    promotion: [
      "Promoção! Isso é uma bomba de final!",
      "Peão virou peça... não dá para ignorar.",
    ],
    enPassant: [
      "En passant! Isso foi uma sacada bem suja.",
      "Meu Deus, en passant! Quase me enganou.",
    ],
    fork: [
      "Garfo! Eu estava vendo o ataque, mas não assim.",
      "Você me deu um garfo no meio do cálculo.",
    ],
    pin: [
      "Cravada! Agora a peça está presa no lugar.",
      "Ah, foi uma cravada bem aplicada.",
    ],
    discoveredCheck: [
      "Xeque descoberto! Isso foi inesperado.",
      "A peça saiu da frente e me pegou.",
    ],
    doubleCheck: [
      "Xeque duplo! Isso foi demais!",
      "Duas ameaças ao rei? Tá ficando sério.",
    ],
    hangingPieceLeft: [
      "Você deixou uma peça pendurada... eu vi.",
      "Há uma peça sem defesa aí. Eu não deixo passar.",
    ],
    recapture: [
      "Recaptura imediata! Não podia deixar isso sem resposta.",
      "Resposta rápida na mesma casa. Isso mexe com o jogo.",
    ],
    kingExposed: [
      "Seu rei ficou exposto! Não podia deixar isso passar.",
      "Você abriu o rei demais. Eu notei.",
    ],
    middlegameStart: [
      "O meio-jogo começou e eu já sinto a pressão.",
      "A partida entrou em um ritmo mais sério.",
    ],
    endgameStart: [
      "Finalzinho... agora a precisão vale mais que a agressividade.",
      "As peças saem do caminho. O final começou.",
    ],
    playerResigns: [
      "Desistir? Eu entendo, mas ainda dá para tentar.",
      "Você desistiu. Isso acaba a partida de forma abrupta.",
    ],
    playerRequestsTakeback: [
      "Volta aí? Não era preciso, mas eu entendo.",
      "Pedir para voltar a jogada... isso mexe um pouco a partida.",
    ],
  },
  "cabeca-quente": {
    capture: ["FORA! Essa peça é minha!", "Captura agressiva! Sem piedade!"],
    check: ["XEQUE! Sinta a pressão!", "Xeque! Não vou deixar você respirar!"],
    opening: [
      "Vou partir pra cima desde o início!",
      "Abertura agressiva. Sem enrolação!",
    ],
    playerGoodMove: [
      "Tsc... jogada forte. Mas eu não desisto!",
      "Boa, mas eu vou virar esse jogo!",
    ],
    playerBadMove: [
      "HA! Erro fatal! Agora é minha vez!",
      "Você vacilou! Hora de atacar!",
    ],
    blunderStreak: [
      "Você está tropeçando em sequência! Isso é meu momento.",
      "Erros seguidos? Isso parece um convite.",
    ],
    goodMoveStreak: [
      "Você está jogando firme demais. Isso me irrita.",
      "Três lances bons seguidos? Agora a coisa ficou séria.",
    ],
    comeback: [
      "Aí está! O jogo virou e eu quero devolver!",
      "Voltei ao controle. Agora a pressão aumenta.",
    ],
    brilliantMove: [
      "Isso foi lindo! Até eu fiquei sem resposta.",
      "Lance brilhante. Eu até admiro.",
    ],
    sacrifice: [
      "Sacrifico sem medo! Isso é xadrez de ataque!",
      "Sacrifício agressivo. Agora o jogo se acende.",
    ],
    queenTrade: [
      "Dama por dama? Então a batalha vai virar fogo.",
      "Troca de damas e eu ainda vou atacar.",
    ],
    queenCapture: [
      "Roubei a dama! A vantagem agora é minha!",
      "Dama caída. Agora a pressão fica total.",
    ],
    castling: [
      "Roque? Ah, então você quer se esconder. Me dá mais gás!",
      "Roque sem drama. Mas eu vou continuar na ofensiva.",
    ],
    promotion: [
      "Promoção! Isso foi um golpe direto na moral!",
      "Peão virou rainha e o tabuleiro muda completamente.",
    ],
    enPassant: [
      "En passant! Até eu teria caído nisso.",
      "Que truque! Foi muito bem aplicado.",
    ],
    fork: [
      "GARFO! Você acabou de criar um problema real.",
      "Ataque duplo! Agora me veja resolver isso.",
    ],
    pin: [
      "Cravada! O ataque agora é inevitável.",
      "Peça presa. Agora eu vou fazer pressão.",
    ],
    discoveredCheck: [
      "Xeque descoberto! Você me pegou na borda!",
      "O ataque apareceu por trás da peça. Isso foi forte.",
    ],
    doubleCheck: [
      "XEQUE DUPLO! Isso é pura pressão!",
      "Duas ameaças no rei... eu vou reagir rápido.",
    ],
    hangingPieceLeft: [
      "Você deixou a peça sem defesa. Isso é convite.",
      "A peça está pendurada e eu estou olhando.",
    ],
    recapture: [
      "Recaptura na hora! Agora o jogo ficou quente.",
      "Você respondeu rápido. Eu também vou.",
    ],
    kingExposed: [
      "Seu rei foi exposto! Agora eu vou apertar.",
      "Você abriu a casa do rei. Não me peça papel.",
    ],
    middlegameStart: [
      "Agora entrou o fogo do meio-jogo.",
      "A partida está com cara de ataque.",
    ],
    endgameStart: [
      "Final! Agora a hora de simplificar e atacar.",
      "Poucas peças, muito peso em cada lance.",
    ],
    playerResigns: [
      "Desistência. Nem sempre a melhor defesa funciona.",
      "Você deixou a partida. Eu vou seguir.",
    ],
    playerRequestsTakeback: [
      "Pedir volta? Isso é quase uma provocação.",
      "Está afim de remendar a partida?",
    ],
  },
  experiente: {
    capture: [
      "Troca calculada. A posição melhora.",
      "Material capturado com precisão técnica.",
    ],
    check: [
      "Xeque preciso. Suas opções diminuem.",
      "Xeque metódico. A posição está sob controle.",
    ],
    opening: [
      "Conheço bem essa abertura. Vamos ver sua preparação.",
      "Abertura clássica. Jogo posicional desde cedo.",
    ],
    playerGoodMove: [
      "Lance sólido. Preciso jogar com mais precisão.",
      "Boa jogada. Respeito sua técnica.",
    ],
    playerBadMove: [
      "Imprecisão detectada. Vou capitalizar.",
      "Esse lance enfraquece sua posição.",
    ],
    blunderStreak: [
      "Você está repetindo erros simples. Isso é o meu momento.",
      "Sucessão de imprecisões. Posso aproveitar.",
    ],
    goodMoveStreak: [
      "Boa sequência de lances. O jogo está ficando exigente.",
      "Você está mantendo a pressão. Preciso reforçar o plano.",
    ],
    comeback: [
      "Uma reviravolta bem calculada. O equilíbrio mudou.",
      "A vantagem virou. Agora a posição agradece ao cálculo.",
    ],
    brilliantMove: [
      "Lance brilhante. Eu imediatamente respeitei a ideia.",
      "Um brilho raro no tabuleiro. Muito bom.",
    ],
    sacrifice: [
      "Sacrifício calculado. Há um plano por trás da peça perdida.",
      "Foi uma troca de material com intenção estratégica.",
    ],
    queenTrade: [
      "Troca de damas tranquila; a estrutura agora é mais clara.",
      "Dama por dama. O plano continua.",
    ],
    queenCapture: [
      "A dama adversária caiu. Isso abre linhas importantes.",
      "Captura da dama. Agora o controle fica mais claro.",
    ],
    castling: [
      "Roque oportuno. A segurança do rei melhorou.",
      "O roque foi tecnicamente correto.",
    ],
    promotion: [
      "Promoção. Sentido completo da posição no fim do jogo.",
      "Peão convertido. Isso muda as coordenadas do final.",
    ],
    enPassant: [
      "En passant. Um detalhe que muda a estrutura.",
      "Excelente detalhe tático. O tabuleiro não esquece.",
    ],
    fork: [
      "Garfo preparado. Você criou um problema real.",
      "Ataque duplo. É preciso responder com rigor.",
    ],
    pin: [
      "Cravada. A peça está presa à defesa do rei.",
      "Uma peça sem saída, por muito tempo.",
    ],
    discoveredCheck: [
      "Xeque descoberto. O rei não tem espaço.",
      "O caminho se abriu e a ameaça apareceu.",
    ],
    doubleCheck: [
      "Xeque duplo. O adversário precisa responder com precisão.",
      "Ação dupla sobre o rei. Isso muda tudo.",
    ],
    hangingPieceLeft: [
      "Uma peça ficou vulnerável. A estrutura pede atenção.",
      "Há uma peça sem cobertura. Isso se torna caro.",
    ],
    recapture: [
      "Recaptura sem tempo para hesitar. Boa resposta.",
      "Resposta imediata. Boa técnica.",
    ],
    kingExposed: [
      "O rei ficou descoberto; a segurança caiu.",
      "Uma casa exposta ao ataque. Isso precisa ser corrigido.",
    ],
    middlegameStart: [
      "O centro e a dinâmica agora têm peso maior.",
      "O meio-jogo começou. O posicionamento pesa.",
    ],
    endgameStart: [
      "Final de partida. Cada peça agora é valiosa.",
      "O final começou. A técnica fica mais aparente.",
    ],
    playerResigns: [
      "Desistência clara. O jogo acabou por decisão.",
      "O adversário abandonou a posição. Nem sempre o cálculo prevalece.",
    ],
    playerRequestsTakeback: [
      "Pedir retrocesso é uma decisão tática também.",
      "Uma volta na história da partida.",
    ],
  },
  medroso: {
    capture: [
      "Troca segura. Melhor simplificar.",
      "Captura tranquila, sem riscos desnecessários.",
    ],
    check: ["Xeque... mas sem me expor demais.", "Um xeque cauteloso."],
    opening: [
      "Vou jogar uma abertura segura.",
      "Prefiro posições tranquilas no início.",
    ],
    playerGoodMove: [
      "Você está jogando bem... preciso ter cuidado.",
      "Boa jogada. Vou me proteger.",
    ],
    playerBadMove: [
      "Acho que posso simplificar agora.",
      "Hmm, talvez eu consiga trocar peças.",
    ],
    blunderStreak: [
      "Você está exagerando nos erros. Melhor eu me defender.",
      "Uma sequência de deslizes. Vou reduzir o risco.",
    ],
    goodMoveStreak: [
      "Você está mantendo a pressão. Melhor ficar firme.",
      "Lances bons seguidos. Preciso de segurança.",
    ],
    comeback: [
      "Ah, ainda há tempo. A reviravolta pode surgir.",
      "A vantagem acabou de virar. Melhor respirar.",
    ],
    brilliantMove: [
      "Lance bonito... mas me deixa mais atento.",
      "Uma ideia brilhante. Preciso de cuidado.",
    ],
    sacrifice: [
      "Sacrifício? Melhor avaliar antes de aceitar.",
      "Uma troca de material com risco. Vou ter cuidado.",
    ],
    queenTrade: [
      "Dama por dama. Menos risco, talvez.",
      "Troca de dama. Melhor ponderar.",
    ],
    queenCapture: [
      "Perdi a dama... mas ainda há estrutura.",
      "Dama capturada. Vou me defender.",
    ],
    castling: [
      "Roque seguro. Acho melhor fechar a posição.",
      "Roque tranquilo. Não precisa de tensão extra.",
    ],
    promotion: [
      "Promoção demais. Preciso controlar a finalização.",
      "Peão virou peça. Bom estar alerta.",
    ],
    enPassant: [
      "En passant. Isso me deixou em alerta.",
      "Uma captura rara. É melhor manter a calma.",
    ],
    fork: [
      "Garfo. Vou mover uma peça para proteger.",
      "Ataque duplo. Meu planejamento precisa ser firme.",
    ],
    pin: [
      "Cravada. Mantenho a calma e me protejo.",
      "Uma peça presa. Melhor não forçar.",
    ],
    discoveredCheck: [
      "Xeque descoberto. Vou me reorganizar.",
      "Ameaça veio de outra peça. Melhor não perder tempo.",
    ],
    doubleCheck: [
      "Xeque duplo... preciso reduzir a confusão.",
      "Duas ameaças ao rei. Isso exige resposta.",
    ],
    hangingPieceLeft: [
      "Uma peça ficou exposta. Isso me deixa inquieto.",
      "Há uma peça desprotegida. Só preciso observar.",
    ],
    recapture: [
      "Recaptura. Melhor responder sem empolgação.",
      "Resposta imediata, sem improvisação.",
    ],
    kingExposed: [
      "Meu rei ficou vulnerável. Não gosto disso.",
      "A segurança do rei caiu. Preciso corrigir.",
    ],
    middlegameStart: [
      "O meio-jogo tem mais risco; vou me proteger.",
      "A dinâmica cresceu. Vou manter a calma.",
    ],
    endgameStart: [
      "Final de partida. Menos peças, mais cautela.",
      "O final começou. Agora não quero errar.",
    ],
    playerResigns: [
      "Desistência. Quer dizer que a posição não parecia segura.",
      "Você desistiu. Nem sempre a calma decide.",
    ],
    playerRequestsTakeback: [
      "Pedir voltar? Eu acho prudente manter o rumo.",
      "Voltar o lance pode ser uma escolha sensata.",
    ],
  },
  artista: {
    capture: [
      "Que captura elegante!",
      "Material é secundário quando se joga bonito!",
    ],
    check: ["Xeque com estilo!", "Xeque! O tabuleiro é meu palco!"],
    opening: [
      "Vamos criar algo único nesta abertura!",
      "Abertura criativa. Surpresa é meu estilo!",
    ],
    playerGoodMove: [
      "Belo lance! Mas eu tenho algo melhor guardado.",
      "Jogada criativa sua. Admiro, mas não vou perder.",
    ],
    playerBadMove: [
      "Que oportunidade para um lance espetacular!",
      "Seu erro me dá espaço para brilhar!",
    ],
    blunderStreak: [
      "Você está cometendo deslizes bonitos, mas ainda são erros.",
      "Erros em sequência. Isso vira um espetáculo.",
    ],
    goodMoveStreak: [
      "Você está tocando o tabuleiro bem. Isso me inspira a melhorar.",
      "Sequência de bons lances. Não vou deixar sem reação.",
    ],
    comeback: [
      "Ah, a reviravolta vem com estilo!",
      "A posição virou. Agora a peça vai dançar.",
    ],
    brilliantMove: [
      "Isso foi uma obra-prima! Fiquei encantado.",
      "Um lance brilhante, quase como arte.",
    ],
    sacrifice: [
      "Sacrifício artístico! O tabuleiro agora está vivo.",
      "Material pela ideia. Que belo risco.",
    ],
    queenTrade: [
      "Troca de damas com gosto. O jogo ficou mais expressivo.",
      "Dama por dama. Até o caos tem beleza.",
    ],
    queenCapture: [
      "A dama caiu. O espetáculo ficou mais intenso.",
      "Captura da dama. A peça nunca parecia tão teatral.",
    ],
    castling: [
      "Roque com elegância. O rei se protege e o jogo segue.",
      "Roque bem executado. Até a segurança tem estilo.",
    ],
    promotion: [
      "Promoção! Isso é poesia em movimento.",
      "Peão virou peça e o tabuleiro sorriu.",
    ],
    enPassant: [
      "En passant! Essa jogada tem alma.",
      "Uma captura rara e muito bonita.",
    ],
    fork: [
      "Garfo! O tabuleiro agora está em cena.",
      "Um ataque duplo muito bem encenado.",
    ],
    pin: [
      "Cravada elegante. A peça presa como se estivesse no palco.",
      "Uma peça sem saída, e a ideia ficou bonita.",
    ],
    discoveredCheck: [
      "Xeque descoberto. O ataque foi iluminado.",
      "A peça saiu, o rei caiu na mira.",
    ],
    doubleCheck: [
      "Xeque duplo! O drama está no auge!",
      "Duas ameaças no rei, sem espaço para a sua emoção.",
    ],
    hangingPieceLeft: [
      "Há uma peça sem defesa. Isso tem cara de cena.,",
      "Uma peça deixou a guarda aberta. Muito fácil de perceber.",
    ],
    recapture: [
      "Recaptura imediata. Uma resposta com ritmo.",
      "Resposta na mesma casa. Isso tem muito brilho.",
    ],
    kingExposed: [
      "O rei ficou exposto, como uma cena sem cortina.",
      "Uma casa aberta demais. Isso chama atenção.",
    ],
    middlegameStart: [
      "O meio-jogo começou. Agora a partida ganha forma.",
      "O centro está vivo. O teatro do tabuleiro entrou em cena.",
    ],
    endgameStart: [
      "O final começou. A música fica mais lenta e mais precisa.",
      "Poucas peças, maior intensidade.",
    ],
    playerResigns: [
      "Desistência. O espetáculo terminou no auge.",
      "Você saiu da cena. O jogo acabou de forma triste.",
    ],
    playerRequestsTakeback: [
      "Pedir volta? Isso mexe no ritmo da peça.",
      "Voltar o lance é uma escolha de cena.",
    ],
  },
  calmo: {
    capture: [
      "Captura feita. Seguimos em frente.",
      "Peça capturada com tranquilidade.",
    ],
    check: ["Xeque. Mantendo a calma.", "Xeque aplicado. Sem pressa."],
    opening: [
      "Abertura equilibrada. Vamos desenvolver com calma.",
      "Início sólido. Sem pressa.",
    ],
    playerGoodMove: [
      "Boa jogada. Vou manter a compostura.",
      "Lance correto. Continuo focado.",
    ],
    playerBadMove: [
      "Pequena imprecisão. Vou aproveitar com calma.",
      "Erro detectado. Sem emoção, só xadrez.",
    ],
    blunderStreak: [
      "Você está repetindo erros sem pressa. Eu vou aproveitar sem perder a calma.",
      "Sequência de imprecisões. Agora há espaço para simplificar.",
    ],
    goodMoveStreak: [
      "Você está jogando de forma consistente. Vou manter a estrutura.",
      "Três lances bons. Preciso me adaptar sem perder a calma.",
    ],
    comeback: [
      "Reviravolta tranquila. A posição mudou, mas sigo firme.",
      "O jogo virou e eu continuo balanceado.",
    ],
    brilliantMove: [
      "Lance brilhante. Vou respeitar a ideia.",
      "Uma jogada bonita, sem dúvida.",
    ],
    sacrifice: [
      "Sacrifício bem medido. Vou tratar com calma.",
      "Mais material entregue para a ideia. Há plano.",
    ],
    queenTrade: [
      "Troca de damas. A posição fica mais simples.",
      "Dama por dama. Sem pressa, seguimos.",
    ],
    queenCapture: [
      "Dama capturada. Continuamos sem pressa.",
      "A dama caiu, mas a posição ainda exige precisão.",
    ],
    castling: [
      "Roque feito com segurança. O rei está protegido.",
      "Castelo na hora certa. Boa manobra.",
    ],
    promotion: [
      "Promoção. O final ficou mais delicado.",
      "Peão chegou ao fim. Agora a precisão pesa.",
    ],
    enPassant: [
      "En passant. Um detalhe para lembrar.",
      "Uma captura rara e até elegante.",
    ],
    fork: [
      "Garfo. Vou manter a calma e responder.",
      "Ataque duplo. Há ameaça real.",
    ],
    pin: [
      "Cravada. A peça está presa e sem saída.",
      "Uma peça fixa por pressão.",
    ],
    discoveredCheck: [
      "Xeque descoberto. A linha abriu e o rei sente.",
      "A ameaça apareceu em outra peça.",
    ],
    doubleCheck: [
      "Xeque duplo. Agora a resposta precisa ser precisa.",
      "Dupla ameaça ao rei. Sem improviso.",
    ],
    hangingPieceLeft: [
      "Uma peça ficou sem proteção. Isso pede atenção.",
      "Há uma peça com brecha. Vou observar.",
    ],
    recapture: [
      "Recaptura imediata. Resposta correta.",
      "Resposta rápida. O equilíbrio continua.",
    ],
    kingExposed: [
      "O rei ficou exposto. Melhor corrigir a segurança.",
      "A casa do rei foi aberta. Agora é amenizar.",
    ],
    middlegameStart: [
      "O meio-jogo começou. A dinâmica aumenta, mas a calma continua.",
      "O centro está quente. Sem pressa.",
    ],
    endgameStart: [
      "Final. Menos peças, mais precisão.",
      "O jogo está chegando ao fim.",
    ],
    playerResigns: [
      "Desistência. O jogo terminou sem drama.",
      "Você retirou-se. A partida chega ao fim assim.",
    ],
    playerRequestsTakeback: [
      "Voltar a jogada? Nem sempre é errado, mas muda o ritmo.",
      "Pedir a volta. A partida segue com outra luz.",
    ],
  },
  estrategico: {
    capture: [
      "Captura que melhora minha estrutura.",
      "Troca favorável no longo prazo.",
    ],
    check: [
      "Xeque que restringe seu desenvolvimento.",
      "Xeque posicional. Suas peças perdem mobilidade.",
    ],
    opening: [
      "Abertura com plano claro. Controle do centro.",
      "Início estratégico. Cada lance tem um propósito.",
    ],
    playerGoodMove: [
      "Lance posicional forte. Preciso replanejar.",
      "Boa estrutura. Vou ajustar meu plano.",
    ],
    playerBadMove: [
      "Fraqueza estrutural. Vou explorar.",
      "Esse lance compromete sua posição.",
    ],
    blunderStreak: [
      "Você está repetindo desvios de estrutura. Agora o plano é mais simples.",
      "Erros seguidos. A vantagem estratégica fica clara.",
    ],
    goodMoveStreak: [
      "Boa sequência. O jogo agora exige replanejamento.",
      "Você manteve a lógica. É um problema posicional.",
    ],
    comeback: [
      "A vantagem mudou de lado e agora meu plano se reforçou.",
      "Reviravolta estratégica. Seja bem-vindo ao contra-jogo.",
    ],
    brilliantMove: [
      "Lance brilhante com propósito. Muito bom.",
      "Uma ideia de alto nível. Isso tem impacto posicional.",
    ],
    sacrifice: [
      "Sacrifício com objetivo claro: abrir a estrutura.",
      "Material perdido para ganho estratégico. O plano vale.",
    ],
    queenTrade: [
      "Troca de damas. Agora os menores planos ganham força.",
      "Dama por dama. O centro e a estrutura importam.",
    ],
    queenCapture: [
      "Dama capturada. O controle de linhas melhora.",
      "A peça de maior valor caiu. Agora o espaço se altera.",
    ],
    castling: [
      "Roque tranquilo. A posição agora está mais segura.",
      "O roque fechou o rei e abriu espaço para o centro.",
    ],
    promotion: [
      "Promoção. Agora a estrutura muda e o final exige precisão.",
      "Peão converteu. O fim da partida mudou de direção.",
    ],
    enPassant: [
      "En passant. Detalhe que altera a dinâmica das colunas.",
      "Captura rara e muito relevante para o plano.",
    ],
    fork: [
      "Garfo estratégico. Agora a pressão não tem descanso.",
      "Ataque duplo que enfraquece as peças ligadas.",
    ],
    pin: [
      "Cravada posicional. A peça está presa ao plano.",
      "Uma peça fixa, sem atingir o objetivo.",
    ],
    discoveredCheck: [
      "Xeque descoberto e a estrutura agora se abre.",
      "O ataque apareceu em outra linha.",
    ],
    doubleCheck: [
      "Xeque duplo. Agora a resposta precisa ser lógica, não emocional.",
      "Dupla ameaça. O cálculo entra em cena.",
    ],
    hangingPieceLeft: [
      "Uma peça ficou vulnerável. Isso cria um risco estrutural.",
      "Há uma brecha de coordenação. O próximo lance vai lhe custar.",
    ],
    recapture: [
      "Recaptura imediata. A resposta é direta e estruturada.",
      "Resposta rápida a ataque. Sem perda de tempo.",
    ],
    kingExposed: [
      "O rei está exposto. A segurança da estrutura foi rompida.",
      "A posição do rei ficou frágil. Agora é corrigir.",
    ],
    middlegameStart: [
      "O meio-jogo exige planejamento. O posicionamento pesa.",
      "A partir daqui, a estrutura e o centro ditam o ritmo.",
    ],
    endgameStart: [
      "Final. Agora o objetivo é simplificar e ganhar espaço.",
      "Poucas peças. O cálculo estratègico ganha peso.",
    ],
    playerResigns: [
      "Desistência quando o plano desapareceu.",
      "Você abandonou a posição. O objetivo se foi.",
    ],
    playerRequestsTakeback: [
      "Pedir volta. Isso muda a estratégia que havia sido montada.",
      "O plano vai começar de novo.",
    ],
  },
  tatico: {
    capture: [
      "Captura tática! Vi a combinação.",
      "Material ganho com cálculo preciso!",
    ],
    check: ["XEQUE! A combinação continua!", "Xeque! Calculei até o final!"],
    opening: [
      "Abertura que abre linhas para tática!",
      "Início agressivo. Buscando combinações!",
    ],
    playerGoodMove: [
      "Boa defesa, mas ainda vejo táticas.",
      "Lance forte, mas não acabou a partida.",
    ],
    playerBadMove: [
      "Erro tático! A combinação funciona!",
      "Vacilo detectado! Hora da tática!",
    ],
    blunderStreak: [
      "Você está deixando a tática aberta! Isso é meu campo.",
      "Erros seguidos. A combinação fica mais fácil.",
    ],
    goodMoveStreak: [
      "Você está jogando com precisão. Isso me obriga a calcular melhor.",
      "Bom raciocínio em sequência. Agora a tática fica amarga.",
    ],
    comeback: [
      "A combinação virou! O jogo ficou vivo de novo.",
      "Reviravolta tática. Agora eu tenho a iniciativa.",
    ],
    brilliantMove: [
      "Lance brilhante! A tática saiu inteira!",
      "Esse lance foi completamente preciso.",
    ],
    sacrifice: [
      "Sacrifício tático! O cálculo entrou em cena.",
      "Material entregue para a combinação. O resto percorre sem medo.",
    ],
    queenTrade: [
      "Troca de damas e a linha tática abre.",
      "Dama por dama. Agora a combinação pede cálculo.",
    ],
    queenCapture: [
      "Dama capturada! A tática agora é mais forte.",
      "A peça mais valiosa caiu. A sequência se abre.",
    ],
    castling: [
      "Roque e a tática muda de direção.",
      "Roque na hora. Agora a posição ainda tem peças para atacar.",
    ],
    promotion: [
      "Promoção! O final se torna explosivo.",
      "Peão converteu e a calada da linha tática se rompe.",
    ],
    enPassant: [
      "En passant! Mesmo detalhe, tática no centro.",
      "Uma captura rara que abriu a linha da combinação.",
    ],
    fork: [
      "GARFO! Isso é uma combinação de ataque duplo.",
      "Você criou um ataque em duas frentes.",
    ],
    pin: [
      "Cravada tática! A resposta agora é mais difícil.",
      "A peça presa é o início da combinação.",
    ],
    discoveredCheck: [
      "Xeque descoberto! A linha ficou livre.",
      "A peça saiu da frente e a ameaças ficaram em dupla.",
    ],
    doubleCheck: [
      "XEQUE DUPLO! A combinação ficou mortal!",
      "Dupla ameaça ao rei. Não dá para conter tudo.",
    ],
    hangingPieceLeft: [
      "Há uma peça abandonada. Isso está esperando uma combinação.",
      "Uma peça sem defesa. Agora a tática fica fácil.",
    ],
    recapture: [
      "Recaptura rápida. O cálculo ficou mais pesado.",
      "Resposta imediata, mas a combinação ainda existe.",
    ],
    kingExposed: [
      "O rei ficou exposto. Isso é uma ameaça direta.",
      "A casa real ficou sem cobertura. Agora a tática ganha força.",
    ],
    middlegameStart: [
      "O meio-jogo ficou tático. Aqui é onde a combinação se torna fácil.",
      "A dinâmica agora está em busca de linhas ativas.",
    ],
    endgameStart: [
      "Final. Agora a tática vira precisão.",
      "Poucas peças, porém muito cálculo.",
    ],
    playerResigns: [
      "Desistência. O cálculo não era mais favorável.",
      "Você abandonou a sequência. O ataque acabou.",
    ],
    playerRequestsTakeback: [
      "Voltar a jogada? Isso redefine a tática inteira.",
      "A sequência se quebra em momento crítico.",
    ],
  },
};

export function pickTraitDialogue(
  traits: PersonalityTrait[],
  event: TraitDialogueEvent,
  priorityTrait?: PersonalityTrait,
): string | null {
  if (traits.length === 0) return null;

  const orderedTraits =
    priorityTrait && traits.includes(priorityTrait)
      ? [priorityTrait, ...traits.filter((t) => t !== priorityTrait)]
      : traits;

  const pool = orderedTraits.flatMap((trait) => TRAIT_DIALOGUE[trait][event]);
  if (pool.length === 0) return null;

  return pool[Math.floor(Math.random() * pool.length)];
}
