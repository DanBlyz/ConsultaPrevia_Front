import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Plantilla } from '../../modelos';
import { PlantillaFilter } from '../../modelos/filtros';

export const establecerFiltroPlantilla = createAction(
  '[CORRESPONDENCIA] Establecer filtro PLANTILLA',
  props<{ filtro: PlantillaFilter }>()
);
export const establecerListaPlantilla = createAction(
  '[CORRESPONDENCIA] Establecer lista PLANTILLA',
  props<{ lista: Plantilla[]; paginado: Paginado }>()
);
export const establecerPlantilla = createAction(
  '[CORRESPONDENCIA] Establecer objeto PLANTILLA',
  props<{ objeto: Plantilla }>()
);
