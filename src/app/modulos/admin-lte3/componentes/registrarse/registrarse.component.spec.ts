import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { appReducers } from 'src/app/app.reducers';
import { AppState } from 'src/app/app.state';
import { SeguridadFacade } from 'src/app/seguridad/fachadas/seguridad.facade';
import { RegistrarseComponent } from './registrarse.component';
import * as ComunAcciones from '../../../../comun/estados/comun.actions';
import { environment } from 'src/environments/environment';

describe('RegistrarseComponent', () => {
  let component: RegistrarseComponent;
  let fixture: ComponentFixture<RegistrarseComponent>;

  let compiled: HTMLElement;
  let facade: SeguridadFacade;
  let store: Store<AppState>;

  let env: any;

  beforeAll(() => {
    env = { ...environment };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarseComponent],
      imports: [
        AppRoutingModule,
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [SeguridadFacade]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    compiled = fixture.nativeElement;
    facade = TestBed.inject(SeguridadFacade);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    environment.apiAutenticacion = { ...env.apiAutenticacion };
  });

  test('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  /*test('snapshot', () => {
    expect(compiled.innerHTML).toMatchSnapshot();
  });*/

  test('Debería crearse el componente (permiteRegistrarse)', () => {
    environment.apiAutenticacion['registro'] = {
      roles: ['DEMO']
    };
    const fixture = TestBed.createComponent(RegistrarseComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.permiteRegistrarse).toBeTruthy();
  });

  test('Debería crearse el componente (terminosObligatorios)', () => {
    environment.apiAutenticacion['registro'] = {
      terminosObligatorios: true
    };
    const fixture = TestBed.createComponent(RegistrarseComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.terminosObligatorios).toBeTruthy();
    const terminos = compiled.querySelector(
      'input[type=checkbox][formControlName=terminos]'
    );
    expect(terminos).toBeDefined();
  });

  describe('Métodos', () => {
    describe('restablecerContrasenia()', () => {
      test('Debería variarse el valor de confirmaContrasenia del formulario reactivo', () => {
        component.formRegistro.setValue({
          cuenta: 'adsib',
          contrasenia: 'adsib',
          confirmaContrasenia: 'adsib',
          nomPublico: 'ADSIB',
          correoElectronico: 'uid@adsib.gob.bo',
          terminos: false,
          roles: null
        });
        component.reestablecerContrasenia();
        expect(
          component.formRegistro.controls['confirmaContrasenia'].value
        ).toBe('');
      });
    });
    describe('registrarse()', () => {
      test('No debería desencadenarse la operación de registrar cuenta', () => {
        component.formRegistro.setValue({
          cuenta: 'adsib',
          contrasenia: 'adsib',
          confirmaContrasenia: '12345678',
          nomPublico: 'ADSIB',
          correoElectronico: 'uid@adsib.gob.bo',
          terminos: false,
          roles: null
        });
        jest.spyOn(facade, 'registrarse');
        component.registrarse();
        expect(facade.registrarse).not.toHaveBeenCalled();
      });
      test('Debería desencadenarse la operación de registrar cuenta', () => {
        component.formRegistro.setValue({
          cuenta: 'adsib',
          contrasenia: 'adsib',
          confirmaContrasenia: 'adsib',
          nomPublico: 'ADSIB',
          correoElectronico: 'uid@adsib.gob.bo',
          terminos: false,
          roles: null
        });
        jest.spyOn(facade, 'registrarse').mockResolvedValue(true);
        component.registrarse();
        expect(facade.registrarse).toHaveBeenCalled();
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

      expect(component.formRegistro.controls['correoElectronico'].value).toBe(
        'juan.perez@ciudadanocomun.bo'
      );
    });
    test('Debería llamar al método restablecerContrasenia()', () => {
      component.formRegistro.setValue({
        cuenta: 'adsib',
        contrasenia: 'adsib',
        confirmaContrasenia: '12345678',
        nomPublico: 'ADSIB',
        correoElectronico: 'uid@adsib.gob.bo',
        terminos: false,
        roles: null
      });
      const contrasenia: HTMLInputElement = compiled.querySelector(
        'input[type=password][formControlName=contrasenia]'
      );
      contrasenia.value = 'adsib';
      contrasenia.dispatchEvent(new Event('input'));

      expect(component.formRegistro.controls['confirmaContrasenia'].value).toBe(
        ''
      );
    });
    test('Debería llamar al método registrarse()', () => {
      const boton: HTMLButtonElement = compiled.querySelector(
        'button[type=submit]'
      );

      jest.spyOn(component, 'registrarse');
      boton.click();
      expect(component.registrarse).toHaveBeenCalled();
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
  });
});
