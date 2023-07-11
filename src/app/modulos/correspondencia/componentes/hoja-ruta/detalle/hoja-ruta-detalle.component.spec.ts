import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaRutaDetalleComponent } from './hoja-ruta-detalle.component';

describe('HojaRutaDetalleComponent', () => {
  let component: HojaRutaDetalleComponent;
  let fixture: ComponentFixture<HojaRutaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HojaRutaDetalleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HojaRutaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
