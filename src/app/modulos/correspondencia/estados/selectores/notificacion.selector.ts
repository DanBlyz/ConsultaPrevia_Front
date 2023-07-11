import { createSelector } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
import { Paginado } from 'src/app/comun/modelos';

import { NotificacionFilter } from '../../modelos/filtros';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroNotificacion(state: AppState): NotificacionFilter {
  return state.correspondencia.listaNotificacion?.filtro;
}

function seleccionarPaginadoNotificacion(state: AppState): Paginado {
  return state.correspondencia.listaNotificacion?.paginado;
}

export const filtroNotificacionSelector = createSelector(
  obtenerState,
  seleccionarFiltroNotificacion
);
export const paginadoNotificacionSelector = createSelector(
  obtenerState,
  seleccionarPaginadoNotificacion
);
