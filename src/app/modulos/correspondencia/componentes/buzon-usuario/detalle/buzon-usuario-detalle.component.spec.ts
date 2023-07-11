import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonUsuarioDetalleComponent } from './buzon-usuario-detalle.component';

describe('BuzonUsuarioDetalleComponent', () => {
  let component: BuzonUsuarioDetalleComponent;
  let fixture: ComponentFixture<BuzonUsuarioDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonUsuarioDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonUsuarioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
