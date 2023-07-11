import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { UsuarioFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroUsuario(state: AppState): UsuarioFilter {
  return state.correspondencia.listaUsuario?.filtro;
}

function seleccionarPaginadoUsuario(state: AppState): Paginado {
  return state.correspondencia.listaUsuario?.paginado;
}

export const filtroUsuarioSelector = createSelector(
  obtenerState,
  seleccionarFiltroUsuario
);
export const paginadoUsuarioSelector = createSelector(
  obtenerState,
  seleccionarPaginadoUsuario
);
