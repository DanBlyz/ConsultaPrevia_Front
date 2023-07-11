import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

import { EnvironmentHelper } from 'src/app/comun/auxiliares/environment.helper';

import { environment } from '../../../environments/environment';
import { Registro, UsuarioAutenticado } from '../modelos';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private env = EnvironmentHelper.obtenerConfiguracion('autenticacion');
  private urlApiBase = this.env['api']['url'];
  private grupos = this.env['api']['grupos'];
  private apiKey = this.env['api']['apiKey'];

  constructor(private http: HttpClient) {}

  crearCuenta(objeto: Registro): any {
    const url = `${this.urlApiBase}/autenticacion/usuarios`;
    const body = JSON.stringify(objeto);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Api-Key ' + this.apiKey
    });
    return this.http.post(url, body, { headers });
  }

  actualizarCuenta(usuarioId: string, objeto: UsuarioAutenticado): any {
    const url = `${this.urlApiBase}/autenticacion/usuarios/${usuarioId}`;
    const body = JSON.stringify(objeto);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Api-Key ' + this.apiKey
    });
    return this.http.patch(url, body, { headers });
  }

  cambiarContrasenia(
    usuarioId: string,
    contrasenia: string,
    nuevaContrasenia: string
  ): any {
    const url = `${this.urlApiBase}/autenticacion/usuarios/${usuarioId}/cambiar-contrasenia`;
    const body = JSON.stringify({
      contrasenia,
      nuevaContrasenia
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Api-Key ' + this.apiKey
    });
    return this.http.patch(url, body, { headers });
  }

  obtenerToken(usuario: string, contrasenia: string): any {
    if (environment['modoAislado'] && environment['modoAislado'] === true) {
      if (usuario === 'adsib' && contrasenia === 'adsib') {
        // TODO: Modo aislado "obtenerToken"
        return of({
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjpbIk1PRE8tQUlTTEFETyJdLCJpYXQiOjE2NDcyNzQyNzgsImV4cCI6MjY0NzI3NDI3OCwiYXVkIjoiKiIsImlzcyI6ImFkc2liLmdvYi5ibyIsInN1YiI6IkFnZW5jaWEgcGFyYSBlbCBEZXNhcnJvbGxvIGRlIGxhIFNvY2llZGFkIGRlIGxhIEluZm9ybWFjacOzbiBlbiBCb2xpdmlhIC0gQURTSUIifQ.EF6s6OVQ1G0ARod9yHw7mUCHYOG9XNOqOt1qyWbmeZU'
        });
      } else {
        return of({
          access_token: null
        });
      }
    } else {
      const url = `${this.urlApiBase}/autenticacion/token`;
      const body = JSON.stringify({
        cuenta: usuario,
        contrasenia: contrasenia,
        grupos: this.grupos,
        ip: '127.0.0.1'
      });
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post(url, body, { headers });
    }
  }

  obtenerInfoUsuario(usuarioId: string, token: string): any {
    if (environment['modoAislado'] && environment['modoAislado'] === true) {
      // TODO: Modo aislado "obtenerInfoUsuario"
      return of({
        id: usuarioId,
        objeto: {
          nombre: 'Juan',
          apellido: 'Perez',
          correoElectronico: 'jperez@ciudadanocomun.bo'
        }
      });
    } else {
      const url = `${this.urlApiBase}/autenticacion/usuarios/${usuarioId}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      });
      return this.http.get(url, { headers });
    }
  }

  obtenerLdapToken(usuario: string, contrasenia: string): any {
    if (environment['modoAislado'] && environment['modoAislado'] === true) {
      // TODO: Modo aislado "obtenerLdapToken"
      return of({
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjpbIk1PRE8tQUlTTEFETyJdLCJpYXQiOjE2NDcyNzQyNzgsImV4cCI6MjY0NzI3NDI3OCwiYXVkIjoiKiIsImlzcyI6ImFkc2liLmdvYi5ibyIsInN1YiI6IkFnZW5jaWEgcGFyYSBlbCBEZXNhcnJvbGxvIGRlIGxhIFNvY2llZGFkIGRlIGxhIEluZm9ybWFjacOzbiBlbiBCb2xpdmlhIC0gQURTSUIifQ.EF6s6OVQ1G0ARod9yHw7mUCHYOG9XNOqOt1qyWbmeZU'
      });
    } else {
      const url = `${this.urlApiBase}/autenticacion/ldap/token`;
      const body = JSON.stringify({
        cuenta: usuario,
        contrasenia: contrasenia,
        grupos: this.grupos,
        ip: '127.0.0.1'
      });
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.http.post(url, body, { headers });
    }
  }
}
