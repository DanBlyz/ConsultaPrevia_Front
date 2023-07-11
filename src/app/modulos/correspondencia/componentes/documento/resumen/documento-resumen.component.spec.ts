import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoResumenComponent } from './documento-resumen.component';

describe('DocumentoResumenComponent', () => {
  let component: DocumentoResumenComponent;
  let fixture: ComponentFixture<DocumentoResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoResumenComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
