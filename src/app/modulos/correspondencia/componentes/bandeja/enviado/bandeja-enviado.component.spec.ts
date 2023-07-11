import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaEnviadoComponent } from './bandeja-enviado.component';

describe('BandejaEnviadoComponent', () => {
  let component: BandejaEnviadoComponent;
  let fixture: ComponentFixture<BandejaEnviadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BandejaEnviadoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaEnviadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
