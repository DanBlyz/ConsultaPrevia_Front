import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Paginado } from '../../modelos/paginado.model';
import { PaginadorComponent } from './paginador.component';

describe('PaginadorComponent', () => {
  let component: PaginadorComponent;
  let fixture: ComponentFixture<PaginadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PaginadorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.valores = new Paginado(100, 10, 10, 1);
  });

  test('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  /*test('snapshot', () => {
    expect(compiled).toMatchSnapshot();
  });*/

  describe('Métodos', () => {
    describe('ejecutarAccion()', () => {
      test('Debería ir a la primera página', () => {
        component.ejecutarAccion('primero');
        expect(component.paginaActual).toBe(1);
      });
      test('Debería ir a la página anterior (de manera circular)', () => {
        component.ejecutarAccion('anterior');
        expect(component.paginaActual).toBe(10);
        component.ejecutarAccion('anterior');
        expect(component.paginaActual).toBe(9);
      });
      test('Debería ir a la página siguiente (de manera circular)', () => {
        component.ejecutarAccion('siguiente');
        expect(component.paginaActual).toBe(2);
        component.ejecutarAccion('siguiente');
        expect(component.paginaActual).toBe(3);
        component.ejecutarAccion('siguiente');
        expect(component.paginaActual).toBe(4);
        component.paginaActual = 9;
        component.ejecutarAccion('siguiente');
        expect(component.paginaActual).toBe(10);
        component.ejecutarAccion('siguiente');
        expect(component.paginaActual).toBe(1);
      });
      test('Debería ir a la última página', () => {
        component.ejecutarAccion('ultimo');
        expect(component.paginaActual).toBe(10);
      });
      test('Debería ir a la primera página y actualizar el número de páginas disponibles', () => {
        component.ejecutarAccion('actualizar');
        expect(component.totalPaginas).toBe(10);
        expect(component.paginaActual).toBe(1);
      });
    });
    describe('ajustarRegistrosPorPagina()', () => {
      test('Debería cambiar la cantidad de registro por página e ir a la primera página', () => {
        component.registrosPorPaginaSeleccionado = 20;
        component.ajustarRegistrosPorPagina();
        expect(component.totalPaginas).toBe(5);
        expect(component.paginaActual).toBe(1);
      });
    });
    describe('actualizarPaginador()', () => {
      test('Debería ir a la primera página y actualizar el número de páginas disponibles', () => {
        component.registrosPorPagina = 30;
        component.actualizarPaginador();
        expect(component.totalPaginas).toBe(4);
        expect(component.paginaActual).toBe(1);
      });
    });
    describe('reiniciarPaginador()', () => {
      test('Debería ir a la primera página', () => {
        component.reiniciarPaginador();
        expect(component.paginaActual).toBe(1);
      });
    });
  });

  describe('Interacción', () => {
    test('Debería obtener el valor por defecto de 10', () => {
      expect(component.registroInicial).toBe(10);
    });
    test('Debería establecer valores individuales del paginador', () => {
      component.valores = new Paginado(200, 10, 10, 1);
      expect(component.totalRegistros).toBe(200);
      expect(component.registrosPorPagina).toBe(10);
      expect(component.totalPaginas).toBe(10);
      expect(component.paginaActual).toBe(1);
    });
  });

  describe('Estados', () => {
    //
  });
});
