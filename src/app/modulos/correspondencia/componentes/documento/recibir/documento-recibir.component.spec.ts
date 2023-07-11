import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoRecibirComponent } from './documento-recibir.component';

describe('DocumentoEnviarComponent', () => {
  let component: DocumentoRecibirComponent;
  let fixture: ComponentFixture<DocumentoRecibirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoRecibirComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoRecibirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
