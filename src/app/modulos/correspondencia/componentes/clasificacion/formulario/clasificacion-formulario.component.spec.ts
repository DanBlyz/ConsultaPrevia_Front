import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionFormularioComponent } from './clasificacion-formulario.component';

describe('ClasificacionFormularioComponent', () => {
  let component: ClasificacionFormularioComponent;
  let fixture: ComponentFixture<ClasificacionFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificacionFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificacionFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
