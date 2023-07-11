import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoSeguimientoComponent } from './documento-seguimiento.component';

describe('DocumentoSeguimientoComponent', () => {
  let component: DocumentoSeguimientoComponent;
  let fixture: ComponentFixture<DocumentoSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentoSeguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
