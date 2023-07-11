import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { ContactoFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroContacto(state: AppState): ContactoFilter {
  return state.correspondencia.listaContacto?.filtro;
}

function seleccionarPaginadoContacto(state: AppState): Paginado {
  return state.correspondencia.listaContacto?.paginado;
}

export const filtroContactoSelector = createSelector(
  obtenerState,
  seleccionarFiltroContacto
);
export const paginadoContactoSelector = createSelector(
  obtenerState,
  seleccionarPaginadoContacto
);
