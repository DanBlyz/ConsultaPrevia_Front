import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaBorradorComponent } from './bandeja-borrador.component';

describe('BandejaBorradorComponent', () => {
  let component: BandejaBorradorComponent;
  let fixture: ComponentFixture<BandejaBorradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaBorradorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaBorradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
