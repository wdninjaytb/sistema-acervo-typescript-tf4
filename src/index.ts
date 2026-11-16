import { createInterface } from "node:readline/promises";
import { stdin as entrada, stdout as saida } from "node:process";
import { RegraNegocioError } from "./errors/RegraNegocioError";
import { ItemAcervo } from "./models/ItemAcervo";
import { JogoEletronico } from "./models/JogoEletronico";
import { Livro } from "./models/Livro";
import { RepositorioMemoria } from "./repositories/RepositorioMemoria";

const terminal = createInterface({ input: entrada, output: saida });
const acervo = new RepositorioMemoria<ItemAcervo>();

// Utility Type: resumo somente de leitura com parte das informações de um item.
type ResumoItem = Readonly<Pick<ItemAcervo, "id" | "titulo" | "tipo" | "statusDisponibilidade">>;
// Utility Type: alteração parcial, limitada ao título.
type EdicaoItem = Partial<Pick<ItemAcervo, "titulo">>;

function obterObrigatorio(item: ItemAcervo | undefined): ItemAcervo {
  if (!item) throw new RegraNegocioError("Item não encontrado.");
  return item;
}

async function perguntar(mensagem: string): Promise<string> {
  return (await terminal.question(mensagem)).trim();
}

async function perguntarNumero(mensagem: string): Promise<number> {
  const texto = await perguntar(mensagem);
  if (!texto || !/^\d+$/.test(texto)) throw new RegraNegocioError("Informe um número inteiro não negativo.");
  return Number(texto);
}

function mostrarItem(item: ItemAcervo): void {
  const resumo: ResumoItem = item;
  const detalhe = item instanceof Livro
    ? ` | Autor: ${item.autor} | Reserva: ${item.reservadoPara ?? "nenhuma"}`
    : item instanceof JogoEletronico ? ` | Plataforma: ${item.plataforma}` : "";
  console.log(`#${resumo.id} | ${resumo.tipo} | ${resumo.titulo} (${item.ano}) | ${resumo.statusDisponibilidade}${detalhe}`);
}

async function executar(opcao: string): Promise<boolean> {
  switch (opcao) {
    case "1": {
      const titulo = await perguntar("Título do livro: ");
      const ano = await perguntarNumero("Ano: ");
      const autor = await perguntar("Autor: ");
      const livro = new Livro(titulo, ano, autor);
      acervo.adicionar(livro);
      console.log(`Livro cadastrado com ID ${livro.id}.`);
      return true;
    }
    case "2": {
      const titulo = await perguntar("Título do jogo: ");
      const ano = await perguntarNumero("Ano: ");
      const plataforma = await perguntar("Plataforma: ");
      const jogo = new JogoEletronico(titulo, ano, plataforma);
      acervo.adicionar(jogo);
      console.log(`Jogo cadastrado com ID ${jogo.id}.`);
      return true;
    }
    case "3": {
      const itens = acervo.listar();
      if (itens.length === 0) console.log("Acervo vazio.");
      else itens.forEach(mostrarItem);
      return true;
    }
    case "4": {
      const id = await perguntarNumero("ID do item: ");
      const pessoa = await perguntar("Emprestar para: ");
      obterObrigatorio(acervo.buscarPorId(id)).emprestar(pessoa);
      console.log("Empréstimo realizado.");
      return true;
    }
    case "5": {
      const id = await perguntarNumero("ID do item: ");
      obterObrigatorio(acervo.buscarPorId(id)).devolver();
      console.log("Devolução realizada.");
      return true;
    }
    case "6": {
      const id = await perguntarNumero("ID do livro: ");
      const item = obterObrigatorio(acervo.buscarPorId(id));
      if (!(item instanceof Livro)) throw new RegraNegocioError("Somente livros podem ser reservados.");
      item.reservar(await perguntar("Reservar para: "));
      console.log("Reserva realizada.");
      return true;
    }
    case "7": {
      const id = await perguntarNumero("ID do livro: ");
      const item = obterObrigatorio(acervo.buscarPorId(id));
      if (!(item instanceof Livro)) throw new RegraNegocioError("Somente livros têm reservas.");
      item.cancelarReserva();
      console.log("Reserva cancelada.");
      return true;
    }
    case "8": {
      const id = await perguntarNumero("ID do item: ");
      const dias = await perguntarNumero("Dias de atraso: ");
      const item = obterObrigatorio(acervo.buscarPorId(id));
      console.log(`Multa: R$ ${item.calcularMulta(dias).toFixed(2)}`);
      return true;
    }
    case "9": {
      const id = await perguntarNumero("ID do item: ");
      const mudanca: EdicaoItem = { titulo: await perguntar("Novo título: ") };
      const item = obterObrigatorio(acervo.buscarPorId(id));
      if (mudanca.titulo !== undefined) item.atualizarTitulo(mudanca.titulo);
      console.log("Título atualizado.");
      return true;
    }
    case "10": {
      const id = await perguntarNumero("ID do item: ");
      const item = obterObrigatorio(acervo.buscarPorId(id));
      if (!item.disponivel) throw new RegraNegocioError("Devolva o item antes de removê-lo.");
      acervo.remover(id);
      console.log("Item removido.");
      return true;
    }
    case "0": return false;
    default:
      console.log("Opção inválida.");
      return true;
  }
}

async function main(): Promise<void> {
  console.log("=== Sistema de Acervo ===");
  let continuar = true;
  while (continuar) {
    console.log("\n1. Cadastrar livro | 2. Cadastrar jogo | 3. Listar acervo");
    console.log("4. Emprestar | 5. Devolver | 6. Reservar livro | 7. Cancelar reserva");
    console.log("8. Calcular multa | 9. Editar título | 10. Remover item | 0. Sair");
    try {
      continuar = await executar(await perguntar("Escolha: "));
    } catch (erro: unknown) {
      if (erro instanceof RegraNegocioError) console.log(`Atenção: ${erro.message}`);
      else if (erro instanceof Error) console.log(`Erro inesperado: ${erro.message}`);
      else console.log("Erro desconhecido.");
    }
  }
  terminal.close();
  console.log("Até logo!");
}

main().catch((erro: unknown) => {
  console.error("Não foi possível iniciar a aplicação:", erro);
  terminal.close();
  process.exitCode = 1;
});
