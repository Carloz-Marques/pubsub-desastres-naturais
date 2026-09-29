import PubSub from "./PubSub";

/**
 * Formato das mensagens de desastre.
 */
interface EventoDesastre {
  tipo: string;
  regiao: string;
  nivel: "baixo" | "moderado" | "alto" | "critico";
  detalhes: string;
  publisher: string;
}

/**
 * Destinatário de uma mensagem.
 */
interface Destinatario {
  id: number;
  nome: string;
  icone: string;
  acao: string;

  notificar(
    evento: EventoDesastre,
  ): void;
}

/**
 * Subscribers do sistema.
 */
class Assinante implements Destinatario {
  constructor(
    public id: number,
    public nome: string,
    public icone: string,
    public acao: string,
  ) {}

  notificar(
    _evento: EventoDesastre,
  ): void {
    console.log(
      `│ ${this.icone} ${this.nome}`,
    );

    console.log(
      `│    Ação: ${this.acao}`,
    );
  }
}

/**
 * Cores utilizadas no terminal.
 */
const cores = {
  reset: "\x1b[0m",
  negrito: "\x1b[1m",
  cinza: "\x1b[90m",
  verde: "\x1b[32m",
  amarelo: "\x1b[33m",
  vermelho: "\x1b[31m",
  azul: "\x1b[36m",
  roxo: "\x1b[35m",
};

/**
 * Tópicos do sistema.
 */
const TOPICO_ALAGAMENTO_CENTRO =
  "Alagamento_SetorCentral_Goiania";

const TOPICO_TEMPESTADE_SUL =
  "Tempestade_RegiaoSul_Goiania";

/**
 * Instância do Broker.
 */
const pubSub = new PubSub();

/**
 * Controla a numeração dos alertas.
 */
let numeroAlerta = 0;

/**
 * Cabeçalho principal.
 */
function mostrarCabecalho(): void {
  console.log(
    `${cores.azul}${cores.negrito}`,
  );

  console.log(
    "╔════════════════════════════════════════════════════════════╗",
  );

  console.log(
    "║   SISTEMA DE ALERTAS DE DESASTRES NATURAIS — GOIÂNIA     ║",
  );

  console.log(
    "╚════════════════════════════════════════════════════════════╝",
  );

  console.log(
    cores.reset,
  );
}

/**
 * Título de cada parte da apresentação.
 */
function mostrarSecao(
  titulo: string,
): void {
  console.log(
    `\n${cores.roxo}${cores.negrito}${titulo}${cores.reset}`,
  );

  console.log(
    `${cores.cinza}${"─".repeat(62)}${cores.reset}`,
  );
}

/**
 * Retorna uma cor conforme a gravidade.
 */
function corDoNivel(
  nivel: EventoDesastre["nivel"],
): string {
  if (nivel === "critico") {
    return cores.vermelho;
  }

  if (nivel === "alto") {
    return cores.amarelo;
  }

  if (nivel === "moderado") {
    return cores.azul;
  }

  return cores.verde;
}

/**
 * Mostra o resultado de uma inscrição.
 */
function mostrarInscricao(
  nome: string,
  topico: string,
  realizada: boolean,
): void {
  if (realizada) {
    console.log(
      `${cores.verde}✓${cores.reset} ${nome}`,
    );

    console.log(
      `  ${cores.cinza}└─ ${topico}${cores.reset}`,
    );

    return;
  }

  console.log(
    `${cores.amarelo}↪ Inscrição ignorada:${cores.reset} ` +
      `${nome} já está inscrito em ${topico}.`,
  );
}

/**
 * Publisher: publica um alerta no Broker.
 */
function reportarDesastre(
  topico: string,
  evento: EventoDesastre,
): void {
  numeroAlerta++;

  const numeroFormatado =
    String(numeroAlerta).padStart(
      2,
      "0",
    );

  const corNivel =
    corDoNivel(evento.nivel);

  console.log(
    `\n${cores.negrito}┌─ ALERTA ${numeroFormatado} ${"─".repeat(47)}${cores.reset}`,
  );

  console.log(
    `│ ${cores.cinza}Publisher:${cores.reset}  ${evento.publisher}`,
  );

  console.log(
    `│ ${cores.cinza}Tópico:${cores.reset}     ${topico}`,
  );

  console.log(
    `│ ${cores.cinza}Tipo:${cores.reset}       ${evento.tipo}`,
  );

  console.log(
    `│ ${cores.cinza}Região:${cores.reset}     ${evento.regiao}`,
  );

  console.log(
    `│ ${cores.cinza}Gravidade:${cores.reset}  ` +
      `${corNivel}${cores.negrito}${evento.nivel.toUpperCase()}${cores.reset}`,
  );

  console.log(
    `│ ${cores.cinza}Mensagem:${cores.reset}   ${evento.detalhes}`,
  );

  console.log(
    `├─ ${cores.negrito}SUBSCRIBERS NOTIFICADOS${cores.reset}`,
  );

  const quantidade =
    pubSub.publish(
      topico,
      evento,
    );

  if (quantidade === 0) {
    console.log(
      `│ ${cores.amarelo}⚠ Nenhum Subscriber inscrito neste tópico.${cores.reset}`,
    );
  }

  console.log(
    `├─ ${cores.cinza}Total: ${quantidade} notificado(s)${cores.reset}`,
  );

  console.log(
    `${cores.negrito}└${"─".repeat(61)}${cores.reset}`,
  );
}

/**
 * Função executada pelo index.ts.
 */
export function executarSimulacao(): void {
  mostrarCabecalho();

  /**
   * Criação dos Subscribers.
   */
  const aplicativo = new Assinante(
    1,
    "Aplicativo dos cidadãos",
    "📱",
    "Exibir uma notificação para os moradores.",
  );

  const sirene = new Assinante(
    2,
    "Sirene pública",
    "🚨",
    "Emitir um alerta sonoro para a população.",
  );

  const bombeiros = new Assinante(
    3,
    "Corpo de Bombeiros",
    "🚒",
    "Preparar uma equipe para atendimento.",
  );

  const defesaCivil = new Assinante(
    4,
    "Defesa Civil de Goiânia",
    "🛡️",
    "Monitorar e coordenar a ocorrência.",
  );

  /**
   * As mesmas funções precisam ser utilizadas
   * no subscribe e no unsubscribe.
   */
  const notificarAplicativo =
    aplicativo.notificar.bind(
      aplicativo,
    );

  const notificarSirene =
    sirene.notificar.bind(
      sirene,
    );

  const notificarBombeiros =
    bombeiros.notificar.bind(
      bombeiros,
    );

  const notificarDefesaCivil =
    defesaCivil.notificar.bind(
      defesaCivil,
    );

  /**
   * Configuração das inscrições.
   */
  mostrarSecao(
    "CONFIGURAÇÃO DOS TÓPICOS",
  );

  mostrarInscricao(
    aplicativo.nome,
    TOPICO_ALAGAMENTO_CENTRO,
    pubSub.subscribe(
      TOPICO_ALAGAMENTO_CENTRO,
      notificarAplicativo,
    ),
  );

  mostrarInscricao(
    sirene.nome,
    TOPICO_ALAGAMENTO_CENTRO,
    pubSub.subscribe(
      TOPICO_ALAGAMENTO_CENTRO,
      notificarSirene,
    ),
  );

  mostrarInscricao(
    bombeiros.nome,
    TOPICO_ALAGAMENTO_CENTRO,
    pubSub.subscribe(
      TOPICO_ALAGAMENTO_CENTRO,
      notificarBombeiros,
    ),
  );

  mostrarInscricao(
    defesaCivil.nome,
    TOPICO_ALAGAMENTO_CENTRO,
    pubSub.subscribe(
      TOPICO_ALAGAMENTO_CENTRO,
      notificarDefesaCivil,
    ),
  );

  mostrarInscricao(
    aplicativo.nome,
    TOPICO_TEMPESTADE_SUL,
    pubSub.subscribe(
      TOPICO_TEMPESTADE_SUL,
      notificarAplicativo,
    ),
  );

  mostrarInscricao(
    bombeiros.nome,
    TOPICO_TEMPESTADE_SUL,
    pubSub.subscribe(
      TOPICO_TEMPESTADE_SUL,
      notificarBombeiros,
    ),
  );

  mostrarInscricao(
    defesaCivil.nome,
    TOPICO_TEMPESTADE_SUL,
    pubSub.subscribe(
      TOPICO_TEMPESTADE_SUL,
      notificarDefesaCivil,
    ),
  );

  /**
   * Demonstra que uma inscrição duplicada
   * será recusada pelo Broker.
   */
  mostrarSecao(
    "VERIFICAÇÃO DE INSCRIÇÃO DUPLICADA",
  );

  mostrarInscricao(
    aplicativo.nome,
    TOPICO_ALAGAMENTO_CENTRO,
    pubSub.subscribe(
      TOPICO_ALAGAMENTO_CENTRO,
      notificarAplicativo,
    ),
  );

  /**
   * Cenário 1.
   */
  mostrarSecao(
    "CENÁRIO 1 — ALAGAMENTO NO SETOR CENTRAL",
  );

  reportarDesastre(
    TOPICO_ALAGAMENTO_CENTRO,
    {
      tipo: "Alagamento",
      regiao:
        "Setor Central de Goiânia",
      nivel: "alto",
      detalhes:
        "Chuva forte e elevação rápida do nível da água.",
      publisher:
        "Sensor do Córrego Botafogo",
    },
  );

  /**
   * Cenário 2.
   */
  mostrarSecao(
    "CENÁRIO 2 — SIRENE EM MANUTENÇÃO",
  );

  const sireneRemovida =
    pubSub.unsubscribe(
      TOPICO_ALAGAMENTO_CENTRO,
      notificarSirene,
    );

  if (sireneRemovida) {
    console.log(
      `${cores.verde}✓${cores.reset} ` +
        "A sirene foi desinscrita corretamente.",
    );
  }

  console.log(
    `${cores.cinza}Um novo alerta será publicado sem notificar a sirene.${cores.reset}`,
  );

  reportarDesastre(
    TOPICO_ALAGAMENTO_CENTRO,
    {
      tipo: "Alagamento",
      regiao:
        "Setor Central de Goiânia",
      nivel: "critico",
      detalhes:
        "Água avançando sobre as vias da região.",
      publisher:
        "Sensor do Córrego Botafogo",
    },
  );

  /**
   * Cenário 3.
   */
  mostrarSecao(
    "CENÁRIO 3 — TEMPESTADE NA REGIÃO SUL",
  );

  reportarDesastre(
    TOPICO_TEMPESTADE_SUL,
    {
      tipo: "Tempestade",
      regiao:
        "Região Sul de Goiânia",
      nivel: "moderado",
      detalhes:
        "Previsão de raios e rajadas de vento.",
      publisher:
        "Estação Meteorológica da Região Sul",
    },
  );

  /**
   * Cenário 4: tópico vazio.
   */
  mostrarSecao(
    "CENÁRIO 4 — TÓPICO SEM INSCRITOS",
  );

  pubSub.unsubscribe(
    TOPICO_TEMPESTADE_SUL,
    notificarAplicativo,
  );

  pubSub.unsubscribe(
    TOPICO_TEMPESTADE_SUL,
    notificarBombeiros,
  );

  pubSub.unsubscribe(
    TOPICO_TEMPESTADE_SUL,
    notificarDefesaCivil,
  );

  console.log(
    `${cores.amarelo}⚠ Todos os Subscribers foram removidos do tópico.${cores.reset}`,
  );

  reportarDesastre(
    TOPICO_TEMPESTADE_SUL,
    {
      tipo: "Tempestade",
      regiao:
        "Região Sul de Goiânia",
      nivel: "alto",
      detalhes:
        "Novo alerta de tempestade emitido.",
      publisher:
        "Estação Meteorológica da Região Sul",
    },
  );

  mostrarSecao(
    "SIMULAÇÃO FINALIZADA",
  );

  console.log(
    `${cores.verde}✓ Sistema executado com sucesso.${cores.reset}\n`,
  );
}