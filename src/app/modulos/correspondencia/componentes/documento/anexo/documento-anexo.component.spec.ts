import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoAnexoComponent } from './documento-anexo.component';

describe('DocumentoAnexoComponent', () => {
  let component: DocumentoAnexoComponent;
  let fixture: ComponentFixture<DocumentoAnexoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoAnexoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoAnexoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
