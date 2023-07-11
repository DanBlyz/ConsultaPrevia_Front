import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametroListaComponent } from './parametro-lista.component';

describe('ParametroListaComponent', () => {
  let component: ParametroListaComponent;
  let fixture: ComponentFixture<ParametroListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametroListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametroListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
