import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { ActoAdministrativoFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroActoAdministrativo(state: AppState): ActoAdministrativoFilter {
  return state.correspondencia.listaActoAdministrativo?.filtro;
}

function seleccionarPaginadoActoAdministrativo(state: AppState): Paginado {
  return state.correspondencia.listaActoAdministrativo?.paginado;
}

export const filtroActoAdministrativoSelector = createSelector(
  obtenerState,
  seleccionarFiltroActoAdministrativo
);
export const paginadoActoAdministrativoSelector = createSelector(
  obtenerState,
  seleccionarPaginadoActoAdministrativo
);
