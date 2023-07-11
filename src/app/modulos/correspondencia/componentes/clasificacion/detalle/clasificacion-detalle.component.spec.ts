import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionDetalleComponent } from './clasificacion-detalle.component';

describe('ClasificacionDetalleComponent', () => {
  let component: ClasificacionDetalleComponent;
  let fixture: ComponentFixture<ClasificacionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificacionDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
