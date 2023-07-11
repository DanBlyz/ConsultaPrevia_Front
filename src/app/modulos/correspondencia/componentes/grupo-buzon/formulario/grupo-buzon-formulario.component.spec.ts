import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoBuzonFormularioComponent } from './grupo-buzon-formulario.component';

describe('GrupoBuzonFormularioComponent', () => {
  let component: GrupoBuzonFormularioComponent;
  let fixture: ComponentFixture<GrupoBuzonFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoBuzonFormularioComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoBuzonFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
