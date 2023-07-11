import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoBuscadorComponent } from './grupo-buscador.component';

describe('GrupoBuscadorComponent', () => {
  let component: GrupoBuscadorComponent;
  let fixture: ComponentFixture<GrupoBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoBuscadorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
