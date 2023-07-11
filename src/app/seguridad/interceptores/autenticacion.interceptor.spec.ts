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
import { environment } from 'src/environments/environment';
import { AutenticacionInterceptor } from '../interceptores/autenticacion.interceptor';
import { AutenticacionService } from '../servicios/autenticacion.service';

describe('AutenticacionInterceptor', () => {
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

  test('Debería controlar el error 401 (Unauthorized)', () => {
    environment.modoAislado = false;

    const id = '1';
    let respuesta = undefined;

    service
      .obtenerInfoUsuario(id, null)
      .pipe(first())
      .subscribe({
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
    environment.modoAislado = false;

    const id = '1';
    let respuesta = undefined;

    service
      .obtenerInfoUsuario(id, null)
      .pipe(first())
      .subscribe({
        error: (error) => {
          respuesta = error;
        }
      });

    const backendMock = httpMock.expectOne(
      `${urlBase}autenticacion/usuarios/1`
    );
    expect(backendMock.request.method).toBe('GET');

    backendMock.flush('', { status: 404, statusText: 'Not found' });
    httpMock.verify();

    expect(respuesta).toBeDefined();
  });
});
