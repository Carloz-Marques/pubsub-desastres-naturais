import PubSub from "./PubSub";

interface EventoDesastre {
  tipo: string;
  regiao: string;
  nivel: string;
  detalhes: string;
}

interface Destinatario {
  id: number;
  nome: string;
  notificar(evento: EventoDesastre): void;
}

class Assinante implements Destinatario {
  constructor(
    public id: number,
    public nome: string,
  ) {}

  notificar(evento: EventoDesastre): void {
    console.log(
      `Notificação para ${this.nome}: ${evento.tipo} em ${evento.regiao} ` +
        `| nível ${evento.nivel} | ${evento.detalhes}`,
    );
  }
}

// O PubSub representa o Broker/Gerenciador de tópicos.
const pubSub = new PubSub();

// Publisher: simula um sensor reportando um desastre.
function reportarDesastre(evento: EventoDesastre): void {
  console.log("\n" + "*".repeat(60));
  console.log(
    `EVENTO REPORTADO: ${evento.tipo} em ${evento.regiao} ` +
      `| nível ${evento.nivel}`,
  );
  console.log("*".repeat(60));

  // A região funciona como tópico, como no exemplo do vídeo.
  pubSub.publish(evento.regiao, evento);
}

export function executarSimulacao(): void {
  // Criando os subscribers.
  const aplicativo = new Assinante(1, "Aplicativo dos cidadãos");
  const sirene = new Assinante(2, "Sirene pública");
  const bombeiros = new Assinante(3, "Corpo de Bombeiros");

  // As mesmas funções serão usadas para inscrever e desinscrever.
  const notificarAplicativo = aplicativo.notificar.bind(aplicativo);
  const notificarSirene = sirene.notificar.bind(sirene);
  const notificarBombeiros = bombeiros.notificar.bind(bombeiros);

  pubSub.subscribe("Setor Central de Goiânia", notificarAplicativo);
  pubSub.subscribe("Setor Central de Goiânia", notificarSirene);
  pubSub.subscribe("Setor Central de Goiânia", notificarBombeiros);

  pubSub.subscribe("Região Sul de Goiânia", notificarAplicativo);
  pubSub.subscribe("Região Sul de Goiânia", notificarBombeiros);

  reportarDesastre({
    tipo: "Alagamento",
    regiao: "Setor Central de Goiânia",
    nivel: "alto",
    detalhes: "Chuva forte e elevação rápida do nível da água.",
  });

  pubSub.unsubscribe("Setor Central de Goiânia", notificarSirene);
  console.log("\nA sirene cancelou sua inscrição para manutenção.");

  reportarDesastre({
    tipo: "Alagamento",
    regiao: "Setor Central de Goiânia",
    nivel: "crítico",
    detalhes: "Água avançando sobre as vias da região.",
  });

  reportarDesastre({
    tipo: "Tempestade",
    regiao: "Região Sul de Goiânia",
    nivel: "moderado",
    detalhes: "Previsão de raios e rajadas de vento.",
  });
}
