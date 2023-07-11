import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';
import { Validadores } from 'src/app/comun/validadores';
import { UsuarioAutenticado } from 'src/app/seguridad/modelos';
import { SeguridadFacade } from 'src/app/seguridad/fachadas';

@Component({
  selector: 'app-admin-lte3-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styles: []
})
export class CambiarContraseniaComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();
  formContrasenia: FormGroup;

  usuarioAutenticado: UsuarioAutenticado;

  constructor(
    private seguridadFacade: SeguridadFacade,
    private fb: FormBuilder
  ) {
    this.formContrasenia = this.fb.group({
      contrasenia: ['', Validators.required],
      nuevaContrasenia: ['', Validators.required],
      confirmaContrasenia: [
        '',
        [Validators.required, Validadores.confirmarControl('nuevaContrasenia')]
      ]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.seguridadFacade.AutenticacionState$.subscribe(({ usuario }) => {
        if (usuario) {
          this.usuarioAutenticado = usuario;
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  actualizar(): void {
    FuncionesHelper.limpiarEspacios(this.formContrasenia);
    if (this.formContrasenia.invalid) {
      this.formContrasenia.markAllAsTouched();
      return;
    }
    this.seguridadFacade.cambiarContrasenia(
      this.usuarioAutenticado.codCuenta,
      this.formContrasenia.controls['contrasenia'].value,
      this.formContrasenia.controls['nuevaContrasenia'].value
    );
  }
}
