import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

import { Paginado } from 'src/app/comun/modelos/paginado.model';
import { PlantillaFilter } from '../../modelos/filtros/plantilla.filter';

function obtenerState(state: AppState): AppState {
  return state;
}

function seleccionarFiltroPlantilla(state: AppState): PlantillaFilter {
  return state.correspondencia.listaPlantilla?.filtro;
}

function seleccionarPaginadoPlantilla(state: AppState): Paginado {
  return state.correspondencia.listaPlantilla?.paginado;
}

export const filtroPlantillaSelector = createSelector(
  obtenerState,
  seleccionarFiltroPlantilla
);
export const paginadoPlantillaSelector = createSelector(
  obtenerState,
  seleccionarPaginadoPlantilla
);
