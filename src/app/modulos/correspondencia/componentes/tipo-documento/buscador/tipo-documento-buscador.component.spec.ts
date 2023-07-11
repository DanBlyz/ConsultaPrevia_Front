import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDocumentoBuscadorComponent } from './tipo-documento-buscador.component';

describe('TipoDocumentoBuscadorComponent', () => {
  let component: TipoDocumentoBuscadorComponent;
  let fixture: ComponentFixture<TipoDocumentoBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoDocumentoBuscadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDocumentoBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
