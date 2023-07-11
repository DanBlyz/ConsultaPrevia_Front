import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoFormularioComponent } from './grupo-formulario.component';

describe('BuzonFormularioComponent', () => {
  let component: GrupoFormularioComponent;
  let fixture: ComponentFixture<GrupoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoFormularioComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
