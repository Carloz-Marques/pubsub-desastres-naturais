# Pub/Sub — Alertas de Desastres Naturais

Projeto simples em TypeScript que demonstra Publish/Subscribe em um sistema de
alertas de desastres naturais em Goiânia.

## Organização

```text
src/
├── PubSub.ts                # subscribe, unsubscribe e publish
├── DisasterSimulation.ts    # domínio e simulação dos desastres
└── index.ts                 # inicia o programa
```

## Como executar

```bash
npm install
npm run dev
```

## Como funciona

1. `PubSub` guarda uma lista de subscribers para cada tópico.
2. Aplicativo, sirene e bombeiros fazem `subscribe`.
3. A função `reportarDesastre` representa o publisher.
4. Ela chama `publish`, que notifica os interessados naquele tópico.
5. Após `unsubscribe`, o subscriber deixa de receber novos alertas.

```text
Sensor (Publisher) → Broker → Tópico → Subscribers
```

## Exemplos incluídos

- alagamento no Setor Central de Goiânia;
- tempestade na Região Sul de Goiânia;
- aplicativo, sirene e bombeiros como subscribers;
- cancelamento da inscrição da sirene.

## Onde alterar

- Novo desastre, região ou subscriber: `src/DisasterSimulation.ts`.
- Funcionamento do Pub/Sub: `src/PubSub.ts`.
- Inicialização: `src/index.ts`.

## Integrantes

- Nome do aluno: Carlos Henrique Marques
- Nome do aluno Gabriela Pacheco Demola
- Nome do aluno Julia Pachecoo Demola
