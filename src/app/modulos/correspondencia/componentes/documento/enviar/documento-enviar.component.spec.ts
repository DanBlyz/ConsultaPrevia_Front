import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoEnviarComponent } from './documento-enviar.component';

describe('DocumentoEnviarComponent', () => {
  let component: DocumentoEnviarComponent;
  let fixture: ComponentFixture<DocumentoEnviarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoEnviarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoEnviarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
