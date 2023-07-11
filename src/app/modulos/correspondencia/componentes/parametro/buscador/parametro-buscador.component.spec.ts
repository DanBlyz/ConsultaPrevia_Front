import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroBuscadorComponent } from './parametro-buscador.component';

describe('ParametroBuscadorComponent', () => {
  let component: ParametroBuscadorComponent;
  let fixture: ComponentFixture<ParametroBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametroBuscadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametroBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
