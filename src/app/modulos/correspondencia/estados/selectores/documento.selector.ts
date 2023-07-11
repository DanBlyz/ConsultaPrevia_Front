import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { DocumentoFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroDocumento(state: AppState): DocumentoFilter {
  return state.correspondencia.listaDocumento?.filtro;
}

function seleccionarPaginadoDocumento(state: AppState): Paginado {
  return state.correspondencia.listaDocumento?.paginado;
}

export const filtroDocumentoSelector = createSelector(
  obtenerState,
  seleccionarFiltroDocumento
);
export const paginadoDocumentoSelector = createSelector(
  obtenerState,
  seleccionarPaginadoDocumento
);
