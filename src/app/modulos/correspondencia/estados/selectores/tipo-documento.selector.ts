import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { TipoDocumentoFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroTipoDocumento(state: AppState): TipoDocumentoFilter {
  return state.correspondencia.listaTipoDocumento?.filtro;
}

function seleccionarPaginadoTipoDocumento(state: AppState): Paginado {
  return state.correspondencia.listaTipoDocumento?.paginado;
}

export const filtroTipoDocumentoSelector = createSelector(
  obtenerState,
  seleccionarFiltroTipoDocumento
);
export const paginadoTipoDocumentoSelector = createSelector(
  obtenerState,
  seleccionarPaginadoTipoDocumento
);
