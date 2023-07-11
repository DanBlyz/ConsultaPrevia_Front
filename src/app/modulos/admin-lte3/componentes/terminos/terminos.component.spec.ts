import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TerminosComponent } from './terminos.component';

describe('TerminosComponent', () => {
  let component: TerminosComponent;
  let fixture: ComponentFixture<TerminosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerminosComponent],
      imports: [AppRoutingModule],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  /*test('snapshot', () => {
    expect(compiled.innerHTML).toMatchSnapshot();
  });*/
});
