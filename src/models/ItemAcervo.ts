import { RegraNegocioError } from "../errors/RegraNegocioError";

export abstract class ItemAcervo {
  private static _contadorId = 0;
  public readonly id: number;
  private emprestadoPara: string | null = null;
  private dataEmprestimo: Date | null = null;

  protected constructor(
    private _titulo: string,
    private _ano: number
  ) {
    if (!_titulo.trim()) throw new RegraNegocioError("O título não pode ser vazio.");
    if (!Number.isInteger(_ano) || _ano < 0) {
      throw new RegraNegocioError("O ano deve ser um inteiro não negativo.");
    }
    this.id = ++ItemAcervo._contadorId;
  }

  get titulo(): string { return this._titulo; }
  get ano(): number { return this._ano; }
  get statusDisponibilidade(): string {
    return this.emprestadoPara === null ? "Disponível" : `Emprestado para ${this.emprestadoPara}`;
  }
  get disponivel(): boolean { return this.emprestadoPara === null; }
  get diasEmprestado(): number {
    if (this.dataEmprestimo === null) return 0;
    const milissegundos = Date.now() - this.dataEmprestimo.getTime();
    return Math.max(0, Math.floor(milissegundos / 86_400_000));
  }

  atualizarTitulo(novoTitulo: string): void {
    if (!novoTitulo.trim()) throw new RegraNegocioError("O título não pode ser vazio.");
    this._titulo = novoTitulo.trim();
  }

  emprestar(nomePessoa: string): void {
    if (!nomePessoa.trim()) throw new RegraNegocioError("Informe o nome da pessoa.");
    if (!this.disponivel) throw new RegraNegocioError("Item já está emprestado.");
    this.emprestadoPara = nomePessoa.trim();
    this.dataEmprestimo = new Date();
  }

  devolver(): void {
    if (this.disponivel) throw new RegraNegocioError("Este item não está emprestado.");
    this.emprestadoPara = null;
    this.dataEmprestimo = null;
  }

  abstract calcularMulta(diasAtraso: number): number;
  abstract get tipo(): string;
}
