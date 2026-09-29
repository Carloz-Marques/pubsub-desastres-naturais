import PubSub from "./PubSub";

interface EventoDesastre {
  tipo: string;
  regiao: string;
  nivel: "baixo" | "moderado" | "alto" | "critico";
  mensagem: string;
  publisher: string;
}

type Notificacao = (
  evento: EventoDesastre,
) => void;

class Assinante {
  constructor(
    public nome: string,
    private icone: string,
    private acao: string,
  ) {}

  notificar(
    _evento: EventoDesastre,
  ): void {
    console.log(
      `│ ${this.icone} ${this.nome.padEnd(29)} ` +
        `${cores.cinza}→ ${this.acao}${cores.reset}`,
    );
  }
}

const cores = {
  reset: "\x1b[0m",
  negrito: "\x1b[1m",
  cinza: "\x1b[90m",
  azul: "\x1b[36m",
  verde: "\x1b[32m",
  amarelo: "\x1b[33m",
  vermelho: "\x1b[31m",
  roxo: "\x1b[35m",
};

const TOPICOS = {
  alagamento:
    "Alagamento_SetorCentral_Goiania",

  tempestade:
    "Tempestade_RegiaoSul_Goiania",
};

const broker = new PubSub();

let numeroAlerta = 0;

function linha(
  caractere = "═",
): string {
  return caractere.repeat(68);
}

function cabecalho(): void {
  console.log(
    `\n${cores.azul}${cores.negrito}`,
  );

  console.log(
    "╔════════════════════════════════════════════════════════════════════╗",
  );

  console.log(
    "║       SISTEMA PUB/SUB DE ALERTAS — GOIÂNIA                      ║",
  );

  console.log(
    "╚════════════════════════════════════════════════════════════════════╝",
  );

  console.log(
    cores.reset,
  );
}

function secao(
  titulo: string,
): void {
  console.log(
    `\n${cores.roxo}${cores.negrito}${linha()}`,
  );

  console.log(
    ` ${titulo}`,
  );

  console.log(
    `${linha()}${cores.reset}`,
  );
}

function corNivel(
  nivel: EventoDesastre["nivel"],
): string {
  const coresPorNivel = {
    baixo: cores.verde,
    moderado: cores.azul,
    alto: cores.amarelo,
    critico: cores.vermelho,
  };

  return coresPorNivel[nivel];
}

function inscrever(
  topico: string,
  assinante: Assinante,
  notificacao: Notificacao,
): void {
  const sucesso = broker.subscribe(
    topico,
    notificacao,
  );

  if (sucesso) {
    console.log(
      `${cores.verde}✓${cores.reset} ${assinante.nome}`,
    );

    console.log(
      `  ${cores.cinza}└─ ${topico}${cores.reset}`,
    );

    return;
  }

  console.log(
    `${cores.amarelo}⚠ ${assinante.nome} já está inscrito em ${topico}.${cores.reset}`,
  );
}

function desinscrever(
  topico: string,
  assinante: Assinante,
  notificacao: Notificacao,
): void {
  const sucesso = broker.unsubscribe(
    topico,
    notificacao,
  );

  const simbolo = sucesso
    ? `${cores.verde}✓`
    : `${cores.amarelo}⚠`;

  const mensagem = sucesso
    ? `${assinante.nome} foi removido de ${topico}.`
    : `${assinante.nome} não estava inscrito em ${topico}.`;

  console.log(
    `${simbolo} ${mensagem}${cores.reset}`,
  );
}

function campo(
  nome: string,
  valor: string,
): void {
  console.log(
    `│ ${cores.cinza}${nome.padEnd(12)}${cores.reset}${valor}`,
  );
}

function publicar(
  topico: string,
  evento: EventoDesastre,
): void {
  numeroAlerta++;

  const numero = String(
    numeroAlerta,
  ).padStart(2, "0");

  const nivelColorido =
    `${corNivel(evento.nivel)}` +
    `${cores.negrito}` +
    `${evento.nivel.toUpperCase()}` +
    `${cores.reset}`;

  console.log(
    `\n${cores.negrito}┌─ ALERTA ${numero} ${"─".repeat(55)}${cores.reset}`,
  );

  campo(
    "Publisher:",
    evento.publisher,
  );

  campo(
    "Tópico:",
    topico,
  );

  campo(
    "Tipo:",
    evento.tipo,
  );

  campo(
    "Região:",
    evento.regiao,
  );

  campo(
    "Gravidade:",
    nivelColorido,
  );

  campo(
    "Mensagem:",
    evento.mensagem,
  );

  console.log(
    `├─ ${cores.negrito}SUBSCRIBERS NOTIFICADOS${cores.reset}`,
  );

  const quantidade = broker.publish(
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
    `${cores.negrito}└${"─".repeat(67)}${cores.reset}`,
  );
}

export function executarSimulacao(): void {
  cabecalho();

  const aplicativo = new Assinante(
    "Aplicativo dos cidadãos",
    "📱",
    "Exibir notificação aos moradores.",
  );

  const sirene = new Assinante(
    "Sirene pública",
    "🚨",
    "Emitir alerta sonoro.",
  );

  const bombeiros = new Assinante(
    "Corpo de Bombeiros",
    "🚒",
    "Preparar uma equipe.",
  );

  const defesaCivil = new Assinante(
    "Defesa Civil de Goiânia",
    "🛡️",
    "Coordenar a ocorrência.",
  );

  const notificacoes = {
    aplicativo:
      aplicativo.notificar.bind(
        aplicativo,
      ),

    sirene:
      sirene.notificar.bind(
        sirene,
      ),

    bombeiros:
      bombeiros.notificar.bind(
        bombeiros,
      ),

    defesaCivil:
      defesaCivil.notificar.bind(
        defesaCivil,
      ),
  };

  secao(
    "CONFIGURAÇÃO DOS TÓPICOS",
  );

  const inscricoes: Array<
    [
      string,
      Assinante,
      Notificacao,
    ]
  > = [
    [
      TOPICOS.alagamento,
      aplicativo,
      notificacoes.aplicativo,
    ],
    [
      TOPICOS.alagamento,
      sirene,
      notificacoes.sirene,
    ],
    [
      TOPICOS.alagamento,
      bombeiros,
      notificacoes.bombeiros,
    ],
    [
      TOPICOS.alagamento,
      defesaCivil,
      notificacoes.defesaCivil,
    ],
    [
      TOPICOS.tempestade,
      aplicativo,
      notificacoes.aplicativo,
    ],
    [
      TOPICOS.tempestade,
      bombeiros,
      notificacoes.bombeiros,
    ],
    [
      TOPICOS.tempestade,
      defesaCivil,
      notificacoes.defesaCivil,
    ],
  ];

  inscricoes.forEach(
    ([
      topico,
      assinante,
      notificacao,
    ]) => {
      inscrever(
        topico,
        assinante,
        notificacao,
      );
    },
  );

  secao(
    "VERIFICAÇÃO DE INSCRIÇÃO DUPLICADA",
  );

  inscrever(
    TOPICOS.alagamento,
    aplicativo,
    notificacoes.aplicativo,
  );

  secao(
    "CENÁRIO 1 — ALAGAMENTO NO SETOR CENTRAL",
  );

  publicar(
    TOPICOS.alagamento,
    {
      tipo: "Alagamento",
      regiao:
        "Setor Central de Goiânia",
      nivel: "alto",
      mensagem:
        "Chuva forte e elevação rápida do nível da água.",
      publisher:
        "Sensor do Córrego Botafogo",
    },
  );

  secao(
    "CENÁRIO 2 — SIRENE EM MANUTENÇÃO",
  );

  desinscrever(
    TOPICOS.alagamento,
    sirene,
    notificacoes.sirene,
  );

  console.log(
    `${cores.cinza}Um novo alerta será publicado sem notificar a sirene.${cores.reset}`,
  );

  publicar(
    TOPICOS.alagamento,
    {
      tipo: "Alagamento",
      regiao:
        "Setor Central de Goiânia",
      nivel: "critico",
      mensagem:
        "Água avançando sobre as vias da região.",
      publisher:
        "Sensor do Córrego Botafogo",
    },
  );

  secao(
    "CENÁRIO 3 — TEMPESTADE NA REGIÃO SUL",
  );

  publicar(
    TOPICOS.tempestade,
    {
      tipo: "Tempestade",
      regiao:
        "Região Sul de Goiânia",
      nivel: "moderado",
      mensagem:
        "Previsão de raios e rajadas de vento.",
      publisher:
        "Estação Meteorológica da Região Sul",
    },
  );

  secao(
    "CENÁRIO 4 — TÓPICO SEM INSCRITOS",
  );

  const inscritosTempestade: Array<
    [
      Assinante,
      Notificacao,
    ]
  > = [
    [
      aplicativo,
      notificacoes.aplicativo,
    ],
    [
      bombeiros,
      notificacoes.bombeiros,
    ],
    [
      defesaCivil,
      notificacoes.defesaCivil,
    ],
  ];

  inscritosTempestade.forEach(
    ([
      assinante,
      notificacao,
    ]) => {
      desinscrever(
        TOPICOS.tempestade,
        assinante,
        notificacao,
      );
    },
  );

  publicar(
    TOPICOS.tempestade,
    {
      tipo: "Tempestade",
      regiao:
        "Região Sul de Goiânia",
      nivel: "alto",
      mensagem:
        "Novo alerta de tempestade emitido.",
      publisher:
        "Estação Meteorológica da Região Sul",
    },
  );

  secao(
    "SIMULAÇÃO FINALIZADA",
  );

  console.log(
    `${cores.verde}✓ Sistema executado com sucesso.${cores.reset}\n`,
  );
}