import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { ParametroFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroParametro(state: AppState): ParametroFilter {
  return state.correspondencia.listaParametro?.filtro;
}

function seleccionarPaginadoParametro(state: AppState): Paginado {
  return state.correspondencia.listaParametro?.paginado;
}

export const filtroParametroSelector = createSelector(
  obtenerState,
  seleccionarFiltroParametro
);
export const paginadoParametroSelector = createSelector(
  obtenerState,
  seleccionarPaginadoParametro
);
