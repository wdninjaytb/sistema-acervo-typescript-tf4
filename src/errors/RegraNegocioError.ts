export class RegraNegocioError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "RegraNegocioError";
  }
}
