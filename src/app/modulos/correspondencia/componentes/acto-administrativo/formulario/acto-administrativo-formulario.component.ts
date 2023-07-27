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

import { ActoAdministrativo } from '../../../modelos';
import { ActoAdministrativoFacade } from '../../../fachadas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-correspondencia-acto-administrativo-formulario',
  templateUrl: './acto-administrativo-formulario.component.html',
  styles: []
})
export class ActoAdministrativoFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formActoAdministrativo: FormGroup;
  botonOperacion: string;

  actoAdministrativo: ActoAdministrativo;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private actoAdministrativoFacade: ActoAdministrativoFacade,
    private toastrService: ToastrService,
    private router: Router
  ) {
    if (!this.actoAdministrativo) {
      this.actoAdministrativo = new ActoAdministrativo();
    }

    this.formActoAdministrativo = this.fb.group({
      viajeRealizado: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.actoAdministrativoFacade.CorrespondenciaState$.subscribe(({ actoAdministrativo }) => {
        if (actoAdministrativo) {
          this.actoAdministrativo = actoAdministrativo;
          if (this.tipoOperacion === 'modificar' && this.actoAdministrativo.id) {
            this.formActoAdministrativo.setValue({
              viajeRealizado: this.actoAdministrativo.viajeRealizado
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
      case 'actoAdministrativo':
        this.botonOperacion = 'Guardar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    let actoAdministrativo = new ActoAdministrativo();
    console.log("actos ",accion)
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formActoAdministrativo);
        if (!this.formActoAdministrativo.valid) {
          this.formActoAdministrativo.markAllAsTouched();
          return;
        }
        actoAdministrativo = { ...this.formActoAdministrativo.value };
        let arr = this.router.url.split('/');
        actoAdministrativo.flujo = arr[1];
        this.accion.emit({
          accion: 'guardar',
          actoAdministrativo
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formActoAdministrativo);
        if (!this.formActoAdministrativo.valid) {
          this.formActoAdministrativo.markAllAsTouched();
          return;
        }
        actoAdministrativo = { ...this.formActoAdministrativo.value };
        this.accion.emit({
          accion,
          actoAdministrativoId: this.actoAdministrativo.id,
          actoAdministrativo
        });
        break;
      }
      case 'cancelar': {
        this.accion.emit({
          accion
        });
        break;
      }
      case 'actoAdministrativo': {
        FuncionesHelper.limpiarEspacios(this.formActoAdministrativo);
        if (!this.formActoAdministrativo.valid) {
          this.formActoAdministrativo.markAllAsTouched();
          return;
        }
        actoAdministrativo = { ...this.formActoAdministrativo.value };
        let arr = this.router.url.split('/');
        actoAdministrativo.viajeRealizado = false;
        actoAdministrativo.flujo = arr[1];
        this.accion.emit({
          accion: 'guardarActoAdministrativo',
          actoAdministrativo
        });
        break;
      }
    }
  }
}
