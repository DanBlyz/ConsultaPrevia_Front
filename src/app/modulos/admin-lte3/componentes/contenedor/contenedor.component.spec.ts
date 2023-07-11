import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { appReducers } from 'src/app/app.reducers';
import { AppState } from 'src/app/app.state';
import { SeguridadModule } from 'src/app/seguridad/seguridad.module';
import { EncabezadoComponent } from '../encabezado/encabezado.component';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { PieComponent } from '../pie/pie.component';
import { UbicacionComponent } from '../ubicacion/ubicacion.component';
import { ContenedorComponent } from './contenedor.component';
import * as ComunAcciones from '../../../../comun/estados/comun.actions';
import Swal from 'sweetalert2';

describe('ContenedorComponent', () => {
  let component: ContenedorComponent;
  let fixture: ComponentFixture<ContenedorComponent>;

  let store: Store<AppState>;
  let spinnerService: NgxSpinnerService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ContenedorComponent,
        EncabezadoComponent,
        MenuLateralComponent,
        UbicacionComponent,
        PieComponent
      ],
      imports: [
        AppRoutingModule,
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        NgxSpinnerModule,
        SeguridadModule
      ],
      providers: [NgxSpinnerService, ToastrService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spinnerService = TestBed.inject(NgxSpinnerService);
    toastrService = TestBed.inject(ToastrService);
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  test('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  /*test('snapshot', () => {
    expect(compiled.innerHTML).toMatchSnapshot();
  });*/

  describe('Métodos', () => {
    //
  });

  describe('Interacción', () => {
    //
  });

  describe('Estados', () => {
    describe('Bloqueo de pantalla', () => {
      test('Debería bloquear la pantalla', () => {
        jest.spyOn(spinnerService, 'show');
        store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: true })
        );
        expect(component.procesando).toBeTruthy();
        expect(spinnerService.show).toHaveBeenCalled();
      });
      test('Debería desbloquear la pantalla', () => {
        jest.spyOn(spinnerService, 'hide');
        store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
        expect(component.procesando).toBeFalsy();
        expect(spinnerService.hide).toHaveBeenCalled();
      });
    });

    describe('Visualizar mensaje', () => {
      test('Debería desplegar un mensaje de éxito', () => {
        jest.spyOn(Swal, 'fire');
        store.dispatch(
          ComunAcciones.establecerRespuesta({
            respuesta: { tipoRespuesta: 'Exito', titulo: '', mensaje: '' }
          })
        );
        expect(Swal.fire).toHaveBeenCalled();
      });
      test('Debería desplegar un mensaje de error', () => {
        jest.spyOn(Swal, 'fire');
        store.dispatch(
          ComunAcciones.establecerRespuesta({
            respuesta: { tipoRespuesta: 'Error', titulo: '', mensaje: '' }
          })
        );
        expect(Swal.fire).toHaveBeenCalled();
      });
      test('Debería desplegar un mensaje de excepción', () => {
        jest.spyOn(Swal, 'fire');
        store.dispatch(
          ComunAcciones.establecerRespuesta({
            respuesta: { tipoRespuesta: 'Excepcion', titulo: '', mensaje: '' }
          })
        );
        expect(Swal.fire).toHaveBeenCalled();
      });
    });

    describe('Visualizar notificación', () => {
      test('Debería desplegar una notificación de éxito', () => {
        jest.spyOn(toastrService, 'success');
        store.dispatch(
          ComunAcciones.establecerNotificacion({
            respuesta: { tipoRespuesta: 'Exito', titulo: '', mensaje: '' }
          })
        );
        expect(toastrService.success).toHaveBeenCalled();
      });
      test('Debería desplegar una notificación de error', () => {
        jest.spyOn(toastrService, 'error');
        store.dispatch(
          ComunAcciones.establecerNotificacion({
            respuesta: { tipoRespuesta: 'Error', titulo: '', mensaje: '' }
          })
        );
        expect(toastrService.error).toHaveBeenCalled();
      });
      test('Debería desplegar una notificación de excepción', () => {
        jest.spyOn(toastrService, 'warning');
        store.dispatch(
          ComunAcciones.establecerNotificacion({
            respuesta: { tipoRespuesta: 'Excepcion', titulo: '', mensaje: '' }
          })
        );
        expect(toastrService.warning).toHaveBeenCalled();
      });
    });
  });
});
