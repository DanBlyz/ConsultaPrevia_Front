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

import { SujetoIdentificado } from '../../../modelos';
import { SujetoIdentificadoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-sujeto-identificado-formulario',
  templateUrl: './sujeto-identificado-formulario.component.html',
  styles: []
})
export class SujetoIdentificadoFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formSujetoIdentificado: FormGroup;
  botonOperacion: string;

  sujetoIdentificado: SujetoIdentificado;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private sujetoIdentificadoFacade: SujetoIdentificadoFacade,
    private toastrService: ToastrService
  ) {
    if (!this.sujetoIdentificado) {
      this.sujetoIdentificado = new SujetoIdentificado();
    }

    this.formSujetoIdentificado = this.fb.group({
      comunidad: ['', Validators.required],
      autoridad: ['', Validators.required],
      telefono: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.sujetoIdentificadoFacade.CorrespondenciaState$.subscribe(({ sujetoIdentificado }) => {
        if (sujetoIdentificado) {
          this.sujetoIdentificado = sujetoIdentificado;
          if (this.tipoOperacion === 'modificar' && this.sujetoIdentificado.id) {
            this.formSujetoIdentificado.setValue({
              comunidad: this.sujetoIdentificado.comunidad,
              autoridad: this.sujetoIdentificado.autoridad,
              telefono: this.sujetoIdentificado.telefono
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
    let sujetoIdentificado = new SujetoIdentificado();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formSujetoIdentificado);
        if (!this.formSujetoIdentificado.valid) {
          this.formSujetoIdentificado.markAllAsTouched();
          return;
        }
        sujetoIdentificado = { ...this.formSujetoIdentificado.value };
        this.accion.emit({
          accion: 'guardar',
          sujetoIdentificado
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formSujetoIdentificado);
        if (!this.formSujetoIdentificado.valid) {
          this.formSujetoIdentificado.markAllAsTouched();
          return;
        }
        sujetoIdentificado = { ...this.formSujetoIdentificado.value };
        this.accion.emit({
          accion,
          sujetoIdentificadoId: this.sujetoIdentificado.id,
          sujetoIdentificado
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
