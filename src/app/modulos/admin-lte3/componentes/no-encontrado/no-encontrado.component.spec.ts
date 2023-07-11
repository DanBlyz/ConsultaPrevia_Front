import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoEncontradoComponent } from './no-encontrado.component';

describe('NoEncontradoComponent', () => {
  let component: NoEncontradoComponent;
  let fixture: ComponentFixture<NoEncontradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoEncontradoComponent],
      imports: [],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoEncontradoComponent);
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
