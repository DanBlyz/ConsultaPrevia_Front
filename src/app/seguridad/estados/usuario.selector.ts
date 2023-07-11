import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';

import { UsuarioAutenticado } from '../modelos/';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarUsuarioAutenticado(state: AppState): UsuarioAutenticado {
  return state.autenticacion.usuario;
}

export const usuarioAutenticadoSelector = createSelector(
  obtenerState,
  seleccionarUsuarioAutenticado
);
