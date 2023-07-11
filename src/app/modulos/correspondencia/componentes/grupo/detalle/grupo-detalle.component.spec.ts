import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoDetalleComponent } from './grupo-detalle.component';

describe('BuzonDetalleComponent', () => {
  let component: GrupoDetalleComponent;
  let fixture: ComponentFixture<GrupoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoDetalleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
