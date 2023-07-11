import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonFormularioComponent } from './buzon-formulario.component';

describe('BuzonFormularioComponent', () => {
  let component: BuzonFormularioComponent;
  let fixture: ComponentFixture<BuzonFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
