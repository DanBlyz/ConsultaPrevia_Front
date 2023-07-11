import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoRespaldoComponent } from './documento-respaldo.component';

describe('DocumentoRespaldoComponent', () => {
  let component: DocumentoRespaldoComponent;
  let fixture: ComponentFixture<DocumentoRespaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoRespaldoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoRespaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
