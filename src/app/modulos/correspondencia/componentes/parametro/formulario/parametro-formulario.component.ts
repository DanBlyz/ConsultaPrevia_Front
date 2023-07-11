import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FuncionesHelper } from 'src/app/comun/auxiliares';
import { ParametroFacade } from '../../../fachadas';
import { Parametro } from '../../../modelos';

@Component({
  selector: 'app-correspondencia-parametro-formulario',
  templateUrl: './parametro-formulario.component.html',
  styles: []
})
export class ParametroFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formParametro: FormGroup;
  botonOperacion: string;

  parametro: Parametro;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private parametroFacade: ParametroFacade,
    private toastrService: ToastrService
  ) {
    if (!this.parametro) {
      this.parametro = new Parametro();
    }

    this.formParametro = this.fb.group({
      tipo: ['', Validators.required],
      orden: ['', Validators.required],
      valor: ['', Validators.required],
      texto: ['', Validators.required],
      estaActivo: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.parametroFacade.CorrespondenciaState$.subscribe(({ parametro }) => {
        if (parametro) {
          this.parametro = parametro;
          if (this.tipoOperacion === 'modificar' && this.parametro.id) {
            this.formParametro.setValue({
              tipo: this.parametro.tipo,
              orden: this.parametro.orden,
              valor: this.parametro.valor,
              texto: this.parametro.texto,
              estaActivo: this.parametro.estaActivo
            });
          }
        }
      })
    );

    switch (this.tipoOperacion) {
      case 'crear':
        this.botonOperacion = 'Guardar';
        break;
      case 'modificar':
        this.botonOperacion = 'Modificar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let parametro = new Parametro();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formParametro);
        if (!this.formParametro.valid) {
          this.formParametro.markAllAsTouched();
          return;
        }
        parametro = { ...this.formParametro.value };
        delete parametro.estaActivo;
        this.accion.emit({
          accion: 'guardar',
          parametro
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formParametro);
        if (!this.formParametro.valid) {
          this.formParametro.markAllAsTouched();
          return;
        }
        parametro = { ...this.formParametro.value };
        this.accion.emit({
          accion,
          parametroId: this.parametro.id,
          parametro
        });
        break;
      }
      case 'cancelar': {
        this.accion.emit({
          accion
        });
        break;
      }
    }
  }
}
