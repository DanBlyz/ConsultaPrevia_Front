import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonDetalleComponent } from './buzon-detalle.component';

describe('BuzonDetalleComponent', () => {
  let component: BuzonDetalleComponent;
  let fixture: ComponentFixture<BuzonDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
