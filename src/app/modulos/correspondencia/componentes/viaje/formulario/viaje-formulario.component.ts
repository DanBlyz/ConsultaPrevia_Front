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

import { Viaje } from '../../../modelos';
import { ViajeFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-viaje-formulario',
  templateUrl: './viaje-formulario.component.html',
  styles: []
})
export class ViajeFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formViaje: FormGroup;
  botonOperacion: string;

  viaje: Viaje;
  
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private viajeFacade: ViajeFacade,
    private toastrService: ToastrService
  ) {
    if (!this.viaje) {
      this.viaje = new Viaje();
    }

    this.formViaje = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      descripcion: ['', Validators.required],
      nroFormulario: ['', Validators.required],
      formularioPdf: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.viajeFacade.CorrespondenciaState$.subscribe(({ viaje }) => {
        if (viaje) {
          this.viaje = viaje;
          if (this.tipoOperacion === 'modificar' && this.viaje.id) {
            this.formViaje.setValue({
              fechaInicio: this.viaje.fechaInicio,
              fechaFin: this.viaje.fechaFin,
              descripcion: this.viaje.descripcion,
              nroFormulario: this.viaje.nroFormulario,
              formularioPdf: this.viaje.formularioPdf
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
    let viaje = new Viaje();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formViaje);
        if (!this.formViaje.valid) {
          this.formViaje.markAllAsTouched();
          return;
        }
        viaje = { ...this.formViaje.value };
        viaje.fk_idActos = 12;
        console.log(viaje.fechaInicio);
        this.accion.emit({
          accion: 'guardar',
          viaje
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formViaje);
        if (!this.formViaje.valid) {
          this.formViaje.markAllAsTouched();
          return;
        }
        viaje = { ...this.formViaje.value };
        this.accion.emit({
          accion,
          viajeId: this.viaje.id,
          viaje
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
