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

import { Buzon } from '../../../modelos';
import { BuzonFacade, UniOrganizacionalFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-buzon-formulario',
  templateUrl: './buzon-formulario.component.html',
  styles: []
})
export class BuzonFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formBuzon: FormGroup;
  botonOperacion: string;

  buzon: Buzon;
  listaUniOrganizacionalCodificador: Codificador[];
  listaPuestoCodificador: Codificador[];

  uniOrganizacionalIdSeleccionado: number;
  puestoIdSeleccionado: number;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private buzonFacade: BuzonFacade,
    private uniOrganizacionalFacade: UniOrganizacionalFacade,
    private toastrService: ToastrService
  ) {
    if (!this.buzon) {
      this.buzon = new Buzon();
    }

    this.formBuzon = this.fb.group({
      uniOrganizacional: ['', Validators.required],
      puesto: ['', Validators.required],
      nivelJerarquico: ['', Validators.required],
      esReceptorCorrespondenciaExterna: [false, Validators.required],
      estado: ['ACTIVO', Validators.required],
      refUniOrganizacionalId: ['', Validators.required],
      refPuestoId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.buzonFacade.CorrespondenciaState$.subscribe(({ buzon }) => {
        if (buzon) {
          this.buzon = buzon;
          if (this.tipoOperacion === 'modificar' && this.buzon.id) {
            this.formBuzon.setValue({
              uniOrganizacional: this.buzon.uniOrganizacional,
              puesto: this.buzon.puesto,
              nivelJerarquico: this.buzon.nivelJerarquico,
              esReceptorCorrespondenciaExterna:
                this.buzon.esReceptorCorrespondenciaExterna,
              estado: this.buzon.estado,
              refUniOrganizacionalId: this.buzon.refUniOrganizacionalId,
              refPuestoId: this.buzon.refPuestoId
            });
            this.uniOrganizacionalFacade
              .obtenerPuestosCodificador(this.buzon.refUniOrganizacionalId)
              .then((respuesta) => {
                if (respuesta.tipoRespuesta === 'Exito') {
                  this.listaPuestoCodificador = respuesta.lista;
                  this.formBuzon.controls['refPuestoId'].setValue(
                    this.buzon.refPuestoId
                  );
                }
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
        this.uniOrganizacionalIdSeleccionado = evento.id;
        const uniOrganizacional = this.listaUniOrganizacionalCodificador.filter(
          (item) => item.id === evento.id
        );
        this.formBuzon.controls['uniOrganizacional'].setValue(
          uniOrganizacional[0].nombre
        );
        this.uniOrganizacionalFacade
          .obtenerPuestosCodificador(evento.id)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.listaPuestoCodificador = respuesta.lista;
              this.formBuzon.controls['refPuestoId'].setValue('');
            }
          });
        break;
      }
      case 'puesto-seleccionado': {
        this.puestoIdSeleccionado = evento.id;
        const puesto = this.listaPuestoCodificador.find(
          (item) => item.id === evento.id
        );
        if (puesto) {
          this.uniOrganizacionalFacade
            .obtenerPuestosPorUniOrganizacionalId(
              this.uniOrganizacionalIdSeleccionado,
              this.puestoIdSeleccionado
            )
            .then((respuesta) => {
              this.formBuzon.controls['nivelJerarquico'].setValue(
                respuesta.objeto.nivelJerarquico
              );
            });
          this.formBuzon.controls['puesto'].setValue(puesto.nombre);
        } else {
          this.formBuzon.controls['puesto'].setValue('');
        }
        break;
      }
    }
  }

  ejecutarAccion(accion: string): void {
    let buzon = new Buzon();
    switch (accion) {
      case 'crear': {
        FuncionesHelper.limpiarEspacios(this.formBuzon);
        if (!this.formBuzon.valid) {
          this.formBuzon.markAllAsTouched();
          return;
        }
        buzon = { ...this.formBuzon.value };
        delete buzon.estado;
        this.accion.emit({
          accion: 'guardar',
          buzon
        });
        break;
      }
      case 'modificar': {
        FuncionesHelper.limpiarEspacios(this.formBuzon);
        if (!this.formBuzon.valid) {
          this.formBuzon.markAllAsTouched();
          return;
        }
        buzon = { ...this.formBuzon.value };
        this.accion.emit({
          accion,
          buzonId: this.buzon.id,
          buzon
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
