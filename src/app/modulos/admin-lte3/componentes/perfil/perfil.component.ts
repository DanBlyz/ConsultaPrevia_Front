import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';
import { UsuarioAutenticado } from 'src/app/seguridad/modelos';
import { SeguridadFacade } from 'src/app/seguridad/fachadas';

@Component({
  selector: 'app-admin-lte3-perfil',
  templateUrl: './perfil.component.html',
  styles: []
})
export class PerfilComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();
  formPerfil: FormGroup;

  usuarioAutenticado: UsuarioAutenticado;

  constructor(
    private seguridadFacade: SeguridadFacade,
    private fb: FormBuilder
  ) {
    this.formPerfil = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nomPublico: ['', Validators.required],
      correoElectronico: [
        { value: '', disabled: false },
        [Validators.required, Validators.email]
      ]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.seguridadFacade.AutenticacionState$.subscribe(({ usuario }) => {
        if (usuario) {
          this.usuarioAutenticado = usuario;
          this.formPerfil.patchValue({
            nombre: this.usuarioAutenticado.nombre,
            apellido: this.usuarioAutenticado.apellido,
            nomPublico: this.usuarioAutenticado.nomPublico,
            correoElectronico: this.usuarioAutenticado.correoElectronico
          });
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  actualizar(): void {
    FuncionesHelper.limpiarEspacios(this.formPerfil);
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }
    this.seguridadFacade.actualizar(
      this.usuarioAutenticado.codCuenta,
      this.formPerfil.getRawValue()
    );
  }
}
