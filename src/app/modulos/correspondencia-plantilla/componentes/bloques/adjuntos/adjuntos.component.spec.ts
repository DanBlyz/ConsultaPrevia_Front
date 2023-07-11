import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenciaFinalComponent } from './adjuntos.component';

describe('ReferenciasFinalesComponent', () => {
  let component: ReferenciaFinalComponent;
  let fixture: ComponentFixture<ReferenciaFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenciaFinalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenciaFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
