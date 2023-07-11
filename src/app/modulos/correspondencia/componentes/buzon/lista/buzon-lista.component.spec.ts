import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzonListaComponent } from './buzon-lista.component';

describe('BuzonListaComponent', () => {
  let component: BuzonListaComponent;
  let fixture: ComponentFixture<BuzonListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzonListaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuzonListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
