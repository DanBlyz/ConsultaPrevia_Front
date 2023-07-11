import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaArchivadoComponent } from './bandeja-archivado.component';

describe('BandejaArchivadoComponent', () => {
  let component: BandejaArchivadoComponent;
  let fixture: ComponentFixture<BandejaArchivadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaArchivadoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaArchivadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
