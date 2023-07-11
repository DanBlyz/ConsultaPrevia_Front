import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionListaComponent } from './clasificacion-lista.component';

describe('ClasificacionListaComponent', () => {
  let component: ClasificacionListaComponent;
  let fixture: ComponentFixture<ClasificacionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClasificacionListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasificacionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
