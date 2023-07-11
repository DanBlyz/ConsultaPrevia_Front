import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { appReducers } from 'src/app/app.reducers';
import { AppState } from 'src/app/app.state';
import { SeguridadFacade } from 'src/app/seguridad/fachadas/seguridad.facade';
import { UsuarioAutenticado } from 'src/app/seguridad/modelos/usuario-autenticado.model';
import { CambiarContraseniaComponent } from './cambiar-contrasenia.component';
import * as SeguridadAcciones from '../../../../seguridad/estados/autenticacion.actions';

describe('CambiarContraseniaComponent', () => {
  let component: CambiarContraseniaComponent;
  let fixture: ComponentFixture<CambiarContraseniaComponent>;

  let compiled: HTMLElement;
  let facade: SeguridadFacade;
  let store: Store<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CambiarContraseniaComponent],
      imports: [
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
    fixture = TestBed.createComponent(CambiarContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    compiled = fixture.nativeElement;
    facade = TestBed.inject(SeguridadFacade);
    store = TestBed.inject(Store);
  });

  test('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  /*test('snapshot', () => {
    expect(compiled.innerHTML).toMatchSnapshot();
  });*/

  describe('Métodos', () => {
    describe('actualizar()', () => {
      const usuarioAutenticado: UsuarioAutenticado = {
        usuarioId: null,
        cuenta: '',
        nombre: '',
        apellido: '',
        nomPublico: '',
        correoElectronico: '',
        fotografia: '',
        token: '',
        tokenExpiracion: null
      };
      test('No debería desencadenarse la operación de cambio de contraseña', () => {
        component.usuarioAutenticado = usuarioAutenticado;
        component.formContrasenia.setValue({
          contrasenia: '12346578',
          nuevaContrasenia: '123456789',
          confirmaContrasenia: '123456780'
        });
        jest.spyOn(facade, 'cambiarContrasenia');
        component.actualizar();
        expect(facade.cambiarContrasenia).not.toHaveBeenCalled();
      });
      test('Debería desencadenarse la operación de cambio de contraseña', () => {
        component.usuarioAutenticado = usuarioAutenticado;
        component.formContrasenia.setValue({
          contrasenia: '12346578',
          nuevaContrasenia: '123456789',
          confirmaContrasenia: '123456789'
        });
        jest.spyOn(facade, 'cambiarContrasenia');
        component.actualizar();
        expect(facade.cambiarContrasenia).toHaveBeenCalled();
      });
    });
  });

  describe('Interacción', () => {
    test('Debería actualizarse el formulario reactivo', () => {
      const contrasenia: HTMLInputElement = compiled.querySelector(
        'input[type=password][formControlName=contrasenia]'
      );
      const nuevaContrasenia: HTMLInputElement = compiled.querySelector(
        'input[type=password][formControlName=nuevaContrasenia]'
      );
      const confirmaContrasenia: HTMLInputElement = compiled.querySelector(
        'input[type=password][formControlName=confirmaContrasenia]'
      );

      contrasenia.value = '12345678';
      contrasenia.dispatchEvent(new Event('input'));

      nuevaContrasenia.value = 'adsib';
      nuevaContrasenia.dispatchEvent(new Event('input'));

      confirmaContrasenia.value = 'adsib';
      confirmaContrasenia.dispatchEvent(new Event('input'));

      expect(component.formContrasenia.controls['contrasenia'].value).toBe(
        '12345678'
      );
      expect(component.formContrasenia.controls['nuevaContrasenia'].value).toBe(
        'adsib'
      );
      expect(
        component.formContrasenia.controls['confirmaContrasenia'].value
      ).toBe('adsib');
    });
    test('Debería llamar al método actualizar()', () => {
      const boton: HTMLButtonElement = compiled.querySelector(
        'button[type=submit]'
      );

      jest.spyOn(component, 'actualizar');
      boton.click();
      expect(component.actualizar).toHaveBeenCalled();
    });
  });

  describe('Estados', () => {
    test('Debería cargar al usuario autenticado', () => {
      store.dispatch(
        SeguridadAcciones.iniciarSesion({
          usuario: {
            usuarioId: 0,
            cuenta: 'adsib',
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
      expect(component.usuarioAutenticado.cuenta).toBe('adsib');
    });
  });
});
