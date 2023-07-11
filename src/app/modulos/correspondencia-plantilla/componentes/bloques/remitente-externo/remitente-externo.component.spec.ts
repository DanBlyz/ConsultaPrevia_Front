import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitenteExternoComponent } from './remitente-externo.component';

describe('RemitenteExternoComponent', () => {
  let component: RemitenteExternoComponent;
  let fixture: ComponentFixture<RemitenteExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemitenteExternoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitenteExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
