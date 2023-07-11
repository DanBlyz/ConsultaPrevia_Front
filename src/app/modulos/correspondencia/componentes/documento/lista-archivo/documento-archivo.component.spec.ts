import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoArchivoComponent } from './documento-archivo.component';

describe('DocumentoArchivoComponent', () => {
  let component: DocumentoArchivoComponent;
  let fixture: ComponentFixture<DocumentoArchivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoArchivoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
