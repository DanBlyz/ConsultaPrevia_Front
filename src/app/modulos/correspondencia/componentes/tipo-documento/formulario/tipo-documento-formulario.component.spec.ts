import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDocumentoFormularioComponent } from './tipo-documento-formulario.component';

describe('TipoDocumentoFormularioComponent', () => {
  let component: TipoDocumentoFormularioComponent;
  let fixture: ComponentFixture<TipoDocumentoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoDocumentoFormularioComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDocumentoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
