import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoArchivoCentralComponent } from './documento-archivo-central.component';

describe('DocumentoArchivoCentralComponent', () => {
  let component: DocumentoArchivoCentralComponent;
  let fixture: ComponentFixture<DocumentoArchivoCentralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoArchivoCentralComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoArchivoCentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
