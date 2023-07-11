import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { RolFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroRol(state: AppState): RolFilter {
  return state.correspondencia.listaGrupo?.filtro;
}

function seleccionarPaginadoRol(state: AppState): Paginado {
  return state.correspondencia.listaRol?.paginado;
}

export const filtroRolSelector = createSelector(
  obtenerState,
  seleccionarFiltroRol
);
export const paginadoRolSelector = createSelector(
  obtenerState,
  seleccionarPaginadoRol
);
