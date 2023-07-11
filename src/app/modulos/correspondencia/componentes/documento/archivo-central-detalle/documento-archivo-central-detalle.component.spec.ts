import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoArchivoCentralDetalleComponent } from './documento-archivo-central-detalle.component';

describe('DocumentoArchivoCentralDetalleComponent', () => {
  let component: DocumentoArchivoCentralDetalleComponent;
  let fixture: ComponentFixture<DocumentoArchivoCentralDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoArchivoCentralDetalleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoArchivoCentralDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
