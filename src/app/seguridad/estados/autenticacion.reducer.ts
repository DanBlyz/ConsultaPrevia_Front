import { Action, createReducer, on } from '@ngrx/store';

import { environment } from '../../../environments/environment';

import { AutenticacionState } from '.';
import * as AutenticacionAcciones from '../estados';

export const autenticacionFeatureKey = 'autenticacion';
const aplicacion = environment.aplicacion;

export const autenticacionInicial: AutenticacionState = {
  usuario: JSON.parse(sessionStorage.getItem(aplicacion + ':usuario'))
};

const autenticacionReducer = createReducer(
  autenticacionInicial,
  on(AutenticacionAcciones.iniciarSesion, (state, { usuario }) => {
    return {
      ...state,
      usuario: { ...usuario }
    };
  }),
  on(AutenticacionAcciones.actualizarSesion, (state, { usuario }) => {
    return {
      ...state,
      usuario: {
        ...state.usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        nomPublico: usuario.nomPublico,
        correoElectronico: usuario.correoElectronico,
        fotografia: usuario.fotografia
      }
    };
  }),
  on(AutenticacionAcciones.cerrarSesion, (state, {}) => {
    return {
      ...state,
      usuario: null
    };
  })
);

export function reducer(
  state: AutenticacionState | undefined,
  action: Action
): any {
  return autenticacionReducer(state, action);
}
