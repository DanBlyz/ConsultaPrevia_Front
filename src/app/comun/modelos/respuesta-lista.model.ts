import { Paginado, RespuestaBase } from '.';

export class RespuestaLista<T> extends RespuestaBase {
  lista?: T[];
  paginado?: Paginado;
  constructor() {
    super();
  }
}
