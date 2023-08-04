import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoCptListaComponent } from './pago-cpt-lista.component';

describe('PagoCptListaComponent', () => {
  let component: PagoCptListaComponent;
  let fixture: ComponentFixture<PagoCptListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagoCptListaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoCptListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
