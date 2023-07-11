import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaDetalleArchivarComponent } from './bandeja-detalle-archivar.component';

describe('BandejaDetalleArchivarComponent', () => {
  let component: BandejaDetalleArchivarComponent;
  let fixture: ComponentFixture<BandejaDetalleArchivarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaDetalleArchivarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaDetalleArchivarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
