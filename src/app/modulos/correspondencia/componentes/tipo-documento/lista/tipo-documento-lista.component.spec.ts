import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDocumentoListaComponent } from './tipo-documento-lista.component';

describe('TipoDocumentoListaComponent', () => {
  let component: TipoDocumentoListaComponent;
  let fixture: ComponentFixture<TipoDocumentoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoDocumentoListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoDocumentoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
