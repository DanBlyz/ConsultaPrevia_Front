import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolBuscadorComponent } from './rol-buscador.component';

describe('RolBuscadorComponent', () => {
  let component: RolBuscadorComponent;
  let fixture: ComponentFixture<RolBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolBuscadorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
