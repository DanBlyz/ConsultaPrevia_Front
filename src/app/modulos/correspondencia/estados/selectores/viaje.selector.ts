import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { ViajeFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroViaje(state: AppState): ViajeFilter {
  return state.correspondencia.listaViaje?.filtro;
}

function seleccionarPaginadoViaje(state: AppState): Paginado {
  return state.correspondencia.listaViaje?.paginado;
}

export const filtroViajeSelector = createSelector(
  obtenerState,
  seleccionarFiltroViaje
);
export const paginadoViajeSelector = createSelector(
  obtenerState,
  seleccionarPaginadoViaje
);
