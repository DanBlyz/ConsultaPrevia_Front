import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'membrete'
})
export class MembretePipe implements PipeTransform {
  transform(configuracion: any): string {
    switch (configuracion.alineacion) {
      case 'IZQUIERDA': {
        return 'float-left d-block';
      }
      case 'CENTRO': {
        return 'mx-auto d-block';
      }
      case 'DERECHA': {
        return 'float-right d-block';
      }
      default: {
        return '';
      }
    }
  }
}
