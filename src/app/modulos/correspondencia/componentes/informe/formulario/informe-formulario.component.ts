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

import { Informe } from '../../../modelos';
import { InformeFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-informe-formulario',
  templateUrl: './informe-formulario.component.html',
  styles: []
})
export class InformeFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formInforme: FormGroup;
  botonOperacion: string;

  informe: Informe;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private informeFacade: InformeFacade,
    private toastrService: ToastrService
  ) {
    if (!this.informe) {
      this.informe = new Informe();
    }

    this.formInforme = this.fb.group({
      correlativo: ['', Validators.required],
      referencia: ['', Validators.required],
      asunto: ['', Validators.required],
      encargado: ['', Validators.required],
      nro: ['', Validators.required],
      nroSujetos: ['', Validators.required],
      comunidad: ['', Validators.required],
      representante: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.informeFacade.CorrespondenciaState$.subscribe(({ informe }) => {
        if (informe) {
          this.informe = informe;
          if (this.tipoOperacion === 'modificar' && this.informe.id) {
            this.formInforme.setValue({
              correlativo: this.informe.correlativo,
              referencia: this.informe.referencia,
              asunto: this.informe.asunto,
              encargado: this.informe.encargado
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
    let informe = new Informe();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        informe = { ...this.formInforme.value };
        this.accion.emit({
          accion: 'guardar',
          informe
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formInforme);
        if (!this.formInforme.valid) {
          this.formInforme.markAllAsTouched();
          return;
        }
        informe = { ...this.formInforme.value };
        this.accion.emit({
          accion,
          informeId: this.informe.id,
          informe
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
