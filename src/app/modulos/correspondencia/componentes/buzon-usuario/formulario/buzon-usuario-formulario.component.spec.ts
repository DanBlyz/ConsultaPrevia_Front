import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonUsuarioFormularioComponent } from './buzon-usuario-formulario.component';

describe('BuzonUsuarioFormularioComponent', () => {
  let component: BuzonUsuarioFormularioComponent;
  let fixture: ComponentFixture<BuzonUsuarioFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonUsuarioFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonUsuarioFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
