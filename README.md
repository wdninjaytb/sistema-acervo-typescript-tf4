# Sistema de Acervo — Orientação a Objetos em TypeScript

Aplicação de console para cadastrar, listar, emprestar, devolver e reservar itens de um acervo, além de calcular multas e gerenciar registros em memória.

## Como executar

Requisitos: Node.js 20+ e npm.

```bash
npm install
npm run dev
```

Ou compilando o TypeScript:

```bash
npm run build
npm start
```

Para verificar os tipos sem gerar arquivos:

```bash
npm run check
```

> O diretório `dist/` é gerado por `npm run build`. O arquivo `.gitkeep` mantém a pasta presente no GitHub.

## Conceitos da disciplina

| Aula | Conceito | Onde foi aplicado |
|---|---|---|
| 1 | `src/`, `dist/`, `strict: true`, `tsc` e `ts-node` | `tsconfig.json`, `package.json` |
| 2 | Classes, construtores, parameter properties e arrays | `Livro`, `JogoEletronico`, `RepositorioMemoria` |
| 3 | Encapsulamento, `private`, `readonly` e métodos validados | `ItemAcervo` |
| 4 | `get` calculado e contador `private static` | `ItemAcervo` |
| 5 | Classe abstrata, herança, `super`, `override`, polimorfismo | `ItemAcervo`, `Livro`, `JogoEletronico` |
| 6 | Interface `Reservavel`, `implements` | `Reservavel.ts`, `Livro.ts` |
| 7 | Generic `RepositorioMemoria<T>`, `Pick`, `Readonly`, `Partial`, exceções | `RepositorioMemoria.ts`, `index.ts`, `RegraNegocioError.ts` |

## Regras

- IDs são autoincrementais e somente leitura.
- Livros: multa de R$ 2,00 por dia de atraso; jogos: R$ 5,00 por dia.
- Livros podem ser reservados. Uma reserva impede o empréstimo a outra pessoa.
- Não se pode emprestar um item já emprestado nem devolver um item disponível.
- Tudo permanece na memória enquanto o programa está aberto (não há banco de dados).

## Estrutura

```text
src/
├── errors/RegraNegocioError.ts
├── interfaces/Reservavel.ts
├── models/ItemAcervo.ts
├── models/Livro.ts
├── models/JogoEletronico.ts
├── repositories/RepositorioMemoria.ts
└── index.ts
dist/ (gerada na compilação)
```
