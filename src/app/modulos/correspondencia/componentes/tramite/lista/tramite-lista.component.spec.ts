import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramiteListaComponent } from './tramite-lista.component';

describe('TramiteListaComponent', () => {
  let component: TramiteListaComponent;
  let fixture: ComponentFixture<TramiteListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TramiteListaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TramiteListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
