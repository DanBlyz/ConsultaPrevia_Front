import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { ReunionFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroReunion(state: AppState): ReunionFilter {
  return state.correspondencia.listaReunion?.filtro;
}

function seleccionarPaginadoReunion(state: AppState): Paginado {
  return state.correspondencia.listaReunion?.paginado;
}

export const filtroReunionSelector = createSelector(
  obtenerState,
  seleccionarFiltroReunion
);
export const paginadoReunionSelector = createSelector(
  obtenerState,
  seleccionarPaginadoReunion
);
