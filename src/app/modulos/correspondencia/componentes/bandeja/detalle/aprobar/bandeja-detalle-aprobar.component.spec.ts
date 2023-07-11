import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaDetalleAprobarComponent } from './bandeja-detalle-aprobar.component';

describe('BandejaDetalleAprobarComponent', () => {
  let component: BandejaDetalleAprobarComponent;
  let fixture: ComponentFixture<BandejaDetalleAprobarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaDetalleAprobarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaDetalleAprobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
