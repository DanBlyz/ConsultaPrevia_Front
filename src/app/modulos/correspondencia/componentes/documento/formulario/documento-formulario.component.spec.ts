import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoFormularioComponent } from './documento-formulario.component';

describe('DocumentoFormularioComponent', () => {
  let component: DocumentoFormularioComponent;
  let fixture: ComponentFixture<DocumentoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoFormularioComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
