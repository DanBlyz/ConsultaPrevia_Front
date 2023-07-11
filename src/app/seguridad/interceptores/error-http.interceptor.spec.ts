import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { appReducers } from 'src/app/app.reducers';
import { SeguridadFacade } from 'src/app/seguridad/fachadas/seguridad.facade';
import { AutenticacionService } from 'src/app/seguridad/servicios/autenticacion.service';
import { ErrorHttpInterceptor } from './error-http.interceptor';

describe('ErrorHttpInterceptor', () => {
  const urlBase = 'http://localhost:3000/';

  let service: AutenticacionService;
  let facade: SeguridadFacade;
  let httpMock: HttpTestingController;

  let http: HttpClient;

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
          useClass: ErrorHttpInterceptor,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AutenticacionService);
    facade = TestBed.inject(SeguridadFacade);
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  test('Debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  test('Debería controlar el error 401 (Unauthorized) por token expirado', () => {
    jest.spyOn(facade, 'tokenExpirado').mockReturnValue(true);
    let respuesta = undefined;

    http.get(`${urlBase}autenticacion/usuarios/1`).subscribe({
      error: (error) => {
        respuesta = error;
      }
    });

    const backendMock = httpMock.expectOne(
      `${urlBase}autenticacion/usuarios/1`
    );
    expect(backendMock.request.method).toBe('GET');

    backendMock.flush('', { status: 401, statusText: 'Unauthorized' });
    httpMock.verify();

    expect(respuesta).toBeDefined();
  });

  test('Debería controlar el error 401 (Unauthorized)', () => {
    jest.spyOn(facade, 'tokenExpirado').mockReturnValue(false);
    let respuesta = undefined;

    http.get(`${urlBase}autenticacion/usuarios/1`).subscribe({
      error: (error) => {
        respuesta = error;
      }
    });

    const backendMock = httpMock.expectOne(
      `${urlBase}autenticacion/usuarios/1`
    );
    expect(backendMock.request.method).toBe('GET');

    backendMock.flush('', { status: 401, statusText: 'Unauthorized' });
    httpMock.verify();

    expect(respuesta).toBeDefined();
  });

  test('Debería controlar el error 404 (Not found)', () => {
    let respuesta = undefined;

    http.get(`${urlBase}demostracion`).subscribe({
      error: (error) => {
        respuesta = error;
      }
    });

    const backendMock = httpMock.expectOne(`${urlBase}demostracion`);
    expect(backendMock.request.method).toBe('GET');

    backendMock.flush('', { status: 404, statusText: 'Not found' });
    httpMock.verify();

    expect(respuesta).toBeDefined();
  });
});
