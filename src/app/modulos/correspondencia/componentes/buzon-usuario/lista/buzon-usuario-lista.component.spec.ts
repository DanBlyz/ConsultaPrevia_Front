import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonUsuarioListaComponent } from './buzon-usuario-lista.component';

describe('BuzonUsuarioListaComponent', () => {
  let component: BuzonUsuarioListaComponent;
  let fixture: ComponentFixture<BuzonUsuarioListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonUsuarioListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonUsuarioListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
