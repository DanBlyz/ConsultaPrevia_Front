import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspacioComponent } from './espacio.component';

describe('EspacioComponent', () => {
  let component: EspacioComponent;
  let fixture: ComponentFixture<EspacioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EspacioComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspacioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
