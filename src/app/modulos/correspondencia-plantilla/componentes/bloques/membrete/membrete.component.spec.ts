import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembreteComponent } from './membrete.component';

describe('MembreteComponent', () => {
  let component: MembreteComponent;
  let fixture: ComponentFixture<MembreteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MembreteComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MembreteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
