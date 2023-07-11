import { formatDate } from '@angular/common';
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

import { FuncionesHelper } from '../../../../../comun/auxiliares';
import { Codificador } from '../../../../../comun/modelos';

import { Buzon, BuzonUsuario, Persona } from '../../../modelos';
import { BuzonFacade, UniOrganizacionalFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-buzon-usuario-formulario',
  templateUrl: './buzon-usuario-formulario.component.html',
  styles: []
})
export class BuzonUsuarioFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formBuzonUsuario: FormGroup;
  botonOperacion: string;

  buzon: Buzon;
  buzonUsuario: BuzonUsuario;
  listaUniOrganizacionalCodificador: Codificador[];
  listaPersona: Persona[];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private buzonFacade: BuzonFacade,
    private uniOrganizacionalFacade: UniOrganizacionalFacade,
    private toastrService: ToastrService
  ) {
    if (!this.buzonUsuario) {
      this.buzonUsuario = new BuzonUsuario();
    }

    this.formBuzonUsuario = this.fb.group({
      tipoAcceso: ['', Validators.required],
      codCuenta: ['', Validators.required],
      nombre: ['', Validators.required],
      iniciales: ['', Validators.required],
      fecInicio: ['', Validators.required],
      fecConclusion: [''],
      estado: ['ACTIVO', Validators.required],
      buzonId: ['', Validators.required],
      refPersonaId: ['', Validators.required],
      refUniOrganizacionalId: ['']
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.buzonFacade.CorrespondenciaState$.subscribe(({ buzon }) => {
        if (buzon) {
          this.buzon = buzon;
          this.formBuzonUsuario.controls['buzonId'].setValue(this.buzon.id);
          this.formBuzonUsuario.controls['refUniOrganizacionalId'].setValue(
            this.buzon.refUniOrganizacionalId
          );

          this.uniOrganizacionalFacade
            .obtenerPersonas(this.buzon.refUniOrganizacionalId)
            .then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                this.listaPersona = respuesta.lista;
              }
            });
        }
      })
    );

    this.suscripcion.add(
      this.buzonFacade.CorrespondenciaState$.subscribe(({ buzonUsuario }) => {
        if (buzonUsuario) {
          this.buzonUsuario = buzonUsuario;
          if (this.tipoOperacion === 'modificar' && this.buzonUsuario.id) {
            this.uniOrganizacionalFacade
              .obtenerPersonas(this.buzonUsuario.refUniOrganizacionalId)
              .then((respuesta) => {
                if (respuesta.tipoRespuesta === 'Exito') {
                  this.listaPersona = respuesta.lista;
                }
              });
            this.formBuzonUsuario.setValue({
              tipoAcceso: this.buzonUsuario.tipoAcceso,
              codCuenta: this.buzonUsuario.codCuenta,
              nombre: this.buzonUsuario.nombre,
              iniciales: this.buzonUsuario.iniciales,
              fecInicio: formatDate(
                this.buzonUsuario.fecInicio,
                'yyyy-MM-dd',
                this.locale,
                'UTC'
              ),
              fecConclusion: this.buzonUsuario.fecConclusion
                ? formatDate(
                    this.buzonUsuario.fecConclusion,
                    'yyyy-MM-dd',
                    this.locale,
                    'UTC'
                  )
                : '',
              estado: this.buzonUsuario.estado,
              buzonId: this.buzonUsuario.buzonId,
              refPersonaId: this.buzonUsuario.refPersonaId,
              refUniOrganizacionalId: this.buzonUsuario.refUniOrganizacionalId
            });
          }
        }
      })
    );

    this.uniOrganizacionalFacade.obtenerCodificador().then((respuesta) => {
      if (respuesta.tipoRespuesta === 'Exito') {
        this.listaUniOrganizacionalCodificador = respuesta.lista;
      }
    });

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

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
      case 'uni-organizacional-seleccionado': {
        this.uniOrganizacionalFacade
          .obtenerPersonas(evento.id)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.listaPersona = respuesta.lista;
            }
          });
        break;
      }
      case 'persona-seleccionada': {
        const persona = this.listaPersona.find((item) => item.id === evento.id);
        if (persona) {
          this.formBuzonUsuario.controls['nombre'].setValue(
            `${persona.nombre} ${persona.primApellido} ${persona.segApellido}`
          );
          this.formBuzonUsuario.controls['codCuenta'].setValue(
            persona.codCuenta
          );
        }
        break;
      }
    }
  }

  ejecutarAccion(accion: string): void {
    let buzonUsuario = new BuzonUsuario();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formBuzonUsuario);
        if (this.formBuzonUsuario.controls['fecConclusion'].value === '') {
          this.formBuzonUsuario.controls['fecConclusion'].setValue(null);
        }
        if (!this.formBuzonUsuario.valid) {
          this.formBuzonUsuario.markAllAsTouched();
          return;
        }
        buzonUsuario = {
          ...this.formBuzonUsuario.value
        };
        delete buzonUsuario.estado;
        this.accion.emit({
          accion: 'guardar',
          buzonId: this.buzon.id,
          buzonUsuario
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formBuzonUsuario);
        if (this.formBuzonUsuario.controls['fecConclusion'].value === '') {
          this.formBuzonUsuario.controls['fecConclusion'].setValue(null);
        }
        if (!this.formBuzonUsuario.valid) {
          this.formBuzonUsuario.markAllAsTouched();
          return;
        }
        buzonUsuario = {
          ...this.formBuzonUsuario.value
        };
        this.accion.emit({
          accion,
          buzonId: this.buzon.id,
          buzonUsuarioId: this.buzonUsuario.id,
          buzonUsuario
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
