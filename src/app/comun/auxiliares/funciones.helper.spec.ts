import { FormBuilder, Validators } from '@angular/forms';
import { FuncionesHelper } from './funciones.helper';

declare const global: any;

describe('FuncionesHelper', () => {
  const fb = new FormBuilder();
  const form = fb.group({
    id: [null],
    nombre: ['', Validators.required],
    primApellido: ['', Validators.required],
    segApellido: [''],
    tipoDocumento: ['', Validators.required],
    numDocumento: ['', Validators.required],
    correoElectronico: ['', Validators.required]
  });
  const archivoBase64 =
    'QWdlbmNpYSBwYXJhIGVsIERlc2Fycm9sbG8gZGUgU29jaWVkYWQgZGUgbGEgSW5mb3JtYWNpw7NuIGVuIEJvbGl2aWEgLSBBRFNJQgpVbmlkYWQgZGUgSW5ub3ZhY2nDs24geSBEZXNhcnJvbGxvCg==';

  describe('limpiarEspacios()', () => {
    test('Debería lanzarse una excepción si se envía un valor nulo como parámetro de entrada', () => {
      expect(async () => {
        FuncionesHelper.limpiarEspacios(null);
      }).rejects.toThrow('El formulario no tiene el formato correcto');
    });
    test('Debería lanzarse una excepción si se envía un valor no definido como parámetro de entrada', () => {
      expect(async () => {
        FuncionesHelper.limpiarEspacios(undefined);
      }).rejects.toThrow('El formulario no tiene el formato correcto');
    });
    test('Debería limpiar los espacios al final de cada campo del tipo cadena', () => {
      form.setValue({
        id: null,
        nombre: 'Juan ',
        primApellido: ' Perez',
        segApellido: null,
        tipoDocumento: '  CÉDULA DE IDENTIDAD  ',
        numDocumento: '6543210',
        correoElectronico: 'juan.perez@ciudadanocomun.bo'
      });
      FuncionesHelper.limpiarEspacios(form);
      expect(form.controls['nombre'].value).toBe('Juan');
      expect(form.controls['primApellido'].value).toBe('Perez');
      expect(form.controls['tipoDocumento'].value).toBe('CÉDULA DE IDENTIDAD');
    });
  });

  describe('convertirMayusculas()', () => {
    test('Debería lanzarse una excepción si se envía un valor nulo como parámetro de entrada', () => {
      expect(async () => {
        FuncionesHelper.convertirMayusculas(null, []);
      }).rejects.toThrow('El formulario no tiene el formato correcto');
    });
    test('Debería lanzarse una excepción si se envía un valor no definido como parámetro de entrada', () => {
      expect(async () => {
        FuncionesHelper.convertirMayusculas(undefined, []);
      }).rejects.toThrow('El formulario no tiene el formato correcto');
    });
    test('Debería convertir a mayusculas cada campo del tipo cadena que no se encuentre en la lista de exclusión', () => {
      form.setValue({
        id: null,
        nombre: 'Juan',
        primApellido: 'Perez',
        segApellido: null,
        tipoDocumento: 'CÉDULA DE IDENTIDAD',
        numDocumento: '6543210',
        correoElectronico: 'juan.perez@ciudadanocomun.bo'
      });
      FuncionesHelper.convertirMayusculas(form, ['correoElectronico']);
      expect(form.controls['nombre'].value).toBe('JUAN');
      expect(form.controls['primApellido'].value).toBe('PEREZ');
      expect(form.controls['correoElectronico'].value).toBe(
        'juan.perez@ciudadanocomun.bo'
      );
    });
  });

  describe('quitarNulos()', () => {
    test('Debería lanzarse una excepción si se envía un valor nulo como parámetro de entrada', () => {
      expect(async () => {
        FuncionesHelper.quitarNulos(null);
      }).rejects.toThrow('El objeto no contiene un valor válido');
    });
    test('Debería lanzarse una excepción si se envía un valor no definido como parámetro de entrada', () => {
      expect(async () => {
        FuncionesHelper.quitarNulos(undefined);
      }).rejects.toThrow('El objeto no contiene un valor válido');
    });
    test('Debería quitar las propiedades con valor nulo del objeto', () => {
      const objeto = {
        id: null,
        nombre: 'Juan',
        primApellido: 'Perez',
        segApellido: null,
        tipoDocumento: 'CÉDULA DE IDENTIDAD',
        numDocumento: '6543210',
        correoElectronico: 'juan.perez@ciudadanocomun.bo'
      };
      FuncionesHelper.quitarNulos(objeto);
      expect(objeto.id).not.toBeDefined();
      expect(objeto.segApellido).not.toBeDefined();
    });
  });

  describe('descargarArchivoBase64()', () => {
    test('Debería lanzarse una excepción si se envía un valor nulo como parámetro de archivoBase64', () => {
      expect(async () => {
        FuncionesHelper.descargarArchivoBase64(null, 'archivo', 'pdf');
      }).rejects.toThrow('El archivo no contiene un valor válido');
    });
    test('Debería lanzarse una excepción si se envía un valor no definido como parámetro de archivoBase64', () => {
      expect(async () => {
        FuncionesHelper.descargarArchivoBase64(undefined, 'archivo', 'pdf');
      }).rejects.toThrow('El archivo no contiene un valor válido');
    });
    test('Debería lanzarse una excepción si se envía un valor vacío como parámetro de archivoBase64', () => {
      expect(async () => {
        FuncionesHelper.descargarArchivoBase64('', 'archivo', 'pdf');
      }).rejects.toThrow('El archivo no contiene un valor válido');
    });
    test('Debería lanzarse una excepción si se envía un valor nulo como parámetro de nomArchivo', () => {
      expect(async () => {
        FuncionesHelper.descargarArchivoBase64('archivoBase64==', null, 'pdf');
      }).rejects.toThrow('El nombre de archivo no es válido');
    });
    test('Debería lanzarse una excepción si se envía un valor no definido como parámetro de nomArchivo', () => {
      expect(async () => {
        FuncionesHelper.descargarArchivoBase64(
          'archivoBase64==',
          undefined,
          'pdf'
        );
      }).rejects.toThrow('El nombre de archivo no es válido');
    });
    test('Debería lanzarse una excepción si se envía un valor vacío como parámetro de nomArchivo', () => {
      expect(async () => {
        FuncionesHelper.descargarArchivoBase64('archivoBase64==', '', 'pdf');
      }).rejects.toThrow('El nombre de archivo no es válido');
    });
    test('Debería ejecutarse la llamada de descarga de archivo', () => {
      global.URL.createObjectURL = jest.fn();
      jest.spyOn(FuncionesHelper, 'descargarArchivoBase64');
      FuncionesHelper.descargarArchivoBase64(archivoBase64, 'ejemplo', 'txt');
      expect(FuncionesHelper.descargarArchivoBase64).toBeCalled();
    });
  });

  describe('obtenerBlob()', () => {
    test('Debería lanzarse una excepción si se envía un valor nulo como parámetro de archivoBase64', () => {
      expect(async () => {
        FuncionesHelper.obtenerBlob(null);
      }).rejects.toThrow('El archivo no contiene un valor válido');
    });
    test('Debería lanzarse una excepción si se envía un valor no definido como parámetro de archivoBase64', () => {
      expect(async () => {
        FuncionesHelper.obtenerBlob(undefined);
      }).rejects.toThrow('El archivo no contiene un valor válido');
    });
    test('Debería lanzarse una excepción si se envía un valor vacío como parámetro de archivoBase64', () => {
      expect(async () => {
        FuncionesHelper.obtenerBlob('');
      }).rejects.toThrow('El archivo no contiene un valor válido');
    });
    test('Debería devolver un objeto del tipo Blob', () => {
      expect(FuncionesHelper.obtenerBlob(archivoBase64)).toBeDefined();
    });
    test('Debería devolver un objeto del tipo Blob', () => {
      expect(
        FuncionesHelper.obtenerBlob('data:@file/plain;base64,' + archivoBase64)
      ).toBeDefined();
    });
  });

  describe('contiene()', () => {
    test('La lista1 contiene valores de la lista2', () => {
      const lista1 = ['1', '2', '3', '4', '5'];
      const lista2 = ['1', '2'];
      FuncionesHelper.contiene(lista1, lista2);
      expect(FuncionesHelper.contiene(lista1, lista2)).toBeTruthy();
    });
    test('La lista2 no contine valores de la lista2', () => {
      const lista1 = ['1', '2', '3', '4', '5'];
      const lista2 = ['8', '9'];
      FuncionesHelper.contiene(lista1, lista2);
      expect(FuncionesHelper.contiene(lista1, lista2)).not.toBeTruthy();
    });
  });
});
