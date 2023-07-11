import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { appReducers } from 'src/app/app.reducers';
import { SeguridadFacade } from 'src/app/seguridad/fachadas/seguridad.facade';
import { AutenticacionComponent } from './autenticacion.component';
import { AppState } from 'src/app/app.state';
import * as ComunAcciones from '../../../../comun/estados/comun.actions';
import * as SeguridadAcciones from '../../../../seguridad/estados/autenticacion.actions';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

describe('AutenticacionComponent', () => {
  let component: AutenticacionComponent;
  let fixture: ComponentFixture<AutenticacionComponent>;

  let compiled: HTMLElement;
  let facade: SeguridadFacade;
  let store: Store<AppState>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutenticacionComponent],
      imports: [
        AppRoutingModule,
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutenticacionComponent);
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

  test('Debería crearse el componente (permiteRegistrarse)', () => {
    environment.apiAutenticacion['registro'] = {
      roles: []
    };
    const fixture = TestBed.createComponent(AutenticacionComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.permiteRegistrarse).toBeTruthy();
  });

  describe('Métodos', () => {
    describe('iniciarSesion()', () => {
      test('No debería desencadenarse la operación de inición de sesión', () => {
        component.formAutenticacion.setValue({
          usuario: 'adsib',
          contrasenia: ''
        });
        jest.spyOn(facade, 'iniciarSesion');
        component.iniciarSesion();
        expect(facade.iniciarSesion).not.toHaveBeenCalled();
      });
      test('Debería desencadenarse la operación de inición de sesión', () => {
        component.formAutenticacion.setValue({
          usuario: 'adsib',
          contrasenia: 'adsib'
        });
        jest.spyOn(facade, 'iniciarSesion');
        component.iniciarSesion();
        expect(facade.iniciarSesion).toHaveBeenCalled();
      });
    });
  });

  describe('Interacción', () => {
    test('Debería actualizarse el formulario reactivo', () => {
      const usuario: HTMLInputElement = compiled.querySelector(
        'input[type=text][formControlName=usuario]'
      );
      const contrasenia: HTMLInputElement = compiled.querySelector(
        'input[type=password][formControlName=contrasenia]'
      );

      usuario.value = 'adsib';
      usuario.dispatchEvent(new Event('input'));

      contrasenia.value = '12345678';
      contrasenia.dispatchEvent(new Event('input'));

      expect(component.formAutenticacion.controls['usuario'].value).toBe(
        'adsib'
      );
      expect(component.formAutenticacion.controls['contrasenia'].value).toBe(
        '12345678'
      );
    });
    test('Debería llamar al método iniciarSesion()', () => {
      const boton: HTMLButtonElement = compiled.querySelector(
        'button[type=submit]'
      );

      jest.spyOn(component, 'iniciarSesion');
      boton.click();
      expect(component.iniciarSesion).toHaveBeenCalled();
    });
  });

  describe('Estados', () => {
    describe('Bloqueo de controles', () => {
      test('Debería bloquear los controles', () => {
        store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: true })
        );
        expect(component.procesando).toBeTruthy();
      });
      test('Debería desbloquear los controles', () => {
        store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
        expect(component.procesando).toBeFalsy();
      });
    });
    test('Debería redireccionar a la pagina de inicio configurada', () => {
      jest.spyOn(router, 'navigate');
      store.dispatch(
        SeguridadAcciones.iniciarSesion({
          usuario: {
            usuarioId: 0,
            cuenta: '',
            nombre: '',
            apellido: '',
            nomPublico: '',
            correoElectronico: '',
            fotografia: '',
            token: '',
            tokenExpiracion: null
          }
        })
      );
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
