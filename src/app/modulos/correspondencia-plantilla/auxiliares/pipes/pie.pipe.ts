import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pie'
})
export class PiePipe implements PipeTransform {
  transform(configuracion: any): string {
    switch (configuracion.alineacion) {
      case 'IZQUIERDA': {
        return 'text-left d-block';
      }
      case 'CENTRO': {
        return 'text-center d-block';
      }
      case 'DERECHA': {
        return 'text-right d-block';
      }
      default: {
        return '';
      }
    }
  }
}
