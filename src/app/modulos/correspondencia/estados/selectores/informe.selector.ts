import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { InformeFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroInforme(state: AppState): InformeFilter {
  return state.correspondencia.listaInforme?.filtro;
}

function seleccionarPaginadoInforme(state: AppState): Paginado {
  return state.correspondencia.listaInforme?.paginado;
}

export const filtroInformeSelector = createSelector(
  obtenerState,
  seleccionarFiltroInforme
);
export const paginadoInformeSelector = createSelector(
  obtenerState,
  seleccionarPaginadoInforme
);
