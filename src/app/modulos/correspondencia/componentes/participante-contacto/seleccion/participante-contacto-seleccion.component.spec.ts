import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipanteContactoSeleccionComponent } from './participante-contacto-seleccion.component';

describe('ParticipanteContactoSeleccionComponent', () => {
  let component: ParticipanteContactoSeleccionComponent;
  let fixture: ComponentFixture<ParticipanteContactoSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipanteContactoSeleccionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipanteContactoSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
