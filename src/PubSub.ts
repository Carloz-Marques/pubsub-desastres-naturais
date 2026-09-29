interface Subscriber {
  (message: any): void;
}

class PubSub {
  private topics: {
    [topic: string]: Subscriber[];
  } = {};

  /**
   * Inscreve um Subscriber.
   *
   * Retorna true quando a inscrição é realizada.
   * Retorna false quando já existe essa inscrição.
   */
  subscribe(
    topic: string,
    subscriber: Subscriber,
  ): boolean {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }

    const alreadySubscribed =
      this.topics[topic].includes(subscriber);

    if (alreadySubscribed) {
      return false;
    }

    this.topics[topic].push(subscriber);

    return true;
  }

  /**
   * Remove um Subscriber.
   *
   * Retorna true quando ele foi removido.
   * Retorna false quando não estava inscrito.
   */
  unsubscribe(
    topic: string,
    subscriber: Subscriber,
  ): boolean {
    if (!this.topics[topic]) {
      return false;
    }

    const subscriberExists =
      this.topics[topic].includes(subscriber);

    if (!subscriberExists) {
      return false;
    }

    this.topics[topic] =
      this.topics[topic].filter(
        (currentSubscriber) =>
          currentSubscriber !== subscriber,
      );

    return true;
  }

  /**
   * Publica uma mensagem e retorna a quantidade
   * de Subscribers notificados.
   */
  publish(
    topic: string,
    message: any,
  ): number {
    const subscribers =
      this.topics[topic];

    if (
      !subscribers ||
      subscribers.length === 0
    ) {
      return 0;
    }

    subscribers.forEach(
      (subscriber) => subscriber(message),
    );

    return subscribers.length;
  }

  /**
   * Retorna a quantidade de inscritos no tópico.
   */
  subscriberCount(
    topic: string,
  ): number {
    return this.topics[topic]?.length ?? 0;
  }
}

export default PubSub;