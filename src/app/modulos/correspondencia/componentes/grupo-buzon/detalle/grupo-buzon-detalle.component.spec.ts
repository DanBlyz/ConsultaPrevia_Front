import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoBuzonDetalleComponent } from './grupo-buzon-detalle.component';

describe('GrupoBuzonDetalleComponent', () => {
  let component: GrupoBuzonDetalleComponent;
  let fixture: ComponentFixture<GrupoBuzonDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoBuzonDetalleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoBuzonDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
