import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolListaComponent } from './rol-lista.component';

describe('RolListaComponent', () => {
  let component: RolListaComponent;
  let fixture: ComponentFixture<RolListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolListaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
