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

import { Resolucion } from '../../../modelos';
import { ResolucionFacade } from '../../../fachadas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-correspondencia-resolucion-formulario',
  templateUrl: './resolucion-formulario.component.html',
  styles: []
})
export class ResolucionFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  arr = this.router.url.split('/');
  suscripcion = new Subscription();

  formResolucion: FormGroup;
  botonOperacion: string;

  resolucion: Resolucion;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private resolucionFacade: ResolucionFacade,
    private toastrService: ToastrService,
    private router: Router
  ) {
    if (!this.resolucion) {
      this.resolucion = new Resolucion();
    }

    this.formResolucion = this.fb.group({
      informe: ['', Validators.required],
      resolucion: ['', Validators.required],
      informeAprobado: ['', Validators.required],
      actoAdministrativo: ['', Validators.required],
      resolucionPdf: ['', Validators.required],
      asunto: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.resolucionFacade.CorrespondenciaState$.subscribe(({ resolucion }) => {
        if (resolucion) {
          this.resolucion = resolucion;
          if (this.tipoOperacion === 'modificar' && this.resolucion.id) {
            this.formResolucion.setValue({
              informe: this.resolucion.informe,
              resolucion: this.resolucion.resolucion,
              informeAprobado: this.resolucion.informeAprobado,
              actoAdministrativo: this.resolucion.actoAdministrativo,
              resolucionPdf: this.resolucion.resolucionPdf,
              asunto: this.resolucion.asunto
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
    let resolucion = new Resolucion();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formResolucion);
        if (!this.formResolucion.valid) {
          this.formResolucion.markAllAsTouched();
          return;
        }
        resolucion = { ...this.formResolucion.value };
        this.accion.emit({
          accion: 'guardar',
          resolucion
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formResolucion);
        if (!this.formResolucion.valid) {
          this.formResolucion.markAllAsTouched();
          return;
        }
        resolucion = { ...this.formResolucion.value };
        resolucion.flujo = this.arr[1];
        this.accion.emit({
          accion,
          resolucionId: this.resolucion.id,
          resolucion
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
