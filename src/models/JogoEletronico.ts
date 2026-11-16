import { RegraNegocioError } from "../errors/RegraNegocioError";
import { ItemAcervo } from "./ItemAcervo";

export class JogoEletronico extends ItemAcervo {
  constructor(titulo: string, ano: number, private _plataforma: string) {
    super(titulo, ano);
    if (!_plataforma.trim()) throw new RegraNegocioError("A plataforma é obrigatória.");
  }

  override get tipo(): string { return "Jogo eletrônico"; }
  get plataforma(): string { return this._plataforma; }

  override calcularMulta(diasAtraso: number): number {
    if (!Number.isFinite(diasAtraso)) throw new RegraNegocioError("Dias de atraso inválidos.");
    return Math.max(0, Math.ceil(diasAtraso)) * 5;
  }
}
