import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaDetalleDerivarComponent } from './bandeja-detalle-derivar.component';

describe('BandejaDetalleDerivarComponent', () => {
  let component: BandejaDetalleDerivarComponent;
  let fixture: ComponentFixture<BandejaDetalleDerivarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaDetalleDerivarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaDetalleDerivarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
