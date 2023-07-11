import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { first } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { appReducers } from 'src/app/app.reducers';
import { RespuestaObjeto } from 'src/app/comun/modelos/respuesta-objeto.model';
import { Respuesta } from 'src/app/comun/modelos/respuesta.model';
import { environment } from 'src/environments/environment';
import { SeguridadFacade } from '../fachadas/seguridad.facade';
import { AutenticacionInterceptor } from '../interceptores/autenticacion.interceptor';
import { Registro } from '../modelos/registro.model';
import { UsuarioAutenticado } from '../modelos/usuario-autenticado.model';
import { AutenticacionService } from './autenticacion.service';

describe('AutenticacionService', () => {
  const urlBase: string = environment.apiAutenticacion.url;
  let service: AutenticacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule,
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        AutenticacionService,
        SeguridadFacade,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AutenticacionInterceptor,
          multi: true
        }
      ]
    });
    service = TestBed.inject(AutenticacionService);
  });

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
  });

  //afterEach(() => jest.resetAllMocks());

  test('Debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  test('Debería crearse la cuenta', () => {
    const respuestaEsperada: RespuestaObjeto<Registro> = {
      tipoRespuesta: 'Exito',
      mensaje: 'El registro se ha modificdo con éxito.',
      exito: true,
      objeto: {
        cuenta: 'adsib',
        contrasenia: 'adsib',
        nombre: '',
        apellido: '',
        nomPublico: 'ADSIB',
        correoElectronico: 'uid@adsib.gob.bo'
      }
    };
    let respuestaRecibida: RespuestaObjeto<Registro>;

    service
      .crearCuenta(respuestaEsperada.objeto)
      .pipe(first())
      .subscribe({
        next: (respuesta) => {
          respuestaRecibida = respuesta;
        }
      });

    const backendMock = httpMock.expectOne(`${urlBase}autenticacion/usuarios`);
    expect(backendMock.request.method).toBe('POST');
    backendMock.flush(respuestaEsperada);
    httpMock.verify();

    expect(respuestaRecibida).toMatchObject(respuestaEsperada);
  });

  test('Debería actualizarse la información del usuario', () => {
    const respuestaEsperada: RespuestaObjeto<UsuarioAutenticado> = {
      tipoRespuesta: 'Exito',
      mensaje: 'El registro se ha guardado con éxito.',
      exito: true,
      objeto: {
        usuarioId: '',
        cuenta: '',
        nombre: '',
        apellido: '',
        nomPublico: '',
        correoElectronico: '',
        fotografia: '',
        token: '',
        tokenExpiracion: ''
      }
    };
    let respuestaRecibida: RespuestaObjeto<UsuarioAutenticado>;

    const usuarioId = 'XYZ';
    service
      .actualizarCuenta(usuarioId, respuestaEsperada.objeto)
      .pipe(first())
      .subscribe({
        next: (respuesta) => {
          respuestaRecibida = respuesta;
        }
      });

    const backendMock = httpMock.expectOne(
      `${urlBase}autenticacion/usuarios/${usuarioId}`
    );
    expect(backendMock.request.method).toBe('PATCH');
    backendMock.flush(respuestaEsperada);
    httpMock.verify();

    expect(respuestaRecibida).toMatchObject(respuestaEsperada);
  });

  test('Debería actualizarse la contraseña', () => {
    const respuestaEsperada: Respuesta = {
      tipoRespuesta: 'Exito',
      mensaje: 'El registro se ha modificado con éxito.',
      exito: true
    };
    let respuestaRecibida: Respuesta;

    const usuarioId = 'XYZ';
    service
      .cambiarContrasenia(usuarioId, '12345678', 'adsib')
      .pipe(first())
      .subscribe({
        next: (respuesta) => {
          respuestaRecibida = respuesta;
        }
      });

    const backendMock = httpMock.expectOne(
      `${urlBase}autenticacion/usuarios/${usuarioId}/cambiar-contrasenia`
    );
    expect(backendMock.request.method).toBe('PATCH');
    backendMock.flush(respuestaEsperada);
    httpMock.verify();

    expect(respuestaRecibida).toMatchObject(respuestaEsperada);
  });

  test('Debería devolver un token JWT', () => {
    environment.modoAislado = false;
    const respuestaEsperada: any = {
      access_token: 'TOKEN_JWT'
    };
    let respuestaRecibida: any;

    service
      .obtenerToken('adsib', 'adsib')
      .pipe(first())
      .subscribe({
        next: (respuesta) => {
          respuestaRecibida = respuesta;
        }
      });

    const backendMock = httpMock.expectOne(`${urlBase}autenticacion/token`);
    expect(backendMock.request.method).toBe('POST');
    backendMock.flush(respuestaEsperada);
    httpMock.verify();

    expect(respuestaRecibida).toMatchObject(respuestaEsperada);
  });

  test('Debería devolver un token JWT (modo aislado)', () => {
    environment.modoAislado = true;

    let respuestaRecibida: any;

    service
      .obtenerToken('adsib', 'adsib')
      .pipe(first())
      .subscribe({
        next: (respuesta) => {
          respuestaRecibida = respuesta;
        }
      });

    expect(respuestaRecibida.access_token).not.toBeNull();
  });

  test('Debería devolver un token JWT con valor nulo (modo aislado)', () => {
    environment.modoAislado = true;

    let respuestaRecibida: any;

    service
      .obtenerToken('adsib', '12346578')
      .pipe(first())
      .subscribe({
        next: (respuesta) => {
          respuestaRecibida = respuesta;
        }
      });

    expect(respuestaRecibida.access_token).toBeNull();
  });

  test('Debería devolver información del usuario', () => {
    environment.modoAislado = false;
    const respuestaEsperada: RespuestaObjeto<any> = {
      tipoRespuesta: 'Exito',
      mensaje: '',
      exito: true,
      objeto: {
        codCuenta: 'XYZ',
        nombre: '',
        apellido: '',
        nomPublico: 'ADSIB',
        correoElectronico: 'uid@adsib.gob.bo'
      }
    };
    let respuestaRecibida: any;

    const usuarioId = 'XYZ';
    service
      .obtenerInfoUsuario(usuarioId, 'TOKEN_JWT')
      .pipe(first())
      .subscribe({
        next: (respuesta) => {
          respuestaRecibida = respuesta;
        }
      });

    const backendMock = httpMock.expectOne(
      `${urlBase}autenticacion/usuarios/${usuarioId}`
    );
    expect(backendMock.request.method).toBe('GET');
    backendMock.flush(respuestaEsperada);
    httpMock.verify();

    expect(respuestaRecibida).toMatchObject(respuestaEsperada);
  });

  test('Debería devolver información del usuario (modo aislado)', () => {
    environment.modoAislado = true;

    let respuestaRecibida: any;

    const usuarioId = 'XYZ';
    service
      .obtenerInfoUsuario(usuarioId, 'TOKEN_JWT')
      .pipe(first())
      .subscribe({
        next: (respuesta) => {
          respuestaRecibida = respuesta;
        }
      });

    expect(respuestaRecibida.id).toBe(usuarioId);
  });
});
