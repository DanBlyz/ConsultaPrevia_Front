import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { TramiteFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroTramite(state: AppState): TramiteFilter {
  return state.correspondencia.listaTramite?.filtro;
}

function seleccionarPaginadoTramite(state: AppState): Paginado {
  return state.correspondencia.listaTramite?.paginado;
}

export const filtroTramiteSelector = createSelector(
  obtenerState,
  seleccionarFiltroTramite
);
export const paginadoTramiteSelector = createSelector(
  obtenerState,
  seleccionarPaginadoTramite
);
