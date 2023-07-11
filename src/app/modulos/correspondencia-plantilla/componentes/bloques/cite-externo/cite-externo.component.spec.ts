import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CiteExternoComponent } from './cite-externo.component';

describe('CiteExternoComponent', () => {
  let component: CiteExternoComponent;
  let fixture: ComponentFixture<CiteExternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CiteExternoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CiteExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
