import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajeListaComponent } from './viaje-lista.component';

describe('ViajeListaComponent', () => {
  let component: ViajeListaComponent;
  let fixture: ComponentFixture<ViajeListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViajeListaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ViajeListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
