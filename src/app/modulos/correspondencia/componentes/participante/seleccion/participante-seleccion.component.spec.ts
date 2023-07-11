import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipanteSeleccionComponent } from './participante-seleccion.component';

describe('ParticipanteSeleccionComponent', () => {
  let component: ParticipanteSeleccionComponent;
  let fixture: ComponentFixture<ParticipanteSeleccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipanteSeleccionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipanteSeleccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
