/** Uma função subscriber recebe a mensagem publicada. */
export interface Subscriber {
  (mensagem: any): void;
}

/** Broker simplificado, seguindo a mesma ideia do vídeo. */
export default class PubSub {
  private topicos: { [nome: string]: Subscriber[] } = {};

  subscribe(topico: string, subscriber: Subscriber): void {
    if (!this.topicos[topico]) {
      this.topicos[topico] = [];
    }
    this.topicos[topico].push(subscriber);
  }

  unsubscribe(topico: string, subscriber: Subscriber): void {
    if (!this.topicos[topico]) return;
    this.topicos[topico] = this.topicos[topico].filter(
      (inscrito) => inscrito !== subscriber,
    );
  }

  publish(topico: string, mensagem: any): void {
    if (!this.topicos[topico]) return;
    this.topicos[topico].forEach((subscriber) => subscriber(mensagem));
  }
}
