import { RegraNegocioError } from "../errors/RegraNegocioError";

export class RepositorioMemoria<T extends { readonly id: number }> {
  private readonly itens: T[] = [];

  adicionar(item: T): void {
    if (this.buscarPorId(item.id)) throw new RegraNegocioError(`ID ${item.id} já cadastrado.`);
    this.itens.push(item);
  }

  listar(): readonly T[] {
    return [...this.itens];
  }

  buscarPorId(id: number): T | undefined {
    return this.itens.find(item => item.id === id);
  }

  remover(id: number): void {
    const indice = this.itens.findIndex(item => item.id === id);
    if (indice < 0) throw new RegraNegocioError(`ID ${id} não encontrado.`);
    this.itens.splice(indice, 1);
  }
}
