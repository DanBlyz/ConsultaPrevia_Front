import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDocumentoDetalleComponent } from './tipo-documento-detalle.component';

describe('TipoDocumentoDetalleComponent', () => {
  let component: TipoDocumentoDetalleComponent;
  let fixture: ComponentFixture<TipoDocumentoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoDocumentoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDocumentoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
