import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroFormularioComponent } from './parametro-formulario.component';

describe('ParametroFormularioComponent', () => {
  let component: ParametroFormularioComponent;
  let fixture: ComponentFixture<ParametroFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametroFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametroFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
