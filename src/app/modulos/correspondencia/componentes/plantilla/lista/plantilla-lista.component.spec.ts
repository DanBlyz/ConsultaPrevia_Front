import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaListaComponent } from './plantilla-lista.component';

describe('PlantillaListaComponent', () => {
  let component: PlantillaListaComponent;
  let fixture: ComponentFixture<PlantillaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantillaListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
