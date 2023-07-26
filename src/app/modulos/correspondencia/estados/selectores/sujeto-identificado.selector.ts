import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { SujetoIdentificadoFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroSujetoIdentificado(state: AppState): SujetoIdentificadoFilter {
  return state.correspondencia.listaSujetoIdentificado?.filtro;
}

function seleccionarPaginadoSujetoIdentificado(state: AppState): Paginado {
  return state.correspondencia.listaSujetoIdentificado?.paginado;
}

export const filtroSujetoIdentificadoSelector = createSelector(
  obtenerState,
  seleccionarFiltroSujetoIdentificado
);
export const paginadoSujetoIdentificadoSelector = createSelector(
  obtenerState,
  seleccionarPaginadoSujetoIdentificado
);
