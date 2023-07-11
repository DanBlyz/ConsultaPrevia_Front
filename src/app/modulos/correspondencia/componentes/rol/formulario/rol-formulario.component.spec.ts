import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolFormularioComponent } from './rol-formulario.component';

describe('RolFormularioComponent', () => {
  let component: RolFormularioComponent;
  let fixture: ComponentFixture<RolFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolFormularioComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
