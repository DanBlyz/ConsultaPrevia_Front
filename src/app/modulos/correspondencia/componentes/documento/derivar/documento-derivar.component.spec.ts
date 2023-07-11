import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoDerivarComponent } from './documento-derivar.component';

describe('DocumentoDerivarComponent', () => {
  let component: DocumentoDerivarComponent;
  let fixture: ComponentFixture<DocumentoDerivarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoDerivarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoDerivarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
