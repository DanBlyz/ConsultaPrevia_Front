import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaBuscadorComponent } from './bandeja-buscador.component';

describe('BandejaBuscadorComponent', () => {
  let component: BandejaBuscadorComponent;
  let fixture: ComponentFixture<BandejaBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaBuscadorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
