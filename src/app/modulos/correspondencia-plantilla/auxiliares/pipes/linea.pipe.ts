import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linea'
})
export class LineaPipe implements PipeTransform {
  transform(configuracion: any): string {
    if (configuracion) {
      const margenSuperior = configuracion.margenSuperior * 10;
      const margenInferior = configuracion.margenInferior * 10;
      return `${margenSuperior}px auto ${margenInferior}px auto`;
    } else {
      return `10px auto 10px auto`;
    }
  }
}
