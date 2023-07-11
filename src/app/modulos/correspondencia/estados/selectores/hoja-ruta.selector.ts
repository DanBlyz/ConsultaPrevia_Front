import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { HojaRutaFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroHojaRuta(state: AppState): HojaRutaFilter {
  return state.correspondencia.listaHojaRuta?.filtro;
}

function seleccionarPaginadoHojaRuta(state: AppState): Paginado {
  return state.correspondencia.listaHojaRuta?.paginado;
}

export const filtroHojaRutaSelector = createSelector(
  obtenerState,
  seleccionarFiltroHojaRuta
);
export const paginadoHojaRutaSelector = createSelector(
  obtenerState,
  seleccionarPaginadoHojaRuta
);
