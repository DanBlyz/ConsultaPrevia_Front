import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { DocumentoHojaRutaFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroDocumentoHojaRuta(
  state: AppState
): DocumentoHojaRutaFilter {
  return state.correspondencia.listaDocumentoHojaRuta?.filtro;
}

function seleccionarPaginadoDocumentoHojaRuta(state: AppState): Paginado {
  return state.correspondencia.listaDocumentoHojaRuta?.paginado;
}

export const filtroDocumentoHojaRutaSelector = createSelector(
  obtenerState,
  seleccionarFiltroDocumentoHojaRuta
);
export const paginadoDocumentoHojaRutaSelector = createSelector(
  obtenerState,
  seleccionarPaginadoDocumentoHojaRuta
);
