import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonBuscadorComponent } from './buzon-buscador.component';

describe('BuzonBuscadorComponent', () => {
  let component: BuzonBuscadorComponent;
  let fixture: ComponentFixture<BuzonBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonBuscadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
