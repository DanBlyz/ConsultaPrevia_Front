import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaRutaVincularComponent } from './hoja-ruta-vincular.component';

describe('HojaRutaVincularComponent', () => {
  let component: HojaRutaVincularComponent;
  let fixture: ComponentFixture<HojaRutaVincularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HojaRutaVincularComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HojaRutaVincularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
