import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoArchivoDetalleComponent } from './documento-archivo-detalle.component';

describe('DocumentoArchivoDetalleComponent', () => {
  let component: DocumentoArchivoDetalleComponent;
  let fixture: ComponentFixture<DocumentoArchivoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoArchivoDetalleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoArchivoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
