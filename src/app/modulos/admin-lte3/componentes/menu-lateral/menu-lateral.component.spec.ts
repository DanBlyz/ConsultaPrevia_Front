import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { appReducers } from 'src/app/app.reducers';
import { AppState } from 'src/app/app.state';
import { MenuLateralComponent } from './menu-lateral.component';
import * as SeguridadAcciones from '../../../../seguridad/estados/autenticacion.actions';

describe('MenuLateralComponent', () => {
  let component: MenuLateralComponent;
  let fixture: ComponentFixture<MenuLateralComponent>;

  let store: Store<AppState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuLateralComponent],
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
    fixture = TestBed.createComponent(MenuLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
  });

  test('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  /*test('snapshot', () => {
    expect(compiled.innerHTML).toMatchSnapshot();
  });*/

  describe('Métodos', () => {
    describe('obtenerMenu()', () => {
      test('Debería devolver la estructura del menu principal', () => {
        const menu = component.obtenerMenu([]);
        expect(menu).toBeDefined();
      });
    });
  });

  describe('Interacción', () => {
    //
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
