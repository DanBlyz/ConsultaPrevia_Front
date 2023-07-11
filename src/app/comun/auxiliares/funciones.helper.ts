import { FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';

export class FuncionesHelper {
  static async obtenerSHA1(cadena) {
    const buffer = new TextEncoder().encode(cadena);
    const hash = await crypto.subtle.digest('SHA-1', buffer);
    const hexadecimales = [];
    const dataView = new DataView(hash);
    for (let i = 0; i < dataView.byteLength; i += 1) {
      const byte = dataView.getUint8(i).toString(16).padEnd(2, '0');
      hexadecimales.push(byte);
    }
    return hexadecimales.join('');
  }

  static limpiarEspacios(formGroup: FormGroup): void {
    if (!formGroup) {
      throw new Error('El formulario no tiene el formato correcto');
    }
    Object.keys(formGroup.controls).forEach((key) => {
      if (
        formGroup.get(key).value &&
        typeof formGroup.get(key).value === 'string'
      ) {
        formGroup.get(key).setValue(formGroup.get(key).value.trim());
      }
    });
  }

  static convertirMayusculas(formGroup: FormGroup, exclude: string[]): void {
    if (!formGroup) {
      throw new Error('El formulario no tiene el formato correcto');
    }
    Object.keys(formGroup.controls).forEach((key) => {
      if (
        formGroup.get(key).value &&
        typeof formGroup.get(key).value === 'string'
      ) {
        if (!exclude.includes(key)) {
          formGroup.get(key).setValue(formGroup.get(key).value.toUpperCase());
        }
      }
    });
  }

  static quitarNulos(objeto: any): any {
    if (!objeto) {
      throw new Error('El objeto no contiene un valor válido');
    }
    for (const propName in objeto) {
      if (!objeto[propName] || objeto[propName] === '') {
        delete objeto[propName];
      }
    }
    return objeto;
  }

  static descargarArchivoBase64(
    archivoBase64: string,
    nomArchivo: string,
    extension: string
  ): void {
    if (!archivoBase64 || archivoBase64 === '') {
      throw new Error('El archivo no contiene un valor válido');
    }
    if (!nomArchivo || archivoBase64 === '') {
      throw new Error('El nombre de archivo no es válido');
    }
    saveAs(this.obtenerBlob(archivoBase64), nomArchivo + '.' + extension);
  }

  static obtenerBlob(archivoBase64: string): Blob {
    if (!archivoBase64 || archivoBase64 === '') {
      throw new Error('El archivo no contiene un valor válido');
    }
    let byteString = null;
    let mimeString = null;
    if (archivoBase64.indexOf(',') > 0) {
      byteString = atob(archivoBase64.split(',')[1]);
      mimeString = archivoBase64.split(',')[0].split(':')[1].split(';')[0];
    } else {
      byteString = atob(archivoBase64);
    }
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return mimeString ? new Blob([ab], { type: mimeString }) : new Blob([ab]);
  }

  static contiene(lista1: string[], lista2: string[]): boolean {
    return lista1.some((item) => {
      return lista2.includes(item);
    });
  }

  static esObjetoVacio(objeto: any): boolean {
    return Object.keys(objeto).length === 0 ? true : false;
  }
}
