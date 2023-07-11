import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoBuscadorComponent } from './documento-buscador.component';

describe('DocumentoBuscadorComponent', () => {
  let component: DocumentoBuscadorComponent;
  let fixture: ComponentFixture<DocumentoBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoBuscadorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
