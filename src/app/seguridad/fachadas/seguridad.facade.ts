import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

import { Respuesta } from '../../comun/modelos';
import { ComunState } from '../../comun/estados';
import * as ComunAcciones from '../../comun/estados';

import { AppState } from '../../app.state';
import { UsuarioAutenticado, Registro } from '../modelos';
import { AutenticacionState } from '../estados';
import * as AutenticacionAcciones from '../estados';
import { AlmacenamientoService, AutenticacionService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class SeguridadFacade {
  procesando: boolean;

  token: string;
  tokenExpiracion: any;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get AutenticacionState$(): Observable<AutenticacionState> {
    return this.store.select('autenticacion');
  }

  constructor(
    private store: Store<AppState>,
    private autenticacionService: AutenticacionService,
    private almacenamientoService: AlmacenamientoService,
    private toastr: ToastrService
  ) {
    this.store.select('autenticacion').subscribe(({ usuario }) => {
      if (usuario != null) {
        this.token = usuario.token;
        this.tokenExpiracion = usuario.tokenExpiracion;
      } else {
        this.token = null;
        this.tokenExpiracion = null;
      }
    });
  }

  iniciarSesion(cuenta: string, contrasenia: string): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.autenticacionService.obtenerToken(cuenta, contrasenia).subscribe(
      (respuesta: any) => {
        if (respuesta.access_token) {
          const jwtHelper = new JwtHelperService();
          const jwt = jwtHelper.decodeToken(respuesta.access_token);
          this.autenticacionService
            .obtenerInfoUsuario(jwt.user_id, respuesta.access_token)
            .subscribe(
              (usuario: any) => {
                let usuarioAutenticado = new UsuarioAutenticado();
                if (!usuario || !usuario.objeto) {
                  usuarioAutenticado = {
                    codCuenta: jwt.user_id,
                    cuenta: jwt.nickname,
                    nombre: jwt.given_name,
                    apellido: jwt.family_name,
                    nomPublico: jwt.name,
                    numDocumento: jwt.personal_id,
                    fotografia: jwt.picture,
                    correoElectronico: jwt.email,
                    token: respuesta.access_token,
                    tokenExpiracion: jwt.exp,
                    modoAutenticacion: 'BD'
                  };
                } else {
                  usuarioAutenticado = {
                    codCuenta: usuario.objeto.codCuenta,
                    cuenta: cuenta,
                    nombre: usuario.objeto.nombre,
                    apellido: usuario.objeto.apellido,
                    nomPublico: usuario.objeto.nomPublico,
                    numDocumento: usuario.objeto.numDocumento,
                    correoElectronico: usuario.objeto.correoElectronico,
                    fotografia: null,
                    token: respuesta.access_token,
                    tokenExpiracion: jwt.exp,
                    modoAutenticacion: 'BD'
                  };
                }
                this.almacenamientoService.guardarUsuario(usuarioAutenticado);
                this.store.dispatch(
                  AutenticacionAcciones.iniciarSesion({
                    usuario: usuarioAutenticado
                  })
                );
                this.store.dispatch(ComunAcciones.limpiarNotificacion());
                this.store.dispatch(ComunAcciones.limpiarRespuesta());
                this.store.dispatch(
                  ComunAcciones.establecerProcesando({ procesando: false })
                );
              },
              () => {
                this.store.dispatch(
                  ComunAcciones.establecerProcesando({ procesando: false })
                );
              }
            );
        } else {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          this.toastr.error('Acceso no autorizado.', 'Inicio de sesión');
        }
      },
      () => {
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
        this.toastr.error(
          'Se ha producido un error al iniciar sesión, vuelva a intentar más tardes.',
          'Inicio de sesión'
        );
      }
    );
  }

  registrarse(objeto: Registro): Promise<boolean> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve, reject) => {
      this.autenticacionService.crearCuenta(objeto).subscribe(
        (respuesta: Respuesta) => {
          if (respuesta) {
            this.store.dispatch(
              ComunAcciones.establecerProcesando({ procesando: false })
            );
            if (respuesta.tipoRespuesta === 'Exito') {
              this.toastr.success(
                'La cuenta se ha creado satisfactoriamente.',
                'Creación de cuentas'
              );
              resolve(true);
            } else {
              this.toastr.error(respuesta.mensaje, 'Creación de cuentas');
              resolve(false);
            }
          } else {
            this.store.dispatch(
              ComunAcciones.establecerProcesando({ procesando: false })
            );
            this.toastr.error(
              'Se ha producido un error al crear la cuenta, intente nuevamente por favor.',
              'Creación de cuentas'
            );
            resolve(false);
          }
        },
        () => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          this.toastr.error(
            'Se ha producido un error inesperado, vuelva a intentarlo más tarde por favor.',
            'Creación de cuentas'
          );
          reject(false);
        }
      );
    });
  }

  actualizar(usuarioId: string, objeto: UsuarioAutenticado): Promise<boolean> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve, reject) => {
      this.autenticacionService.actualizarCuenta(usuarioId, objeto).subscribe(
        (respuesta: Respuesta) => {
          if (respuesta) {
            this.store.dispatch(
              ComunAcciones.establecerProcesando({ procesando: false })
            );
            if (respuesta.tipoRespuesta === 'Exito') {
              const usuarioAutenticado = {
                nombre: objeto.nombre,
                apellido: objeto.apellido,
                nomPublico: objeto.nomPublico,
                correoElectronico: objeto.correoElectronico,
                fotografia: null
              } as UsuarioAutenticado;
              this.almacenamientoService.guardarUsuario(usuarioAutenticado);
              this.store.dispatch(
                AutenticacionAcciones.actualizarSesion({
                  usuario: usuarioAutenticado
                })
              );
              this.toastr.success(
                'La cuenta se ha modificado satisfactoriamente.',
                'Perfil'
              );
              resolve(true);
            } else {
              this.toastr.error(respuesta.mensaje, 'Perfil');
              resolve(false);
            }
          } else {
            this.store.dispatch(
              ComunAcciones.establecerProcesando({ procesando: false })
            );
            this.toastr.error(
              'Se ha producido un error al modificar la cuenta, intente nuevamente por favor.',
              'Perfil'
            );
            resolve(false);
          }
        },
        () => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          this.toastr.error(
            'Se ha producido un error inesperado, vuelva a intentarlo más tarde por favor.',
            'Perfil'
          );
          reject(false);
        }
      );
    });
  }

  cambiarContrasenia(
    usuarioId: string,
    contrasenia: string,
    nuevaContrasenia: string
  ): Promise<boolean> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve, reject) => {
      this.autenticacionService
        .cambiarContrasenia(usuarioId, contrasenia, nuevaContrasenia)
        .subscribe(
          (respuesta: Respuesta) => {
            if (respuesta) {
              this.store.dispatch(
                ComunAcciones.establecerProcesando({ procesando: false })
              );
              if (respuesta.tipoRespuesta === 'Exito') {
                this.toastr.success(
                  'La contraseña se ha modificado satisfactoriamente.',
                  'Seguridad'
                );
                resolve(true);
              } else {
                this.toastr.error(respuesta.mensaje, 'Seguridad');
                resolve(false);
              }
            } else {
              this.store.dispatch(
                ComunAcciones.establecerProcesando({ procesando: false })
              );
              this.toastr.error(
                'Se ha producido un error al cambiar la contraseña, intente nuevamente por favor.',
                'Seguridad'
              );
              resolve(false);
            }
          },
          () => {
            this.store.dispatch(
              ComunAcciones.establecerProcesando({ procesando: false })
            );
            this.toastr.error(
              'Se ha producido un error inesperado, vuelva a intentarlo más tarde por favor.',
              'Seguridad'
            );
            reject(false);
          }
        );
    });
  }

  cerrarSesion(): Promise<void> {
    this.almacenamientoService.eliminarUsuario();
    this.store.dispatch(AutenticacionAcciones.cerrarSesion());
    return new Promise((resolve) => {
      resolve();
    });
  }

  tokenExpirado(): boolean {
    if (!this.token) {
      return true;
    }
    const jwtHelper = new JwtHelperService();
    return jwtHelper.isTokenExpired(this.token);
  }

  obtenerRoles(): any[] {
    if (!this.token) {
      return [];
    }
    const jwtHelper = new JwtHelperService();
    const jwt: any = jwtHelper.decodeToken(this.token);
    const roles = jwt.roles instanceof Array ? jwt.roles : [jwt.roles];
    return roles;
  }

  contieneRoles(roles: Array<string>): boolean {
    let respuesta = false;
    const rolesToken = this.obtenerRoles();
    roles.forEach((rol) => {
      if (rolesToken.find((rolToken) => rolToken === rol)) {
        respuesta = respuesta || true;
      }
    });
    return respuesta;
  }

  iniciarSesionLdap(cuenta: string, contrasenia: string): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.autenticacionService.obtenerLdapToken(cuenta, contrasenia).subscribe(
      (respuesta: any) => {
        if (respuesta.access_token) {
          const jwtHelper = new JwtHelperService();
          const jwt = jwtHelper.decodeToken(respuesta.access_token);
          this.autenticacionService
            .obtenerInfoUsuario(jwt.user_id, respuesta.access_token)
            .subscribe(
              (usuario: any) => {
                let usuarioAutenticado = new UsuarioAutenticado();
                if (!usuario.objeto) {
                  usuarioAutenticado = {
                    codCuenta: jwt.codCuenta.user_id,
                    cuenta: jwt.nickname,
                    nombre: jwt.given_name,
                    apellido: jwt.family_name,
                    nomPublico: jwt.name,
                    numDocumento: jwt.personal_id,
                    fotografia: jwt.picture,
                    correoElectronico: jwt.email,
                    token: respuesta.access_token,
                    tokenExpiracion: jwt.exp,
                    modoAutenticacion: 'LDAP'
                  };
                } else {
                  usuarioAutenticado = {
                    codCuenta: usuario.objeto.codCuenta,
                    cuenta: cuenta,
                    nombre: usuario?.objeto.nombre,
                    apellido: usuario?.objeto.apellido,
                    nomPublico: usuario?.objeto.nomPublico,
                    numDocumento: usuario?.objeto.numDocumento,
                    correoElectronico: usuario.objeto?.correoElectronico,
                    fotografia: null,
                    token: respuesta.access_token,
                    tokenExpiracion: jwt.exp,
                    modoAutenticacion: 'LDAP'
                  };
                }
                this.almacenamientoService.guardarUsuario(usuarioAutenticado);
                this.store.dispatch(
                  AutenticacionAcciones.iniciarSesion({
                    usuario: usuarioAutenticado
                  })
                );
                this.store.dispatch(ComunAcciones.limpiarNotificacion());
                this.store.dispatch(ComunAcciones.limpiarRespuesta());
                this.store.dispatch(
                  ComunAcciones.establecerProcesando({ procesando: false })
                );
              },
              () => {
                this.store.dispatch(
                  ComunAcciones.establecerProcesando({ procesando: false })
                );
              }
            );
        } else {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          this.toastr.error('Acceso no autorizado.', 'Inicio de sesión');
        }
      },
      () => {
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
        this.toastr.error(
          'Se ha producido un error al iniciar sesión, vuelva a intentar más tardes.',
          'Inicio de sesión'
        );
      }
    );
  }
}
