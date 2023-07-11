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
import { Codificador } from 'src/app/comun/modelos';

import { Grupo } from '../../../modelos';
import { GrupoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-grupo-formulario',
  templateUrl: './grupo-formulario.component.html',
  styles: []
})
export class GrupoFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formGrupo: FormGroup;
  botonOperacion: string;

  grupo: Grupo;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private grupoFacade: GrupoFacade,
    private toastrService: ToastrService
  ) {
    if (!this.grupo) {
      this.grupo = new Grupo();
    }

    this.formGrupo = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.grupoFacade.CorrespondenciaState$.subscribe(({ grupo }) => {
        if (grupo) {
          this.grupo = grupo;
          if (this.tipoOperacion === 'modificar' && this.grupo.id) {
            this.formGrupo.setValue({
              codigo: this.grupo.codigo,
              nombre: this.grupo.nombre,
              descripcion: this.grupo.descripcion
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
    let grupo = new Grupo();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formGrupo);
        if (!this.formGrupo.valid) {
          this.formGrupo.markAllAsTouched();
          return;
        }
        grupo = { ...this.formGrupo.value };
        this.accion.emit({
          accion: 'guardar',
          grupo
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formGrupo);
        if (!this.formGrupo.valid) {
          this.formGrupo.markAllAsTouched();
          return;
        }
        grupo = { ...this.formGrupo.value };
        this.accion.emit({
          accion,
          grupoId: this.grupo.id,
          grupo
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
