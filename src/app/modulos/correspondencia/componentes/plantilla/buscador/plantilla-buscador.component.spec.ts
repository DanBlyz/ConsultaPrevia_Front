import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaBuscadorComponent } from './plantilla-buscador.component';

describe('PlantillaBuscadorComponent', () => {
  let component: PlantillaBuscadorComponent;
  let fixture: ComponentFixture<PlantillaBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillaBuscadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
