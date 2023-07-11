import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolDetalleComponent } from './rol-detalle.component';

describe('RolDetalleComponent', () => {
  let component: RolDetalleComponent;
  let fixture: ComponentFixture<RolDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolDetalleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
