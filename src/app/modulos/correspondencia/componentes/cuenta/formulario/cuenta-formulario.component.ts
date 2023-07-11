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

import { Cuenta } from '../../../modelos';
import { CuentaFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-cuenta-formulario',
  templateUrl: './cuenta-formulario.component.html',
  styles: []
})
export class CuentaFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formCuenta: FormGroup;
  botonOperacion: string;

  cuenta: Cuenta;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private cuentaFacade: CuentaFacade,
    private toastrService: ToastrService
  ) {
    if (!this.cuenta) {
      this.cuenta = new Cuenta();
    }

    this.formCuenta = this.fb.group({
      codigo: ['', Validators.required],
      modoAutenticacion: ['', Validators.required],
      nombre: ['', Validators.required],
      clave: ['', Validators.required],
      contrasenia: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.cuentaFacade.CorrespondenciaState$.subscribe(({ cuenta }) => {
        if (cuenta) {
          this.cuenta = cuenta;
          if (this.tipoOperacion === 'modificar' && this.cuenta.id) {
            this.formCuenta.setValue({
              codigo: this.cuenta.codigo,
              modoAutenticacion: this.cuenta.modoAutenticacion,
              nombre: this.cuenta.nombre,
              contrasenia: this.cuenta.contrasenia
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
    let cuenta = new Cuenta();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formCuenta);
        if (!this.formCuenta.valid) {
          this.formCuenta.markAllAsTouched();
          return;
        }
        cuenta = { ...this.formCuenta.value };
        this.accion.emit({
          accion: 'guardar',
          cuenta
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formCuenta);
        if (!this.formCuenta.valid) {
          this.formCuenta.markAllAsTouched();
          return;
        }
        cuenta = { ...this.formCuenta.value };
        this.accion.emit({
          accion,
          cuentaId: this.cuenta.id,
          cuenta
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
