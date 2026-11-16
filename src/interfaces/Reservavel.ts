export interface Reservavel {
  reservar(nomePessoa: string): void;
  cancelarReserva(): void;
  get reservadoPara(): string | null;
}
