import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titulo'
})
export class TituloPipe implements PipeTransform {
  transform(configuracion: any): string {
    const css = ['d-block mb-2 mt-2'];
    switch (configuracion.nivel) {
      case 'NIVEL 1': {
        css.push('h3');
        break;
      }
      case 'NIVEL 2': {
        css.push('h4');
        break;
      }
      case 'NIVEL 3': {
        css.push('h5');
        break;
      }
      default: {
        break;
      }
    }
    switch (configuracion.alineacion) {
      case 'IZQUIERDA': {
        css.push('text-left');
        break;
      }
      case 'CENTRO': {
        css.push('text-center');
        break;
      }
      case 'DERECHA': {
        css.push('text-right');
        break;
      }
      default: {
        break;
      }
    }
    return css.join(' ');
  }
}
