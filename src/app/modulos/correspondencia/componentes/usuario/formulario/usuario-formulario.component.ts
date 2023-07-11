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

import { Usuario } from '../../../modelos';
import { UsuarioFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-usuario-formulario',
  templateUrl: './usuario-formulario.component.html',
  styles: []
})
export class UsuarioFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formUsuario: FormGroup;
  botonOperacion: string;

  usuario: Usuario;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private usuarioFacade: UsuarioFacade,
    private toastrService: ToastrService
  ) {
    if (!this.usuario) {
      this.usuario = new Usuario();
    }

    this.formUsuario = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nomPublico: ['', Validators.required],
      correoElectronico: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.usuarioFacade.CorrespondenciaState$.subscribe(({ usuario }) => {
        if (usuario) {
          this.usuario = usuario;
          if (this.tipoOperacion === 'modificar' && this.usuario.id) {
            this.formUsuario.setValue({
              id: this.usuario.id,
              nombre: this.usuario.nombre,
              apellido: this.usuario.apellido,
              nomPublico: this.usuario.nomPublico,
              correoElectronico: this.usuario.correoElectronico
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
    let usuario = new Usuario();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formUsuario);
        if (!this.formUsuario.valid) {
          this.formUsuario.markAllAsTouched();
          return;
        }
        usuario = { ...this.formUsuario.value };
        this.accion.emit({
          accion: 'guardar',
          usuario
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formUsuario);
        if (!this.formUsuario.valid) {
          this.formUsuario.markAllAsTouched();
          return;
        }
        usuario = { ...this.formUsuario.value };
        this.accion.emit({
          accion,
          usuarioId: this.usuario.id,
          usuario
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
