import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionListaComponent } from './notificacion-lista.component';

describe('NotificacionListaComponent', () => {
  let component: NotificacionListaComponent;
  let fixture: ComponentFixture<NotificacionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificacionListaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
