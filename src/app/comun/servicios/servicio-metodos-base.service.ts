import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app/app.state';
import { ServicioBaseService } from '.';

export class ServicioMetodosBaseService extends ServicioBaseService {
  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
  }

  buscar(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/buscar`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  obtenerPorId(id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}`;
    return this.http.get(url, { headers: this.headers });
  }

  guardar(objeto: any): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}`;
    const body = JSON.stringify(objeto);
    return this.http.post(url, body, { headers: this.headers });
  }

  modificar(id: number, objeto: any): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}`;
    const body = JSON.stringify(objeto);
    return this.http.patch(url, body, { headers: this.headers });
  }

  eliminar(id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }
}
