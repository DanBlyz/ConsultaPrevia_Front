export class Paginado {
  totalRegistros: number;
  registrosPorPagina: number;
  totalPaginas: number;
  pagina: number;

  constructor(
    totalRegistros: number,
    registrosPorPagina: number,
    totalPaginas: number,
    pagina: number
  ) {
    this.totalRegistros = totalRegistros;
    this.registrosPorPagina = registrosPorPagina;
    this.totalPaginas = totalPaginas;
    this.pagina = pagina;
  }
}
