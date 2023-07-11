import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { appReducers } from 'src/app/app.reducers';
import { AppState } from 'src/app/app.state';
import { SeguridadFacade } from 'src/app/seguridad/fachadas/seguridad.facade';
import { UsuarioAutenticado } from 'src/app/seguridad/modelos/usuario-autenticado.model';
import { PerfilComponent } from './perfil.component';
import * as SeguridadAcciones from '../../../../seguridad/estados/autenticacion.actions';
import { CambiarContraseniaComponent } from '../cambiar-contrasenia/cambiar-contrasenia.component';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;

  let compiled: HTMLElement;
  let facade: SeguridadFacade;
  let store: Store<AppState>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilComponent, CambiarContraseniaComponent],
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
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    component.usuarioAutenticado = usuarioAutenticado;
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
      test('No debería desencadenarse la operación de actualización de perfil', () => {
        component.usuarioAutenticado = usuarioAutenticado;
        component.formPerfil.setValue({
          nombre: 'Juan',
          apellido: 'Perez',
          nomPublico: 'Juan Perez',
          correoElectronico: ''
        });
        jest.spyOn(facade, 'actualizar');
        component.actualizar();
        expect(facade.actualizar).not.toHaveBeenCalled();
      });
      test('Debería desencadenarse la operación de actualización de perfil', () => {
        component.usuarioAutenticado = usuarioAutenticado;
        component.formPerfil.setValue({
          nombre: 'Juan',
          apellido: 'Perez',
          nomPublico: 'Juan Perez',
          correoElectronico: 'juan.perez@ciudadanocomun.bo'
        });
        jest.spyOn(facade, 'actualizar');
        component.actualizar();
        expect(facade.actualizar).toHaveBeenCalled();
      });
    });
  });

  describe('Interacción', () => {
    test('Debería actualizarse el formulario reactivo', () => {
      const correoElectronico: HTMLInputElement = compiled.querySelector(
        'input[type=email][formControlName=correoElectronico]'
      );

      correoElectronico.value = 'juan.perez@ciudadanocomun.bo';
      correoElectronico.dispatchEvent(new Event('input'));

      expect(component.formPerfil.controls['correoElectronico'].value).toBe(
        'juan.perez@ciudadanocomun.bo'
      );
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
            cuenta: '',
            nombre: '',
            apellido: '',
            nomPublico: '',
            correoElectronico: 'juan.perez@ciudadanocomun.bo',
            fotografia: '',
            token: '',
            tokenExpiracion: null
          }
        })
      );
      expect(component.usuarioAutenticado.correoElectronico).toBe(
        'juan.perez@ciudadanocomun.bo'
      );
      expect(component.formPerfil.controls['correoElectronico'].value).toBe(
        'juan.perez@ciudadanocomun.bo'
      );
    });
  });
});
