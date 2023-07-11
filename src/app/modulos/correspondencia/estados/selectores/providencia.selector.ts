import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { ProvidenciaFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroProvidencia(state: AppState): ProvidenciaFilter {
  return state.correspondencia.listaProvidencia?.filtro;
}

function seleccionarPaginadoProvidencia(state: AppState): Paginado {
  return state.correspondencia.listaProvidencia?.paginado;
}

export const filtroProvidenciaSelector = createSelector(
  obtenerState,
  seleccionarFiltroProvidencia
);
export const paginadoProvidenciaSelector = createSelector(
  obtenerState,
  seleccionarPaginadoProvidencia
);
