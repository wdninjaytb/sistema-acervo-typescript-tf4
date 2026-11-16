import { RegraNegocioError } from "../errors/RegraNegocioError";
import { Reservavel } from "../interfaces/Reservavel";
import { ItemAcervo } from "./ItemAcervo";

export class Livro extends ItemAcervo implements Reservavel {
  private _reservadoPara: string | null = null;

  constructor(titulo: string, ano: number, private _autor: string) {
    super(titulo, ano);
    if (!_autor.trim()) throw new RegraNegocioError("O autor é obrigatório.");
  }

  override get tipo(): string { return "Livro"; }
  get autor(): string { return this._autor; }
  get reservadoPara(): string | null { return this._reservadoPara; }

  reservar(nomePessoa: string): void {
    if (!nomePessoa.trim()) throw new RegraNegocioError("Informe o nome da pessoa.");
    if (this._reservadoPara !== null) throw new RegraNegocioError("Livro já está reservado.");
    this._reservadoPara = nomePessoa.trim();
  }

  cancelarReserva(): void {
    if (this._reservadoPara === null) throw new RegraNegocioError("Este livro não tem reserva.");
    this._reservadoPara = null;
  }

  override emprestar(nomePessoa: string): void {
    if (this._reservadoPara !== null && this._reservadoPara.toLowerCase() !== nomePessoa.trim().toLowerCase()) {
      throw new RegraNegocioError(`Livro reservado para ${this._reservadoPara}.`);
    }
    super.emprestar(nomePessoa);
    this._reservadoPara = null;
  }

  override calcularMulta(diasAtraso: number): number {
    if (!Number.isFinite(diasAtraso)) throw new RegraNegocioError("Dias de atraso inválidos.");
    return Math.max(0, Math.ceil(diasAtraso)) * 2;
  }
}
