import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/app.state';

export class ServicioBaseService {
  protected token: string;
  protected headers: HttpHeaders;

  protected urlApiBase = '';
  protected controlador = '';

  constructor(protected http: HttpClient, protected store: Store<AppState>) {
    this.token = null;
    this.store.select('autenticacion').subscribe(({ usuario }) => {
      if (usuario) {
        this.token = usuario.token;
        this.headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
        });
      }
    });
  }
}
