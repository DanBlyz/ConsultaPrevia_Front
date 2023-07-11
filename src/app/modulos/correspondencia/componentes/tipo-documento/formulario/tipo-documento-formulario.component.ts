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

import { TipoDocumento } from '../../../modelos';
import { TipoDocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-tipo-documento-formulario',
  templateUrl: './tipo-documento-formulario.component.html',
  styles: []
})
export class TipoDocumentoFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formTipoDocumento: FormGroup;
  botonOperacion: string;

  tipoDocumento: TipoDocumento;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private tipoDocumentoFacade: TipoDocumentoFacade,
    private toastrService: ToastrService
  ) {
    if (!this.tipoDocumento) {
      this.tipoDocumento = new TipoDocumento();
    }

    this.formTipoDocumento = this.fb.group({
      sigla: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      remitente: ['', Validators.required],
      destinatario: ['', Validators.required],
      conPlantilla: [true, Validators.required],
      esPublico: [true, Validators.required],
      citePorUniOrganizacional: [true, Validators.required],
      estaActivo: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.tipoDocumentoFacade.CorrespondenciaState$.subscribe(
        ({ tipoDocumento }) => {
          if (tipoDocumento) {
            this.tipoDocumento = tipoDocumento;
            if (this.tipoOperacion === 'modificar' && this.tipoDocumento.id) {
              this.formTipoDocumento.setValue({
                sigla: this.tipoDocumento.sigla,
                nombre: this.tipoDocumento.nombre,
                descripcion: this.tipoDocumento.descripcion || '',
                remitente: this.tipoDocumento.remitente,
                destinatario: this.tipoDocumento.destinatario,
                conPlantilla: this.tipoDocumento.conPlantilla,
                esPublico: this.tipoDocumento.esPublico,
                citePorUniOrganizacional:
                  this.tipoDocumento.citePorUniOrganizacional,
                estaActivo: this.tipoDocumento.estaActivo
              });
            }
          }
        }
      )
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
    let tipoDocumento = new TipoDocumento();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formTipoDocumento);
        if (!this.formTipoDocumento.valid) {
          this.formTipoDocumento.markAllAsTouched();
          return;
        }
        tipoDocumento = { ...this.formTipoDocumento.value };
        delete tipoDocumento.estaActivo;
        this.accion.emit({
          accion: 'guardar',
          tipoDocumento
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formTipoDocumento);
        if (!this.formTipoDocumento.valid) {
          this.formTipoDocumento.markAllAsTouched();
          return;
        }
        tipoDocumento = { ...this.formTipoDocumento.value };
        this.accion.emit({
          accion,
          tipoDocumentoId: this.tipoDocumento.id,
          tipoDocumento
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
