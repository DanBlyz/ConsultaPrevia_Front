import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { PagoCptFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroPagoCpt(state: AppState): PagoCptFilter {
  return state.correspondencia.listaPagoCpt?.filtro;
}

function seleccionarPaginadoPagoCpt(state: AppState): Paginado {
  return state.correspondencia.listaPagoCpt?.paginado;
}

export const filtroPagoCptSelector = createSelector(
  obtenerState,
  seleccionarFiltroPagoCpt
);
export const paginadoPagoCptSelector = createSelector(
  obtenerState,
  seleccionarPaginadoPagoCpt
);
