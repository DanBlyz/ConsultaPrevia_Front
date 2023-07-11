import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { appReducers } from 'src/app/app.reducers';
import { Respuesta } from 'src/app/comun/modelos/respuesta.model';
import { Registro } from '../modelos/registro.model';
import { UsuarioAutenticado } from '../modelos/usuario-autenticado.model';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { SeguridadFacade } from './seguridad.facade';

describe('SeguridadFacade', () => {
  let facade: SeguridadFacade;
  let service: AutenticacionService;
  let toastr: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [SeguridadFacade]
    });
  });

  beforeEach(() => {
    facade = TestBed.inject(SeguridadFacade);
    service = TestBed.inject(AutenticacionService);
    toastr = TestBed.inject(ToastrService);
  });

  afterEach(() => jest.resetAllMocks());

  test('Debería crearse la fachada', () => {
    expect(facade).toBeTruthy();
  });

  describe('iniciarSesion()', () => {
    test('No debería iniciar sesión debido a un error desconocido', () => {
      jest
        .spyOn(service, 'obtenerToken')
        .mockReturnValue(throwError(() => new Error('Error desconocido')));
      jest.spyOn(toastr, 'error');

      facade.iniciarSesion('adsib', 'adsib');

      expect(service.obtenerToken).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        'Se ha producido un error al iniciar sesión, vuelva a intentar más tardes.',
        'Inicio de sesión'
      );
    });
    test('No debería iniciar sesión por acceso no autorizado', () => {
      jest
        .spyOn(service, 'obtenerToken')
        .mockReturnValue(of({ access_token: null }));
      jest.spyOn(toastr, 'error');

      facade.iniciarSesion('adsib', '12345678');

      expect(service.obtenerToken).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        'Acceso no autorizado.',
        'Inicio de sesión'
      );
    });
    test('Debería iniciar sesión satisfactoriamente', () => {
      jest.spyOn(service, 'obtenerToken').mockReturnValue(
        of({
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjpbIioiXSwiaWF0IjoxNjQ3Mjc0Mjc4LCJleHAiOjI2NDcyNzQyNzgsImF1ZCI6IioiLCJpc3MiOiJhZHNpYi5nb2IuYm8iLCJzdWIiOiJBZ2VuY2lhIHBhcmEgZWwgRGVzYXJyb2xsbyBkZSBsYSBTb2NpZWRhZCBkZSBsYSBJbmZvcm1hY2nDs24gZW4gQm9saXZpYSAtIEFEU0lCIn0.-hjLj1SAxy5sfAEMaxGAm4ILC-0eQQXdE3MIIRbW2Xk'
        })
      );
      jest.spyOn(toastr, 'error');
      jest.spyOn(service, 'obtenerInfoUsuario').mockReturnValue(
        of({
          codCuenta: 'XYZ',
          nombre: '',
          apellido: '',
          nomPublico: 'ADSIB',
          correoElectronico: 'uid@adsib.gob.bo'
        })
      );

      facade.iniciarSesion('adsib', 'adsib');

      expect(service.obtenerToken).toHaveBeenCalled();
      expect(service.obtenerInfoUsuario).toHaveBeenCalled();
      expect(toastr.error).not.toHaveBeenCalled();
    });
    test('No debería iniciar sesión por error desconocido al obtener información del usuario', () => {
      jest.spyOn(service, 'obtenerToken').mockReturnValue(
        of({
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjpbIioiXSwiaWF0IjoxNjQ3Mjc0Mjc4LCJleHAiOjI2NDcyNzQyNzgsImF1ZCI6IioiLCJpc3MiOiJhZHNpYi5nb2IuYm8iLCJzdWIiOiJBZ2VuY2lhIHBhcmEgZWwgRGVzYXJyb2xsbyBkZSBsYSBTb2NpZWRhZCBkZSBsYSBJbmZvcm1hY2nDs24gZW4gQm9saXZpYSAtIEFEU0lCIn0.-hjLj1SAxy5sfAEMaxGAm4ILC-0eQQXdE3MIIRbW2Xk'
        })
      );
      jest.spyOn(toastr, 'error');
      jest
        .spyOn(service, 'obtenerInfoUsuario')
        .mockReturnValue(throwError(() => new Error('Error desconocido')));

      facade.iniciarSesion('adsib', 'adsib');

      expect(service.obtenerToken).toHaveBeenCalled();
      expect(service.obtenerInfoUsuario).toHaveBeenCalled();
      expect(toastr.error).not.toHaveBeenCalled();
    });
  });

  describe('registrarse()', () => {
    test('No debería registrar la cuenta debido a un error desconocido', () => {
      const objeto = new Registro();
      objeto.cuenta = 'adsib';
      objeto.contrasenia = 'adsib';
      objeto.nombre = '';
      objeto.apellido = '';
      objeto.nomPublico = 'ADSIB';
      objeto.correoElectronico = 'uid@adsib.gob.bo';

      jest
        .spyOn(service, 'crearCuenta')
        .mockReturnValue(throwError(() => new Error('Error desconocido')));

      facade.registrarse(objeto).catch(() => '');

      expect(service.crearCuenta).toHaveBeenCalled();
    });
    test('No debería registrar la cuenta (respuesta nula)', () => {
      const objeto = new Registro();
      objeto.cuenta = 'adsib';
      objeto.contrasenia = 'adsib';
      objeto.nombre = '';
      objeto.apellido = '';
      objeto.nomPublico = 'ADSIB';
      objeto.correoElectronico = 'uid@adsib.gob.bo';

      jest.spyOn(service, 'crearCuenta').mockReturnValue(of(null));
      jest.spyOn(toastr, 'error');

      facade.registrarse(objeto);

      expect(service.crearCuenta).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        'Se ha producido un error al crear la cuenta, intente nuevamente por favor.',
        'Creación de cuentas'
      );
    });
    test('No debería registrar la cuenta (respuesta de error)', () => {
      const objeto = new Registro();
      objeto.cuenta = 'adsib';
      objeto.contrasenia = 'adsib';
      objeto.nombre = '';
      objeto.apellido = '';
      objeto.nomPublico = 'ADSIB';
      objeto.correoElectronico = 'uid@adsib.gob.bo';

      const respuestaEsperada: Respuesta = {
        tipoRespuesta: 'Error',
        mensaje: 'Error MOCK'
      };

      jest.spyOn(service, 'crearCuenta').mockReturnValue(of(respuestaEsperada));
      jest.spyOn(toastr, 'error');

      facade.registrarse(objeto);

      expect(service.crearCuenta).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        'Error MOCK',
        'Creación de cuentas'
      );
    });
    test('Debería registrarse la cuenta satisfactoriamente', () => {
      const objeto = new Registro();
      objeto.cuenta = 'adsib';
      objeto.contrasenia = 'adsib';
      objeto.nombre = '';
      objeto.apellido = '';
      objeto.nomPublico = 'ADSIB';
      objeto.correoElectronico = 'uid@adsib.gob.bo';

      const respuestaEsperada: Respuesta = {
        tipoRespuesta: 'Exito',
        mensaje: 'Éxito MOCK'
      };

      jest.spyOn(service, 'crearCuenta').mockReturnValue(of(respuestaEsperada));
      jest.spyOn(toastr, 'success');

      facade.registrarse(objeto);

      expect(service.crearCuenta).toHaveBeenCalled();
      expect(toastr.success).toHaveBeenCalledWith(
        'La cuenta se ha creado satisfactoriamente.',
        'Creación de cuentas'
      );
    });
  });

  describe('actualizar()', () => {
    test('No debería actualizar la información del usuario debido a un error desconocido', () => {
      const objeto = new UsuarioAutenticado();
      objeto.usuarioId = '';
      objeto.cuenta = 'adsib';
      objeto.nombre = '';
      objeto.apellido = '';
      objeto.nomPublico = 'ADSIB';
      objeto.correoElectronico = 'uid@adsib.gob.bo';
      objeto.fotografia = '';
      objeto.token = '';
      objeto.tokenExpiracion = null;

      jest
        .spyOn(service, 'actualizarCuenta')
        .mockReturnValue(throwError(() => new Error('Error desconocido')));

      facade.actualizar('XYZ', objeto).catch(() => '');

      expect(service.actualizarCuenta).toHaveBeenCalled();
    });
    test('No debería actualizar la información del usuario (respuesta nula)', () => {
      const objeto = new UsuarioAutenticado();
      objeto.usuarioId = '';
      objeto.cuenta = 'adsib';
      objeto.nombre = '';
      objeto.apellido = '';
      objeto.nomPublico = 'ADSIB';
      objeto.correoElectronico = 'uid@adsib.gob.bo';
      objeto.fotografia = '';
      objeto.token = '';
      objeto.tokenExpiracion = null;

      jest.spyOn(service, 'actualizarCuenta').mockReturnValue(of(null));
      jest.spyOn(toastr, 'error');

      facade.actualizar('XYZ', objeto);

      expect(service.actualizarCuenta).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        'Se ha producido un error al modificar la cuenta, intente nuevamente por favor.',
        'Perfil'
      );
    });
    test('No debería actualizar la información del usuario (respuesta de error)', () => {
      const objeto = new UsuarioAutenticado();
      objeto.usuarioId = '';
      objeto.cuenta = 'adsib';
      objeto.nombre = '';
      objeto.apellido = '';
      objeto.nomPublico = 'ADSIB';
      objeto.correoElectronico = 'uid@adsib.gob.bo';
      objeto.fotografia = '';
      objeto.token = '';
      objeto.tokenExpiracion = null;

      const respuestaEsperada: Respuesta = {
        tipoRespuesta: 'Error',
        mensaje: 'Error MOCK'
      };

      jest
        .spyOn(service, 'actualizarCuenta')
        .mockReturnValue(of(respuestaEsperada));
      jest.spyOn(toastr, 'error');

      facade.actualizar('XYZ', objeto);

      expect(service.actualizarCuenta).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith('Error MOCK', 'Perfil');
    });
    test('Debería actualizar la información del usuario', () => {
      const objeto = new UsuarioAutenticado();
      objeto.usuarioId = '';
      objeto.cuenta = 'adsib';
      objeto.nombre = '';
      objeto.apellido = '';
      objeto.nomPublico = 'ADSIB';
      objeto.correoElectronico = 'uid@adsib.gob.bo';
      objeto.fotografia = '';
      objeto.token = '';
      objeto.tokenExpiracion = null;

      const respuestaEsperada: Respuesta = {
        tipoRespuesta: 'Exito',
        mensaje: 'Éxito MOCK'
      };

      jest
        .spyOn(service, 'actualizarCuenta')
        .mockReturnValue(of(respuestaEsperada));
      jest.spyOn(toastr, 'success');

      facade.actualizar('XYZ', objeto);

      expect(service.actualizarCuenta).toHaveBeenCalled();
      expect(toastr.success).toHaveBeenCalledWith(
        'La cuenta se ha modificado satisfactoriamente.',
        'Perfil'
      );
    });
  });

  describe('cambiarContrasenia()', () => {
    test('No debería cambiar la contraseña debido a un error desconocido', () => {
      jest
        .spyOn(service, 'cambiarContrasenia')
        .mockReturnValue(throwError(() => new Error('Error desconocido')));

      facade.cambiarContrasenia('XYZ', '12345678', 'adsib').catch(() => '');

      expect(service.cambiarContrasenia).toHaveBeenCalled();
    });
    test('No debería cambiar la contraseña (respuesta nula)', () => {
      jest.spyOn(service, 'cambiarContrasenia').mockReturnValue(of(null));
      jest.spyOn(toastr, 'error');

      facade.cambiarContrasenia('XYZ', '12345678', 'adsib');

      expect(service.cambiarContrasenia).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        'Se ha producido un error al cambiar la contraseña, intente nuevamente por favor.',
        'Seguridad'
      );
    });
    test('No debería cambiar la contraseña (respuesta de error)', () => {
      const respuestaEsperada: Respuesta = {
        tipoRespuesta: 'Error',
        mensaje: 'Error MOCK'
      };

      jest
        .spyOn(service, 'cambiarContrasenia')
        .mockReturnValue(of(respuestaEsperada));
      jest.spyOn(toastr, 'error');

      facade.cambiarContrasenia('XYZ', '12345678', 'adsib');

      expect(service.cambiarContrasenia).toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith('Error MOCK', 'Seguridad');
    });
    test('Debería cambiar la contraseña', () => {
      const respuestaEsperada: Respuesta = {
        tipoRespuesta: 'Exito',
        mensaje: 'Éxito MOCK'
      };

      jest
        .spyOn(service, 'cambiarContrasenia')
        .mockReturnValue(of(respuestaEsperada));
      jest.spyOn(toastr, 'success');

      facade.cambiarContrasenia('XYZ', '12345678', 'adsib');

      expect(service.cambiarContrasenia).toHaveBeenCalled();
      expect(toastr.success).toHaveBeenCalledWith(
        'La contraseña se ha modificado satisfactoriamente.',
        'Seguridad'
      );
    });
  });

  describe('cerrarSesion()', () => {
    test('Debería cerrar la sesión', () => {
      jest.spyOn(facade, 'cerrarSesion');
      facade.cerrarSesion();
      expect(facade.cerrarSesion).toHaveBeenCalled();
    });
  });

  describe('tokenExpirado()', () => {
    test('Debería devolver token expirado por token nulo', () => {
      facade.token = null;
      expect(facade.tokenExpirado()).toBeTruthy();
    });
    test('No debería devolver token expirado', () => {
      facade.token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjpbIioiXSwiaWF0IjoxNjQ3Mjc0Mjc4LCJleHAiOjI2NDcyNzQyNzgsImF1ZCI6IioiLCJpc3MiOiJhZHNpYi5nb2IuYm8iLCJzdWIiOiJBZ2VuY2lhIHBhcmEgZWwgRGVzYXJyb2xsbyBkZSBsYSBTb2NpZWRhZCBkZSBsYSBJbmZvcm1hY2nDs24gZW4gQm9saXZpYSAtIEFEU0lCIn0.-hjLj1SAxy5sfAEMaxGAm4ILC-0eQQXdE3MIIRbW2Xk';
      expect(facade.tokenExpirado()).toBeFalsy();
    });
  });

  describe('obtenerRoles()', () => {
    test('No debería devolver roles por token nulo', () => {
      facade.token = null;
      expect(facade.obtenerRoles()).toHaveLength(0);
    });
    test('Debería devolver el listado de roles contenido en el token', () => {
      facade.token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjpbIioiXSwiaWF0IjoxNjQ3Mjc0Mjc4LCJleHAiOjI2NDcyNzQyNzgsImF1ZCI6IioiLCJpc3MiOiJhZHNpYi5nb2IuYm8iLCJzdWIiOiJBZ2VuY2lhIHBhcmEgZWwgRGVzYXJyb2xsbyBkZSBsYSBTb2NpZWRhZCBkZSBsYSBJbmZvcm1hY2nDs24gZW4gQm9saXZpYSAtIEFEU0lCIn0.-hjLj1SAxy5sfAEMaxGAm4ILC-0eQQXdE3MIIRbW2Xk';
      expect(facade.obtenerRoles().length).toBeGreaterThan(0);
    });
    test('Debería devolver el rol contenido en el token', () => {
      facade.token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjoiKiIsImlhdCI6MTY0NzI3NDI3OCwiZXhwIjoyNjQ3Mjc0Mjc4LCJhdWQiOiIqIiwiaXNzIjoiYWRzaWIuZ29iLmJvIiwic3ViIjoiQWdlbmNpYSBwYXJhIGVsIERlc2Fycm9sbG8gZGUgbGEgU29jaWVkYWQgZGUgbGEgSW5mb3JtYWNpw7NuIGVuIEJvbGl2aWEgLSBBRFNJQiJ9.DlK9uOgORXUI_9ioZeBG7nwJ7ceHeF9jWIoNa-mbRLA';
      expect(facade.obtenerRoles().length).toBeGreaterThan(0);
    });
  });

  describe('contieneRoles()', () => {
    test('Debería devolver falso', () => {
      facade.token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjpbIioiXSwiaWF0IjoxNjQ3Mjc0Mjc4LCJleHAiOjI2NDcyNzQyNzgsImF1ZCI6IioiLCJpc3MiOiJhZHNpYi5nb2IuYm8iLCJzdWIiOiJBZ2VuY2lhIHBhcmEgZWwgRGVzYXJyb2xsbyBkZSBsYSBTb2NpZWRhZCBkZSBsYSBJbmZvcm1hY2nDs24gZW4gQm9saXZpYSAtIEFEU0lCIn0.-hjLj1SAxy5sfAEMaxGAm4ILC-0eQQXdE3MIIRbW2Xk';
      expect(facade.contieneRoles(['ADMINISTRADOR'])).toBeFalsy();
    });
    test('Debería devolver verdadero', () => {
      facade.token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjowLCJuYW1lIjoiQURTSUIiLCJnaXZlbl9uYW1lIjoiIiwiZmFtaWx5X25hbWUiOiIiLCJuaWNrbmFtZSI6InVpZEBhZHNpYi5nb2IuYm8iLCJwaWN0dXJlIjpudWxsLCJlbWFpbCI6InVpZEBhZHNpYi5nb2IuYm8iLCJub25jZSI6IiIsInJvbGVzIjpbIioiXSwiaWF0IjoxNjQ3Mjc0Mjc4LCJleHAiOjI2NDcyNzQyNzgsImF1ZCI6IioiLCJpc3MiOiJhZHNpYi5nb2IuYm8iLCJzdWIiOiJBZ2VuY2lhIHBhcmEgZWwgRGVzYXJyb2xsbyBkZSBsYSBTb2NpZWRhZCBkZSBsYSBJbmZvcm1hY2nDs24gZW4gQm9saXZpYSAtIEFEU0lCIn0.-hjLj1SAxy5sfAEMaxGAm4ILC-0eQQXdE3MIIRbW2Xk';
      expect(facade.contieneRoles(['*'])).toBeTruthy();
    });
  });
});
