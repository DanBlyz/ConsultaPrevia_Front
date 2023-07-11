import { environment } from 'src/environments/environment';

export class EnvironmentHelper {
  static obtenerConfiguracion(modulo: string): any {
    const modulos = environment['modulos'];
    return modulos.find((item: any) => item.hasOwnProperty(modulo))[modulo];
  }
}
