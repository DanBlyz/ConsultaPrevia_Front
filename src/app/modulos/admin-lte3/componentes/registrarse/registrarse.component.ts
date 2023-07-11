import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { EnvironmentHelper, FuncionesHelper } from 'src/app/comun/auxiliares';
import { Validadores } from 'src/app/comun/validadores';

import { SeguridadFacade } from 'src/app/seguridad/fachadas';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-lte3-registrarse',
  templateUrl: './registrarse.component.html',
  styles: []
})
export class RegistrarseComponent implements OnInit, OnDestroy {
  private env = EnvironmentHelper.obtenerConfiguracion('autenticacion');

  suscripcion = new Subscription();
  formRegistro: FormGroup;
  denominacion: string;
  permiteRegistrarse: boolean;
  terminosObligatorios: boolean;
  procesando = false;

  roles: string[];

  constructor(
    private router: Router,
    public seguridadFacade: SeguridadFacade,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.denominacion = environment.denominacion;
    if (this.env['registro'] && this.env['registro']['roles']) {
      this.permiteRegistrarse = true;
      this.roles = this.env['registro']['roles'];
    } else {
      this.permiteRegistrarse = false;
      this.roles = null;
    }
    this.terminosObligatorios = false;
    if (this.env['registro'] && this.env['registro']['terminosObligatorios']) {
      this.terminosObligatorios = Boolean(
        this.env['registro']['terminosObligatorios']
      );
    }

    this.formRegistro = this.fb.group({
      cuenta: [{ value: '', disabled: false }, Validators.required],
      contrasenia: [{ value: '', disabled: false }, Validators.required],
      confirmaContrasenia: [
        { value: '', disabled: false },
        [Validators.required, Validadores.confirmarControl('contrasenia')]
      ],
      nomPublico: [{ value: '', disabled: false }, Validators.required],
      correoElectronico: [
        { value: '', disabled: false },
        [Validators.required, Validators.email]
      ],
      terminos: [false],
      roles: [null]
    });
    if (this.terminosObligatorios) {
      this.formRegistro.controls['terminos'].setValidators(
        Validators.requiredTrue
      );
    }
  }

  ngOnInit(): void {
    if (!this.permiteRegistrarse) {
      this.router.navigate([environment.paginaAutenticacion]);
    }

    this.suscripcion.add(
      this.seguridadFacade.ComunState$.subscribe(({ procesando }) => {
        this.procesando = procesando;
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  reestablecerContrasenia(): void {
    this.formRegistro.controls['confirmaContrasenia'].setValue('');
  }

  registrarse(): void {
    if (
      this.formRegistro.controls['contrasenia'].value !==
      this.formRegistro.controls['confirmaContrasenia'].value
    ) {
      this.toastr.error(
        'Las contraseñas no coinciden, verifique la información.',
        'Creación de cuentas'
      );
    }
    this.formRegistro.patchValue({
      cuenta: this.formRegistro.controls['correoElectronico'].value,
      roles: this.roles || null
    });
    FuncionesHelper.limpiarEspacios(this.formRegistro);
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }
    this.seguridadFacade
      .registrarse(this.formRegistro.getRawValue())
      .then((respuesta) => {
        if (respuesta) {
          this.router.navigate([environment.paginaAutenticacion]);
        }
      });
  }
}
