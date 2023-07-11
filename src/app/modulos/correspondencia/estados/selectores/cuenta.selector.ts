import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { CuentaFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroCuenta(state: AppState): CuentaFilter {
  return state.correspondencia.listaCuenta?.filtro;
}

function seleccionarPaginadoCuenta(state: AppState): Paginado {
  return state.correspondencia.listaCuenta?.paginado;
}

export const filtroCuentaSelector = createSelector(
  obtenerState,
  seleccionarFiltroCuenta
);
export const paginadoCuentaSelector = createSelector(
  obtenerState,
  seleccionarPaginadoCuenta
);
