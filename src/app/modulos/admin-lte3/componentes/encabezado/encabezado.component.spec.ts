import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { appReducers } from 'src/app/app.reducers';
import { AppState } from 'src/app/app.state';
import { SeguridadFacade } from 'src/app/seguridad/fachadas/seguridad.facade';
import { EncabezadoComponent } from './encabezado.component';
import * as SeguridadAcciones from '../../../../seguridad/estados/autenticacion.actions';
import { Router } from '@angular/router';

describe('EncabezadoComponent', () => {
  let component: EncabezadoComponent;
  let fixture: ComponentFixture<EncabezadoComponent>;

  let compiled: HTMLElement;
  let facade: SeguridadFacade;
  let store: Store<AppState>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EncabezadoComponent],
      imports: [
        AppRoutingModule,
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncabezadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    compiled = fixture.nativeElement;
    facade = TestBed.inject(SeguridadFacade);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  test('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  /*test('snapshot', () => {
    expect(compiled.innerHTML).toMatchSnapshot();
  });*/

  describe('Métodos', () => {
    describe('cerrarSesion()', () => {
      test('Debería desencadenarse la operación de cerrar sesión', () => {
        jest.spyOn(facade, 'cerrarSesion');
        component.cerrarSesion();
        expect(facade.cerrarSesion).toHaveBeenCalled();
      });
      test('Debería redireccionar a /autenticacion', () => {
        jest.spyOn(router, 'navigate');
        component.cerrarSesion();
        expect(router.navigate).toHaveBeenCalledWith(['/autenticacion']);
      });
    });
  });

  describe('Interacción', () => {
    test('Debería llamar al método cerrarSesion()', () => {
      const enlace: HTMLElement = compiled.querySelector('a[id=cerrarSesion]');

      jest.spyOn(component, 'cerrarSesion');
      enlace.click();
      expect(component.cerrarSesion).toHaveBeenCalled();
    });
  });

  describe('Estados', () => {
    test('Debería cargar al usuario autenticado', () => {
      store.dispatch(
        SeguridadAcciones.iniciarSesion({
          usuario: {
            usuarioId: 0,
            cuenta: 'jperez',
            nombre: 'Juan',
            apellido: 'Perez',
            nomPublico: 'Juan Perez',
            correoElectronico: 'juan.perez@ciudadanocomun.bo',
            fotografia: '',
            token: '',
            tokenExpiracion: null
          }
        })
      );
      expect(component.usuarioAutenticado.cuenta).toBe('jperez');
    });
  });
});
