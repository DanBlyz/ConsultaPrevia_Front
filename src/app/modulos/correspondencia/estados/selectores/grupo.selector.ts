import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { GrupoFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroGrupo(state: AppState): GrupoFilter {
  return state.correspondencia.listaGrupo?.filtro;
}

function seleccionarPaginadoGrupo(state: AppState): Paginado {
  return state.correspondencia.listaGrupo?.paginado;
}

export const filtroGrupoSelector = createSelector(
  obtenerState,
  seleccionarFiltroGrupo
);
export const paginadoGrupoSelector = createSelector(
  obtenerState,
  seleccionarPaginadoGrupo
);
