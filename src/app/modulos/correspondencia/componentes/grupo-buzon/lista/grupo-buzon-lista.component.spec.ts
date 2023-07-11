import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoBuzonListaComponent } from './grupo-buzon-lista.component';

describe('GrupoBuzonListaComponent', () => {
  let component: GrupoBuzonListaComponent;
  let fixture: ComponentFixture<GrupoBuzonListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrupoBuzonListaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoBuzonListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
