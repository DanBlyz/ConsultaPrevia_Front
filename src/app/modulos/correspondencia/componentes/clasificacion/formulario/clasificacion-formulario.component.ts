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

import { Clasificacion } from '../../../modelos';
import { ClasificacionFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-clasificacion-formulario',
  templateUrl: './clasificacion-formulario.component.html',
  styles: []
})
export class ClasificacionFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formClasificacion: FormGroup;
  botonOperacion: string;

  clasificacion: Clasificacion;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private clasificacionFacade: ClasificacionFacade,
    private toastrService: ToastrService
  ) {
    if (!this.clasificacion) {
      this.clasificacion = new Clasificacion();
    }

    this.formClasificacion = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
      //estaActivo: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.clasificacionFacade.CorrespondenciaState$.subscribe(
        ({ clasificacion }) => {
          if (clasificacion) {
            this.clasificacion = clasificacion;
            if (this.tipoOperacion === 'modificar' && this.clasificacion.id) {
              this.formClasificacion.setValue({
                nombre: this.clasificacion.nombre,
                descripcion: this.clasificacion.descripcion || ''
                //estaActivo: this.clasificacion.estaActivo
              });
            }
          }
        }
      )
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
    let clasificacion = new Clasificacion();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formClasificacion);
        if (!this.formClasificacion.valid) {
          this.formClasificacion.markAllAsTouched();
          return;
        }
        clasificacion = { ...this.formClasificacion.value };
        this.accion.emit({
          accion: 'guardar',
          clasificacion
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formClasificacion);
        if (!this.formClasificacion.valid) {
          this.formClasificacion.markAllAsTouched();
          return;
        }
        clasificacion = { ...this.formClasificacion.value };
        this.accion.emit({
          accion,
          clasificacionId: this.clasificacion.id,
          clasificacion
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
