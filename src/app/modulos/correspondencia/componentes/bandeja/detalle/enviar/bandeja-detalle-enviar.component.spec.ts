import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaDetalleEnviarComponent } from './bandeja-detalle-enviar.component';

describe('BandejaDetalleEnviarComponent', () => {
  let component: BandejaDetalleEnviarComponent;
  let fixture: ComponentFixture<BandejaDetalleEnviarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaDetalleEnviarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaDetalleEnviarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
