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

import { Rol } from '../../../modelos';
import { RolFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-rol-formulario',
  templateUrl: './rol-formulario.component.html',
  styles: []
})
export class RolFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formRol: FormGroup;
  botonOperacion: string;

  rol: Rol;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private rolFacade: RolFacade,
    private toastrService: ToastrService
  ) {
    if (!this.rol) {
      this.rol = new Rol();
    }

    this.formRol = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      grupoId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.rolFacade.CorrespondenciaState$.subscribe(({ rol }) => {
        if (rol) {
          this.rol = rol;
          if (this.tipoOperacion === 'modificar' && this.rol.id) {
            this.formRol.setValue({
              codigo: this.rol.codigo,
              nombre: this.rol.nombre,
              grupoId: this.rol.grupoId
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
    let rol = new Rol();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formRol);
        if (!this.formRol.valid) {
          this.formRol.markAllAsTouched();
          return;
        }
        rol = { ...this.formRol.value };
        this.accion.emit({
          accion: 'guardar',
          rol
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formRol);
        if (!this.formRol.valid) {
          this.formRol.markAllAsTouched();
          return;
        }
        rol = { ...this.formRol.value };
        this.accion.emit({
          accion,
          rolId: this.rol.id,
          rol
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
