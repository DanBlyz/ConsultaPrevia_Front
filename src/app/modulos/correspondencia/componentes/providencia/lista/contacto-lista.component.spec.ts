import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidenciaListaComponent } from './providencia-lista.component';

describe('ProvidenciaListaComponent', () => {
  let component: ProvidenciaListaComponent;
  let fixture: ComponentFixture<ProvidenciaListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProvidenciaListaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProvidenciaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
