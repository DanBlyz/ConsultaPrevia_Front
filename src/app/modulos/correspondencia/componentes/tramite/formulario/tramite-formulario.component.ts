import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';

import { Tramite } from '../../../modelos';
import { TramiteFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-tramite-formulario',
  templateUrl: './tramite-formulario.component.html',
  styles: []
})
export class TramiteFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formTramite: FormGroup;
  botonOperacion: string;

  tramite: Tramite;
 
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private tramiteFacade: TramiteFacade,
    private toastrService: ToastrService,
  ) {
    if (!this.tramite) {
      this.tramite = new Tramite();
    }

    this.formTramite = this.fb.group({
      correlativo: ['', Validators.required],
      codigoUnico: [0, Validators.required],
      areaMinera: ['', Validators.required],
      clasificacion: ['', Validators.required],
      nroCuadricula: [0, Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      municipio: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.tramiteFacade.CorrespondenciaState$.subscribe(({ tramite }) => {
        if (tramite) {
          this.tramite = tramite;
          if (this.tipoOperacion === 'modificar' && this.tramite.id) {
            this.formTramite.setValue({
              correlativo: this.tramite.correlativo,
              codigoUnico: this.tramite.codigoUnico,
              areaMinera: this.tramite.areaMinera,
              clasificacion: this.tramite.clasificacion,
              departamento: this.tramite.departamento,
              provincia: this.tramite.provincia,
              municipio: this.tramite.municipio,
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
    let tramite = new Tramite();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formTramite);
        if (!this.formTramite.valid) {
          this.formTramite.markAllAsTouched();
          return;
        }
        tramite = { ...this.formTramite.value };
        tramite.estado = 'PENDIENTE'
        tramite.correlativo = "AJAMD-"+this.formTramite.get('correlativo').value;
        this.accion.emit({
          accion: 'guardar',
          tramite
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formTramite);
        if (!this.formTramite.valid) {
          this.formTramite.markAllAsTouched();
          return;
        }
        tramite = { ...this.formTramite.value };
        this.accion.emit({
          accion,
          tramiteId: this.tramite.id,
          tramite
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
