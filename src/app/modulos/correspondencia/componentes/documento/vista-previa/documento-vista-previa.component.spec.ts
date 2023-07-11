import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoVistaPreviaComponent } from './documento-vista-previa.component';

describe('DocumentoVistaPreviaComponent', () => {
  let component: DocumentoVistaPreviaComponent;
  let fixture: ComponentFixture<DocumentoVistaPreviaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoVistaPreviaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoVistaPreviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
