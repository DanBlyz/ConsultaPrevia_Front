import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActoAdministrativoListaComponent } from './acto-administrativo-lista.component';

describe('ActoAdministrativoListaComponent', () => {
  let component: ActoAdministrativoListaComponent;
  let fixture: ComponentFixture<ActoAdministrativoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActoAdministrativoListaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActoAdministrativoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
