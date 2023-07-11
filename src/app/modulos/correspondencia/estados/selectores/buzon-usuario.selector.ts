import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarPaginadoBuzonUsuario(state: AppState): Paginado {
  return state.correspondencia.listaBuzonUsuario?.paginado;
}

export const paginadoBuzonUsuarioSelector = createSelector(
  obtenerState,
  seleccionarPaginadoBuzonUsuario
);
