import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaDetalleVerComponent } from './bandeja-detalle-ver.component';

describe('BandejaDetalleVerComponent', () => {
  let component: BandejaDetalleVerComponent;
  let fixture: ComponentFixture<BandejaDetalleVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaDetalleVerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaDetalleVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
