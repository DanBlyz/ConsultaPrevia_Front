import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroDetalleComponent } from './parametro-detalle.component';

describe('ParametroDetalleComponent', () => {
  let component: ParametroDetalleComponent;
  let fixture: ComponentFixture<ParametroDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametroDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametroDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
