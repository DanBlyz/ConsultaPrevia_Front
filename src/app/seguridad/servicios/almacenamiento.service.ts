import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

import { UsuarioAutenticado } from '../modelos';

@Injectable({
  providedIn: 'root'
})
export class AlmacenamientoService {
  aplicacion = environment.aplicacion;

  constructor() {
    //
  }

  guardarUsuario(usuario: UsuarioAutenticado) {
    sessionStorage.setItem(
      this.aplicacion + ':usuario',
      JSON.stringify(usuario)
    );
  }

  obtenerUsuario(): UsuarioAutenticado {
    return JSON.parse(sessionStorage.getItem(this.aplicacion + ':usuario'));
  }

  eliminarUsuario() {
    sessionStorage.removeItem(this.aplicacion + ':usuario');
  }
}
