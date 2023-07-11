import { RespuestaBase } from '.';

export class RespuestaObjeto<T> extends RespuestaBase {
  objeto?: T;
  constructor() {
    super();
  }
}
