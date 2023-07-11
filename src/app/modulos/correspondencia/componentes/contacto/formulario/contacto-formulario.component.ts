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

import { Contacto } from '../../../modelos';
import { ContactoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-contacto-formulario',
  templateUrl: './contacto-formulario.component.html',
  styles: []
})
export class ContactoFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formContacto: FormGroup;
  botonOperacion: string;

  contacto: Contacto;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private contactoFacade: ContactoFacade,
    private toastrService: ToastrService
  ) {
    if (!this.contacto) {
      this.contacto = new Contacto();
    }

    this.formContacto = this.fb.group({
      nombre: ['', Validators.required],
      puesto: ['', Validators.required],
      uniOrganizacional: ['', Validators.required],
      entidad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.contactoFacade.CorrespondenciaState$.subscribe(({ contacto }) => {
        if (contacto) {
          this.contacto = contacto;
          if (this.tipoOperacion === 'modificar' && this.contacto.id) {
            this.formContacto.setValue({
              nombre: this.contacto.nombre,
              puesto: this.contacto.puesto,
              uniOrganizacional: this.contacto.uniOrganizacional,
              entidad: this.contacto.entidad
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
    let contacto = new Contacto();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formContacto);
        if (!this.formContacto.valid) {
          this.formContacto.markAllAsTouched();
          return;
        }
        contacto = { ...this.formContacto.value };
        this.accion.emit({
          accion: 'guardar',
          contacto
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formContacto);
        if (!this.formContacto.valid) {
          this.formContacto.markAllAsTouched();
          return;
        }
        contacto = { ...this.formContacto.value };
        this.accion.emit({
          accion,
          contactoId: this.contacto.id,
          contacto
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
