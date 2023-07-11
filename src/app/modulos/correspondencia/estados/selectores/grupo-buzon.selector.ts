import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarPaginadoGrupoBuzon(state: AppState): Paginado {
  return state.correspondencia.listaGrupoBuzon?.paginado;
}

export const paginadoGrupoBuzonSelector = createSelector(
  obtenerState,
  seleccionarPaginadoGrupoBuzon
);
