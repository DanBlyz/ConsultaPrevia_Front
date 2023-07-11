import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoAprobarComponent } from './documento-aprobar.component';

describe('DocumentoAprobarComponent', () => {
  let component: DocumentoAprobarComponent;
  let fixture: ComponentFixture<DocumentoAprobarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoAprobarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoAprobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
