import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarContraseniaComponent } from './recuperar-contrasenia.component';

describe('RecuperarContraseniaComponent', () => {
  let component: RecuperarContraseniaComponent;
  let fixture: ComponentFixture<RecuperarContraseniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarContraseniaComponent],
      imports: [],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarContraseniaComponent);
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
