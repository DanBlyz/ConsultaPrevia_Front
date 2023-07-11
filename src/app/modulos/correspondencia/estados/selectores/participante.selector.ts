import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { ParticipanteFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroParticipante(state: AppState): ParticipanteFilter {
  return state.correspondencia.listaParticipante?.filtro;
}

function seleccionarPaginadoParticipante(state: AppState): Paginado {
  return state.correspondencia.listaParticipante?.paginado;
}

export const filtroParticipanteSelector = createSelector(
  obtenerState,
  seleccionarFiltroParticipante
);
export const paginadoParticipanteSelector = createSelector(
  obtenerState,
  seleccionarPaginadoParticipante
);
