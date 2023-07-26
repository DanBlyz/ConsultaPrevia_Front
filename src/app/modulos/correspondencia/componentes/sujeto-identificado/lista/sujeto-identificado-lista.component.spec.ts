import { ComponentFixture, TestBed } from '@angular/core/testing';

import {SujetoIdentificadoListaComponent } from './sujeto-identificado-lista.component';

describe('SujetoIdentificadoListaComponent', () => {
  let component:SujetoIdentificadoListaComponent;
  let fixture: ComponentFixture<SujetoIdentificadoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SujetoIdentificadoListaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SujetoIdentificadoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
