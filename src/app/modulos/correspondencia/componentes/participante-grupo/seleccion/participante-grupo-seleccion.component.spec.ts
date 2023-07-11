import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipanteGrupoSeleccionComponent } from './participante-grupo-seleccion.component';

describe('ParticipanteGrupoSeleccionComponent', () => {
  let component: ParticipanteGrupoSeleccionComponent;
  let fixture: ComponentFixture<ParticipanteGrupoSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipanteGrupoSeleccionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipanteGrupoSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
