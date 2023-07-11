import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { BuzonFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroBuzon(state: AppState): BuzonFilter {
  return state.correspondencia.listaBuzon?.filtro;
}

function seleccionarPaginadoBuzon(state: AppState): Paginado {
  return state.correspondencia.listaBuzon?.paginado;
}

export const filtroBuzonSelector = createSelector(
  obtenerState,
  seleccionarFiltroBuzon
);
export const paginadoBuzonSelector = createSelector(
  obtenerState,
  seleccionarPaginadoBuzon
);
