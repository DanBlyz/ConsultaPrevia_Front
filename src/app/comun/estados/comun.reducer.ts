import { Action, createReducer, on } from '@ngrx/store';

import { ComunState } from '.';
import * as ComunAcciones from '.';

export const comunFeatureKey = 'comun';

export const comunInicial: ComunState = {
  procesando: false,
  titulo: null,
  mensaje: null,
  respuesta: null,
  notificacion: null
};

const comunReducer = createReducer(
  comunInicial,
  on(ComunAcciones.establecerProcesando, (state, { procesando }) => {
    return {
      ...state,
      procesando
    };
  }),
  on(ComunAcciones.establecerMensaje, (state, { titulo, mensaje }) => {
    return {
      ...state,
      titulo,
      mensaje
    };
  }),
  on(ComunAcciones.limpiarMensaje, (state, {}) => {
    return {
      ...state,
      titulo: null,
      mensaje: null
    };
  }),
  on(ComunAcciones.establecerRespuesta, (state, { respuesta }) => {
    return {
      ...state,
      respuesta: { ...respuesta }
    };
  }),
  on(ComunAcciones.limpiarRespuesta, (state, {}) => {
    return {
      ...state,
      respuesta: null
    };
  }),
  on(ComunAcciones.establecerNotificacion, (state, { respuesta }) => {
    return {
      ...state,
      notificacion: { ...respuesta }
    };
  }),
  on(ComunAcciones.limpiarNotificacion, (state, {}) => {
    return {
      ...state,
      notificacion: null
    };
  })
);

export function reducer(state: ComunState | undefined, action: Action): any {
  return comunReducer(state, action);
}
