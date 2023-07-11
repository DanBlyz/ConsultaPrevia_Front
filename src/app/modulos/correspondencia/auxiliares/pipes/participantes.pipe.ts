import { Pipe, PipeTransform } from '@angular/core';

import { Participante } from '../../modelos';

@Pipe({
  name: 'participantes'
})
export class ParticipantesPipe implements PipeTransform {
  transform(participantes: Participante[], tipo: string): Participante[] {
    if (participantes && participantes.length > 0) {
      return participantes
        .filter((participante) => participante.tipo === tipo)
        .sort((a, b) => a.id - b.id);
    } else {
      return [];
    }
  }
}
