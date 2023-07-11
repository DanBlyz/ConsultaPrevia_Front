import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaDetalleComponent } from './plantilla-detalle.component';

describe('PlantillaDetalleComponent', () => {
  let component: PlantillaDetalleComponent;
  let fixture: ComponentFixture<PlantillaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillaDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
