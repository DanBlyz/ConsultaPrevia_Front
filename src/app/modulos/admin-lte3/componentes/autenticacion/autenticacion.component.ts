import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { EnvironmentHelper, FuncionesHelper } from 'src/app/comun/auxiliares';

import { SeguridadFacade } from 'src/app/seguridad/fachadas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-lte3-autenticacion',
  templateUrl: './autenticacion.component.html',
  styles: []
})
export class AutenticacionComponent implements OnInit, OnDestroy {
  private env = EnvironmentHelper.obtenerConfiguracion('autenticacion');

  suscripcion = new Subscription();

  formAutenticacion: FormGroup;

  denominacion: string;
  permiteRegistrarse: boolean;

  procesando = false;

  constructor(
    private router: Router,
    public seguridadFacade: SeguridadFacade,
    private fb: FormBuilder
  ) {
    this.denominacion = environment.denominacion;
    this.permiteRegistrarse =
      this.env['registro'] && this.env['registro']['roles'] ? true : false;

    this.formAutenticacion = this.fb.group({
      usuario: [{ value: '', disabled: false }, Validators.required],
      contrasenia: [{ value: '', disabled: false }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.seguridadFacade.ComunState$.subscribe(({ procesando }) => {
        this.procesando = procesando;
        if (this.procesando) {
          this.formAutenticacion.controls['usuario'].disable();
          this.formAutenticacion.controls['contrasenia'].disable();
        } else {
          this.formAutenticacion.controls['usuario'].enable();
          this.formAutenticacion.controls['contrasenia'].enable();
        }
      })
    );
    this.suscripcion.add(
      this.seguridadFacade.AutenticacionState$.subscribe(({ usuario }) => {
        if (usuario) {
          this.router.navigate([environment.paginaInicio]);
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  iniciarSesion(): void {
    FuncionesHelper.limpiarEspacios(this.formAutenticacion);
    if (this.formAutenticacion.invalid) {
      this.formAutenticacion.markAllAsTouched();
      return;
    }
    this.seguridadFacade.iniciarSesion(
      this.formAutenticacion.controls['usuario'].value,
      this.formAutenticacion.controls['contrasenia'].value
    );
  }
}
