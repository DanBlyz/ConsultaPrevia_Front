import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolucionListaComponent } from './resolucion-lista.component';

describe('ResolucionListaComponent', () => {
  let component: ResolucionListaComponent;
  let fixture: ComponentFixture<ResolucionListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResolucionListaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResolucionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
